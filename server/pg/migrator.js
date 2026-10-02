// PostgreSQL Schema Migrator
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

export class PgMigrator {
  constructor(clientOrPool, migrationsDir = DEFAULT_MIGRATIONS_DIR) {
    this.executor = clientOrPool;
    this.migrationsDir = migrationsDir;
  }

  async ensureMigrationsTable() {
    await this.executor.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version       TEXT PRIMARY KEY,
        description   TEXT NOT NULL,
        applied_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async getAppliedVersions() {
    await this.ensureMigrationsTable();
    const res = await this.executor.query('SELECT version FROM schema_migrations ORDER BY version ASC');
    return new Set(res.rows.map(r => r.version));
  }

  getMigrationFiles() {
    if (!fs.existsSync(this.migrationsDir)) {
      return [];
    }
    return fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  async runMigrations() {
    await this.ensureMigrationsTable();
    const applied = await this.getAppliedVersions();
    const files = this.getMigrationFiles();
    const results = [];

    for (const file of files) {
      // Extract version prefix, e.g. "001" from "001_initial_schema.sql"
      const match = file.match(/^(\d+)_(.*)\.sql$/);
      const version = match ? match[1] : file.replace('.sql', '');
      const description = match ? match[2].replace(/_/g, ' ') : file;

      if (applied.has(version)) {
        results.push({ version, file, status: 'SKIPPED_ALREADY_APPLIED' });
        continue;
      }

      const filePath = path.join(this.migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute migration
      await this.executor.query(sql);

      // Record migration version
      await this.executor.query(
        `INSERT INTO schema_migrations (version, description, applied_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (version) DO NOTHING`,
        [version, description]
      );

      results.push({ version, file, status: 'APPLIED' });
    }

    return results;
  }
}

export async function runMigrations(clientOrPool, migrationsDir) {
  const migrator = new PgMigrator(clientOrPool, migrationsDir);
  return migrator.runMigrations();
}
