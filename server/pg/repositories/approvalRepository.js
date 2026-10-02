// Approvals Repository for PostgreSQL
export class ApprovalRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async recordApproval(approval) {
    const id = approval.id || `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const res = await this.executor.query(`
      INSERT INTO approvals (
        id, replan_id, disruption_id, action, dispatcher_id,
        dispatcher_role, reason, modifications, applied_changes, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `, [
      id,
      approval.replanId || approval.planId || null,
      approval.disruptionId || null,
      approval.action || 'APPROVED',
      approval.dispatcherId || approval.userId || 'dispatcher-1',
      approval.dispatcherRole || approval.userRole || 'Dispatcher',
      approval.reason || null,
      approval.modifications ? JSON.stringify(approval.modifications) : null,
      approval.appliedChanges ? JSON.stringify(approval.appliedChanges) : null
    ]);

    return res.rows[0];
  }

  async getByReplanId(replanId) {
    const res = await this.executor.query(`
      SELECT id, replan_id as "replanId", disruption_id as "disruptionId",
             action, dispatcher_id as "dispatcherId",
             dispatcher_role as "dispatcherRole", reason,
             modifications, applied_changes as "appliedChanges",
             created_at as "createdAt"
      FROM approvals
      WHERE replan_id = $1
      ORDER BY created_at DESC
    `, [replanId]);

    return res.rows.map(row => ({
      ...row,
      modifications: typeof row.modifications === 'string' ? JSON.parse(row.modifications) : row.modifications,
      appliedChanges: typeof row.appliedChanges === 'string' ? JSON.parse(row.appliedChanges) : row.appliedChanges
    }));
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, replan_id as "replanId", disruption_id as "disruptionId",
             action, dispatcher_id as "dispatcherId",
             dispatcher_role as "dispatcherRole", reason,
             modifications, applied_changes as "appliedChanges",
             created_at as "createdAt"
      FROM approvals
      ORDER BY created_at DESC
    `);

    return res.rows.map(row => ({
      ...row,
      modifications: typeof row.modifications === 'string' ? JSON.parse(row.modifications) : row.modifications,
      appliedChanges: typeof row.appliedChanges === 'string' ? JSON.parse(row.appliedChanges) : row.appliedChanges
    }));
  }
}
