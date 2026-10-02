// Offline Store-and-Forward Actions Repository with Idempotency Protection
export class OfflineActionRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async isActionSynced(actionId) {
    if (!actionId) return false;
    const res = await this.executor.query(`
      SELECT action_id, status
      FROM offline_actions
      WHERE action_id = $1 AND status = 'synced'
    `, [actionId]);
    return res.rows.length > 0;
  }

  async getAction(actionId) {
    if (!actionId) return null;
    const res = await this.executor.query(`
      SELECT action_id as "actionId", action_type as "actionType",
             user_id as "userId", role, status, payload, result,
             error, retry_count as "retryCount", created_at as "createdAt",
             synced_at as "syncedAt", last_attempt_at as "lastAttemptAt"
      FROM offline_actions
      WHERE action_id = $1
    `, [actionId]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      ...row,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result
    };
  }

  async recordSyncedAction(action, result = {}) {
    const actionId = action.actionId || action.id;
    if (!actionId) return null;

    const res = await this.executor.query(`
      INSERT INTO offline_actions (
        action_id, action_type, user_id, role, status,
        payload, result, retry_count, synced_at, last_attempt_at
      ) VALUES ($1, $2, $3, $4, 'synced', $5, $6, $7, NOW(), NOW())
      ON CONFLICT (action_id) DO UPDATE SET
        status = 'synced',
        result = EXCLUDED.result,
        synced_at = NOW(),
        last_attempt_at = NOW()
      RETURNING *;
    `, [
      actionId,
      action.actionType || action.type || 'UNKNOWN_ACTION',
      action.userId || 'dispatcher-1',
      action.role || 'dispatcher',
      action.payload ? JSON.stringify(action.payload) : null,
      JSON.stringify(result),
      action.retryCount || 0
    ]);

    return res.rows[0];
  }

  async recordPendingAction(action) {
    const actionId = action.actionId || action.id;
    if (!actionId) return null;

    const res = await this.executor.query(`
      INSERT INTO offline_actions (
        action_id, action_type, user_id, role, status,
        payload, retry_count, created_at, last_attempt_at
      ) VALUES ($1, $2, $3, $4, 'pending', $5, $6, NOW(), NOW())
      ON CONFLICT (action_id) DO NOTHING
      RETURNING *;
    `, [
      actionId,
      action.actionType || action.type || 'UNKNOWN_ACTION',
      action.userId || 'dispatcher-1',
      action.role || 'dispatcher',
      action.payload ? JSON.stringify(action.payload) : null,
      action.retryCount || 0
    ]);

    return res.rows[0];
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT action_id as "actionId", action_type as "actionType",
             user_id as "userId", role, status, payload, result,
             error, retry_count as "retryCount", created_at as "createdAt",
             synced_at as "syncedAt", last_attempt_at as "lastAttemptAt"
      FROM offline_actions
      ORDER BY created_at DESC
    `);
    return res.rows.map(row => ({
      ...row,
      payload: typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload,
      result: typeof row.result === 'string' ? JSON.parse(row.result) : row.result
    }));
  }
}
