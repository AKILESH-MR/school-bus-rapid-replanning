// PostgreSQL Connection Configuration
import dotenv from 'dotenv';
dotenv.config();

export function getPgConfig(overrides = {}) {
  const isSsl = process.env.PG_SSL === 'true' || process.env.PG_SSL === '1';

  return {
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432', 10),
    database: process.env.PG_DATABASE || 'school_bus_replanning',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    ssl: isSsl ? { rejectUnauthorized: false } : false,
    min: parseInt(process.env.PG_POOL_MIN || '2', 10),
    max: parseInt(process.env.PG_POOL_MAX || '10', 10),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT_MS || '5000', 10),
    ...overrides
  };
}
