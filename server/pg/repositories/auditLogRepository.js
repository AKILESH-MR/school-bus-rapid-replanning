// Audit Log Repository for PostgreSQL (Immutable Append-Only Audit Trail)
export class AuditLogRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, action, action_type as "actionType", user_role as "userRole",
             disruption_id as "disruptionId", recommendation_id as "recommendationId",
             timestamp, original_state as "originalState",
             proposed_state as "proposedState", final_state as "finalState",
             event_message as "eventMessage", details, created_at as "createdAt"
      FROM audit_logs
      ORDER BY timestamp DESC, created_at DESC
    `);
    return res.rows.map(row => {
      const details = typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {});
      return {
        ...details,
        id: row.id,
        action: row.action,
        actionType: row.actionType,
        userRole: row.userRole,
        disruptionId: row.disruptionId,
        recommendationId: row.recommendationId,
        timestamp: row.timestamp,
        originalState: row.originalState || details.originalState,
        proposedState: row.proposedState || details.proposedState,
        finalState: row.finalState || details.finalState,
        eventMessage: row.eventMessage
      };
    });
  }

  async record(log) {
    const id = log.id || `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    log.id = id;

    const res = await this.executor.query(`
      INSERT INTO audit_logs (
        id, action, action_type, user_role, disruption_id, recommendation_id,
        timestamp, original_state, proposed_state, final_state,
        event_message, details, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *;
    `, [
      id,
      log.action || 'AUDIT_EVENT',
      log.actionType || '',
      log.userRole || 'Dispatcher',
      log.disruptionId || null,
      log.recommendationId || null,
      log.timestamp || new Date().toISOString(),
      log.originalState ? JSON.stringify(log.originalState) : null,
      log.proposedState ? JSON.stringify(log.proposedState) : null,
      log.finalState ? JSON.stringify(log.finalState) : null,
      log.eventMessage || '',
      JSON.stringify(log)
    ]);

    return log;
  }

  async getByDisruptionId(disruptionId) {
    const res = await this.executor.query(`
      SELECT id, action, action_type as "actionType", user_role as "userRole",
             disruption_id as "disruptionId", recommendation_id as "recommendationId",
             timestamp, original_state as "originalState",
             proposed_state as "proposedState", final_state as "finalState",
             event_message as "eventMessage", details, created_at as "createdAt"
      FROM audit_logs
      WHERE disruption_id = $1
      ORDER BY timestamp DESC
    `, [disruptionId]);

    return res.rows.map(row => {
      const details = typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {});
      return {
        ...details,
        id: row.id,
        action: row.action,
        actionType: row.actionType,
        userRole: row.userRole,
        disruptionId: row.disruptionId,
        recommendationId: row.recommendationId,
        timestamp: row.timestamp,
        originalState: row.originalState || details.originalState,
        proposedState: row.proposedState || details.proposedState,
        finalState: row.finalState || details.finalState,
        eventMessage: row.eventMessage
      };
    });
  }
}
