// Database Factory with Graceful PostgreSQL Connection Fallback
import { LocalDatabase, getDatabase as getLocalDatabase } from './db.js';
import { PgDatabase } from './pg/db.js';
import { PgConnectionManager } from './pg/connection.js';

let activeDatabaseInstance = null;
let activeDatabaseMetadata = null;

export async function createDatabase(options = {}) {
  // 1. Explicit db instance override (for tests or DI)
  if (options.db) {
    activeDatabaseInstance = options.db;
    activeDatabaseMetadata = {
      backend: options.db.type || (options.db instanceof PgDatabase ? 'postgres' : 'sqlite-local'),
      isFallback: false
    };
    return activeDatabaseInstance;
  }

  const requestedBackend = options.backend || process.env.DB_BACKEND || 'sqlite';
  const forcePostgres = requestedBackend === 'postgres' || options.usePostgres === true;

  if (forcePostgres) {
    try {
      const pgConnection = new PgConnectionManager(options.pgConfig || {});
      const test = await pgConnection.testConnection();

      if (test.connected) {
        const pgDb = new PgDatabase(pgConnection);
        await pgDb.init({
          runMigrations: options.runMigrations !== false,
          seedData: options.seedData !== false
        });

        activeDatabaseInstance = pgDb;
        activeDatabaseMetadata = {
          backend: 'postgres',
          isFallback: false,
          serverTime: test.serverTime,
          config: test.config
        };
        console.log(`[Database] Successfully connected to PostgreSQL at ${test.config.host}:${test.config.port}/${test.config.database}`);
        return activeDatabaseInstance;
      } else {
        console.warn(`[Database Warning] Failed to connect to PostgreSQL (${test.error}). Gracefully falling back to local SQLite database.`);
        const fallbackDb = new LocalDatabase(options.dbPath);
        activeDatabaseInstance = fallbackDb;
        activeDatabaseMetadata = {
          backend: 'sqlite-fallback',
          isFallback: true,
          fallbackReason: test.error,
          requestedBackend: 'postgres'
        };
        return activeDatabaseInstance;
      }
    } catch (err) {
      console.warn(`[Database Warning] Unexpected error connecting to PostgreSQL (${err.message}). Gracefully falling back to local SQLite database.`);
      const fallbackDb = new LocalDatabase(options.dbPath);
      activeDatabaseInstance = fallbackDb;
      activeDatabaseMetadata = {
        backend: 'sqlite-fallback',
        isFallback: true,
        fallbackReason: err.message,
        requestedBackend: 'postgres'
      };
      return activeDatabaseInstance;
    }
  }

  // Default: SQLite local database
  const localDb = options.dbPath ? new LocalDatabase(options.dbPath) : getLocalDatabase();
  activeDatabaseInstance = localDb;
  activeDatabaseMetadata = {
    backend: 'sqlite-local',
    isFallback: false
  };
  return activeDatabaseInstance;
}

export function getDatabaseMetadata() {
  return activeDatabaseMetadata || {
    backend: 'sqlite-local',
    isFallback: false
  };
}
