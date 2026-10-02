// Disruption Repository for PostgreSQL
export class DisruptionRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, reported_at as "reportedAt", type, title, status, severity,
             bus_id as "busId", route_id as "routeId", student_id as "studentId",
             location, impact, ai_recommendation as "aiRecommendation",
             original_state as "originalState", proposed_state as "proposedState",
             final_state as "finalState", raw_json
      FROM disruptions
      ORDER BY created_at DESC, id DESC
    `);
    return res.rows.map(row => {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
      return {
        ...raw,
        id: row.id,
        reportedAt: row.reportedAt,
        type: row.type,
        title: row.title,
        status: row.status,
        severity: row.severity,
        busId: row.busId,
        routeId: row.routeId,
        studentId: row.studentId,
        location: row.location,
        impact: row.impact,
        aiRecommendation: row.aiRecommendation || raw.aiRecommendation,
        originalState: row.originalState || raw.originalState,
        proposedState: row.proposedState || raw.proposedState,
        finalState: row.finalState || raw.finalState
      };
    });
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, reported_at as "reportedAt", type, title, status, severity,
             bus_id as "busId", route_id as "routeId", student_id as "studentId",
             location, impact, ai_recommendation as "aiRecommendation",
             original_state as "originalState", proposed_state as "proposedState",
             final_state as "finalState", raw_json
      FROM disruptions
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
    return {
      ...raw,
      id: row.id,
      reportedAt: row.reportedAt,
      type: row.type,
      title: row.title,
      status: row.status,
      severity: row.severity,
      busId: row.busId,
      routeId: row.routeId,
      studentId: row.studentId,
      location: row.location,
      impact: row.impact,
      aiRecommendation: row.aiRecommendation || raw.aiRecommendation,
      originalState: row.originalState || raw.originalState,
      proposedState: row.proposedState || raw.proposedState,
      finalState: row.finalState || raw.finalState
    };
  }

  async upsert(disruption) {
    await this.executor.query(`
      INSERT INTO disruptions (
        id, reported_at, type, title, status, severity,
        bus_id, route_id, student_id, location, impact,
        ai_recommendation, original_state, proposed_state, final_state,
        raw_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        reported_at = EXCLUDED.reported_at,
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        severity = EXCLUDED.severity,
        bus_id = EXCLUDED.bus_id,
        route_id = EXCLUDED.route_id,
        student_id = EXCLUDED.student_id,
        location = EXCLUDED.location,
        impact = EXCLUDED.impact,
        ai_recommendation = EXCLUDED.ai_recommendation,
        original_state = EXCLUDED.original_state,
        proposed_state = EXCLUDED.proposed_state,
        final_state = EXCLUDED.final_state,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      disruption.id,
      disruption.reportedAt || '',
      disruption.type || 'general',
      disruption.title || '',
      disruption.status || 'unresolved',
      disruption.severity || 'warning',
      disruption.busId || null,
      disruption.routeId || null,
      disruption.studentId || null,
      disruption.location || '',
      disruption.impact || '',
      disruption.aiRecommendation ? JSON.stringify(disruption.aiRecommendation) : null,
      disruption.originalState ? JSON.stringify(disruption.originalState) : null,
      disruption.proposedState ? JSON.stringify(disruption.proposedState) : null,
      disruption.finalState ? JSON.stringify(disruption.finalState) : null,
      JSON.stringify(disruption)
    ]);

    return this.getById(disruption.id);
  }
}
