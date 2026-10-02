// PostgreSQL Database CLI Helper (Migrate, Seed, Health Status)
import { PgConnectionManager } from './connection.js';
import { runMigrations } from './migrator.js';
import { seedDatabase } from './seed.js';

async function main() {
  const command = process.argv[2] || 'status';
  const conn = new PgConnectionManager();

  console.log(`[PostgreSQL CLI] Testing connection to ${conn.config.host}:${conn.config.port}/${conn.config.database}...`);
  const status = await conn.testConnection();

  if (!status.connected) {
    console.error(`[PostgreSQL CLI Error] Connection failed: ${status.error}`);
    console.log(`Tip: Ensure PostgreSQL is running, or rely on automatic SQLite fallback.`);
    process.exit(1);
  }

  console.log(`[PostgreSQL CLI] Connected successfully. Server time: ${status.serverTime}`);

  if (command === 'migrate') {
    console.log('[PostgreSQL CLI] Running migrations...');
    const results = await runMigrations(conn);
    console.log('[PostgreSQL CLI] Migration results:', results);
  } else if (command === 'seed') {
    const force = process.argv.includes('--force');
    console.log(`[PostgreSQL CLI] Seeding database (force=${force})...`);
    const results = await seedDatabase(conn, { force });
    console.log('[PostgreSQL CLI] Seed results:', results);
  } else if (command === 'status') {
    const res = await conn.query('SELECT COUNT(*) as count FROM buses');
    console.log(`[PostgreSQL CLI Status] Database accessible. Current bus count: ${res.rows[0]?.count}`);
  } else {
    console.log(`Unknown command: ${command}. Available: migrate, seed, status`);
  }

  await conn.close();
}

main().catch(err => {
  console.error('[PostgreSQL CLI Error]:', err);
  process.exit(1);
});
