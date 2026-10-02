// PostgreSQL Connection Manager & Pool Pool Management
import pg from 'pg';
import { getPgConfig } from './config.js';

const { Pool } = pg;

export class PgConnectionManager {
  constructor(configOverrides = {}) {
    this.config = getPgConfig(configOverrides);
    this.pool = null;
    this.isConnected = false;
    this.lastError = null;
  }

  getPool() {
    if (!this.pool) {
      this.pool = new Pool(this.config);

      // Prevent unhandled errors from breaking the process
      this.pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
        this.lastError = err;
        this.isConnected = false;
      });
    }
    return this.pool;
  }

  async testConnection() {
    try {
      const pool = this.getPool();
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT 1 as alive, NOW() as server_time');
        this.isConnected = true;
        this.lastError = null;
        return {
          connected: true,
          serverTime: res.rows[0]?.server_time,
          config: {
            host: this.config.host,
            port: this.config.port,
            database: this.config.database,
            user: this.config.user
          }
        };
      } finally {
        client.release();
      }
    } catch (err) {
      this.isConnected = false;
      this.lastError = err;
      return {
        connected: false,
        error: err.message,
        code: err.code
      };
    }
  }

  async query(text, params) {
    const pool = this.getPool();
    return pool.query(text, params);
  }

  async withTransaction(callback) {
    const pool = this.getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.isConnected = false;
    }
  }
}

let defaultConnection = null;

export function getPgConnection(configOverrides = {}) {
  if (!defaultConnection) {
    defaultConnection = new PgConnectionManager(configOverrides);
  }
  return defaultConnection;
}
