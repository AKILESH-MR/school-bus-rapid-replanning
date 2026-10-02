// Route & Route Stops Repository for PostgreSQL
export class RouteRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, name, school_id as "schoolId", school_name as "schoolName",
             assigned_bus as "assignedBus", assigned_driver as "assignedDriver",
             status, total_stops as "totalStops", completed_stops as "completedStops",
             total_students as "totalStudents", scheduled_start_time as "scheduledStartTime",
             scheduled_arrival_time as "scheduledArrivalTime", current_eta as "currentEta",
             delay_minutes as "delayMinutes", color, raw_json
      FROM routes
      ORDER BY id ASC
    `);

    const routes = [];
    for (const row of res.rows) {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
      const stops = await this.getStopsForRoute(row.id);
      routes.push({
        ...raw,
        id: row.id,
        name: row.name,
        schoolId: row.schoolId,
        schoolName: row.schoolName,
        assignedBus: row.assignedBus,
        assignedDriver: row.assignedDriver,
        status: row.status,
        totalStops: stops.length > 0 ? stops.length : row.totalStops,
        completedStops: row.completedStops,
        totalStudents: row.totalStudents,
        delayMinutes: row.delayMinutes ? parseFloat(row.delayMinutes) : 0,
        color: row.color,
        stops: stops.length > 0 ? stops : (raw.stops || [])
      });
    }
    return routes;
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, name, school_id as "schoolId", school_name as "schoolName",
             assigned_bus as "assignedBus", assigned_driver as "assignedDriver",
             status, total_stops as "totalStops", completed_stops as "completedStops",
             total_students as "totalStudents", scheduled_start_time as "scheduledStartTime",
             scheduled_arrival_time as "scheduledArrivalTime", current_eta as "currentEta",
             delay_minutes as "delayMinutes", color, raw_json
      FROM routes
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
    const stops = await this.getStopsForRoute(id);

    return {
      ...raw,
      id: row.id,
      name: row.name,
      schoolId: row.schoolId,
      schoolName: row.schoolName,
      assignedBus: row.assignedBus,
      assignedDriver: row.assignedDriver,
      status: row.status,
      totalStops: stops.length > 0 ? stops.length : row.totalStops,
      completedStops: row.completedStops,
      totalStudents: row.totalStudents,
      delayMinutes: row.delayMinutes ? parseFloat(row.delayMinutes) : 0,
      color: row.color,
      stops: stops.length > 0 ? stops : (raw.stops || [])
    };
  }

  async getStopsForRoute(routeId) {
    const res = await this.executor.query(`
      SELECT id, route_id as "routeId", sequence_order as "sequenceOrder",
             name, lat, lon, scheduled_time as "scheduledTime",
             students_count as "studentsCount", status
      FROM route_stops
      WHERE route_id = $1
      ORDER BY sequence_order ASC
    `, [routeId]);

    return res.rows.map(row => ({
      id: row.id,
      name: row.name,
      coords: [row.lat ? parseFloat(row.lat) : 37.77, row.lon ? parseFloat(row.lon) : -122.42],
      lat: row.lat ? parseFloat(row.lat) : 37.77,
      lon: row.lon ? parseFloat(row.lon) : -122.42,
      time: row.scheduledTime,
      scheduledTime: row.scheduledTime,
      studentsCount: row.studentsCount,
      status: row.status
    }));
  }

  async upsert(route) {
    const stops = Array.isArray(route.stops) ? route.stops : [];

    await this.executor.query(`
      INSERT INTO routes (
        id, name, school_id, school_name, assigned_bus, assigned_driver,
        status, total_stops, completed_stops, total_students,
        scheduled_start_time, scheduled_arrival_time, current_eta,
        delay_minutes, color, raw_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        school_id = EXCLUDED.school_id,
        school_name = EXCLUDED.school_name,
        assigned_bus = EXCLUDED.assigned_bus,
        assigned_driver = EXCLUDED.assigned_driver,
        status = EXCLUDED.status,
        total_stops = EXCLUDED.total_stops,
        completed_stops = EXCLUDED.completed_stops,
        total_students = EXCLUDED.total_students,
        delay_minutes = EXCLUDED.delay_minutes,
        color = EXCLUDED.color,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      route.id,
      route.name,
      route.schoolId || 'SCH-01',
      route.schoolName || '',
      route.assignedBus || null,
      route.assignedDriver || null,
      route.status || 'on_time',
      stops.length || route.totalStops || 0,
      route.completedStops || 0,
      route.totalStudents || 0,
      route.scheduledStartTime || '07:00 AM',
      route.scheduledArrivalTime || '08:15 AM',
      route.currentEta || '08:15 AM',
      route.delayMinutes || 0,
      route.color || '#3b82f6',
      JSON.stringify(route)
    ]);

    // Upsert route_stops if stops array is provided
    if (stops.length > 0) {
      // Remove old stops not in the new list or replace
      await this.executor.query('DELETE FROM route_stops WHERE route_id = $1', [route.id]);

      let seq = 0;
      for (const stop of stops) {
        seq++;
        const stopId = stop.id || `ST-${route.id}-${seq}`;
        const lat = stop.coords ? stop.coords[0] : (stop.lat || 37.77);
        const lon = stop.coords ? stop.coords[1] : (stop.lon || -122.42);

        await this.executor.query(`
          INSERT INTO route_stops (
            id, route_id, sequence_order, name, lat, lon, scheduled_time, students_count, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `, [
          stopId,
          route.id,
          seq,
          stop.name || `Stop ${seq}`,
          lat,
          lon,
          stop.time || stop.scheduledTime || '07:30 AM',
          stop.studentsCount || 0,
          stop.status || 'pending'
        ]);
      }
    }

    return this.getById(route.id);
  }
}
