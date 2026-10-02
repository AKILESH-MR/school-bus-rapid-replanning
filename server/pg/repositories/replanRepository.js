// Replan & Replan Candidates Repository for PostgreSQL
export class ReplanRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, disruption_id as "disruptionId", status, strategy,
             recommended_bus_id as "recommendedBusId",
             recommended_route_id as "recommendedRouteId",
             score, details, created_at as "createdAt", updated_at as "updatedAt"
      FROM replans
      ORDER BY created_at DESC
    `);
    return res.rows.map(row => {
      const details = typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {});
      return {
        ...details,
        id: row.id,
        planId: row.id,
        disruptionId: row.disruptionId,
        status: row.status,
        strategy: row.strategy,
        recommendedBusId: row.recommendedBusId,
        recommendedRouteId: row.recommendedRouteId,
        score: row.score ? parseFloat(row.score) : 0,
        createdAt: row.createdAt
      };
    });
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, disruption_id as "disruptionId", status, strategy,
             recommended_bus_id as "recommendedBusId",
             recommended_route_id as "recommendedRouteId",
             score, details, created_at as "createdAt", updated_at as "updatedAt"
      FROM replans
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const details = typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {});
    const candidates = await this.getCandidates(id);

    return {
      ...details,
      id: row.id,
      planId: row.id,
      disruptionId: row.disruptionId,
      status: row.status,
      strategy: row.strategy,
      recommendedBusId: row.recommendedBusId,
      recommendedRouteId: row.recommendedRouteId,
      score: row.score ? parseFloat(row.score) : 0,
      candidates: candidates.length > 0 ? candidates : details.feasibleCandidates,
      createdAt: row.createdAt
    };
  }

  async getCandidates(replanId) {
    const res = await this.executor.query(`
      SELECT id, replan_id as "replanId", bus_id as "busId", route_id as "routeId",
             rank, score, is_recommended as "isRecommended",
             rejection_reason as "rejectionReason", score_breakdown as "scoreBreakdown",
             gps_status as "gpsStatus", created_at as "createdAt"
      FROM replan_candidates
      WHERE replan_id = $1
      ORDER BY rank ASC
    `, [replanId]);

    return res.rows.map(row => ({
      id: row.id,
      replanId: row.replanId,
      busId: row.busId,
      routeId: row.routeId,
      rank: row.rank,
      score: row.score ? parseFloat(row.score) : 0,
      isRecommended: Boolean(row.isRecommended),
      rejectionReason: row.rejectionReason,
      scoreBreakdown: row.scoreBreakdown,
      gpsStatus: row.gpsStatus
    }));
  }

  async upsert(replan) {
    const planId = replan.id || replan.planId;

    await this.executor.query(`
      INSERT INTO replans (
        id, disruption_id, status, strategy, recommended_bus_id,
        recommended_route_id, score, details, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        strategy = EXCLUDED.strategy,
        recommended_bus_id = EXCLUDED.recommended_bus_id,
        recommended_route_id = EXCLUDED.recommended_route_id,
        score = EXCLUDED.score,
        details = EXCLUDED.details,
        updated_at = NOW();
    `, [
      planId,
      replan.disruptionId || null,
      replan.status || 'pending_review',
      replan.strategy || 'Greedy Insertion',
      replan.recommendedBusId || null,
      replan.recommendedRouteId || null,
      replan.score !== undefined ? replan.score : 0,
      JSON.stringify(replan)
    ]);

    // Save candidates if present
    const feasible = replan.feasibleCandidates || replan.details?.feasibleCandidates || [];
    const rejected = replan.rejectedCandidates || replan.details?.rejectedCandidates || [];

    if (feasible.length > 0 || rejected.length > 0) {
      await this.executor.query('DELETE FROM replan_candidates WHERE replan_id = $1', [planId]);

      let rank = 1;
      for (const cand of feasible) {
        const busId = cand.bus?.id || cand.busId;
        const routeId = cand.route?.id || cand.routeId;
        await this.executor.query(`
          INSERT INTO replan_candidates (
            replan_id, bus_id, route_id, rank, score, is_recommended,
            rejection_reason, score_breakdown, gps_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `, [
          planId,
          busId || 'UNKNOWN',
          routeId || null,
          rank,
          cand.score !== undefined ? cand.score : 0,
          rank === 1,
          null,
          cand.scoreBreakdown ? JSON.stringify(cand.scoreBreakdown) : null,
          cand.gpsStatus || cand.bus?.gpsStatus || null
        ]);
        rank++;
      }

      for (const rej of rejected) {
        const busId = rej.bus?.id || rej.busId;
        await this.executor.query(`
          INSERT INTO replan_candidates (
            replan_id, bus_id, route_id, rank, score, is_recommended,
            rejection_reason, score_breakdown, gps_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `, [
          planId,
          busId || 'UNKNOWN',
          null,
          rank,
          rej.score !== undefined ? rej.score : -999,
          false,
          rej.reason || rej.rejectionReason || 'Hard constraint failed',
          null,
          rej.gpsStatus || null
        ]);
        rank++;
      }
    }

    return this.getById(planId);
  }
}
