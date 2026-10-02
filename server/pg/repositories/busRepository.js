// Bus Repository for PostgreSQL
export class BusRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, plate, model, type, capacity, current_load as "currentLoad",
             driver_id as "driverId", route_id as "routeId", status, fuel_level as "fuelLevel",
             speed_kmh as "speedKmh", heading, coords, gps_status as "gpsStatus",
             gps_source as "source", age_seconds as "ageSeconds",
             last_gps_sync_ms as "_lastGpsSyncTimeMs", last_gps_sync as "lastGpsSync",
             last_known_location as "lastKnownLocation", is_manual_location as "isManualLocation",
             health_score as "healthScore", amenities, raw_json
      FROM buses
      ORDER BY id ASC
    `);
    return res.rows.map(row => {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
      return {
        ...raw,
        id: row.id,
        capacity: row.capacity,
        currentLoad: row.currentLoad,
        driverId: row.driverId,
        routeId: row.routeId,
        status: row.status,
        fuelLevel: row.fuelLevel,
        speedKmh: row.speedKmh ? parseFloat(row.speedKmh) : 0,
        heading: row.heading,
        coords: row.coords || raw.coords || [37.77, -122.42],
        gpsStatus: row.gpsStatus,
        source: row.source || raw.source,
        ageSeconds: row.ageSeconds,
        _lastGpsSyncTimeMs: row._lastGpsSyncTimeMs ? parseInt(row._lastGpsSyncTimeMs, 10) : raw._lastGpsSyncTimeMs,
        lastGpsSync: row.lastGpsSync,
        lastKnownLocation: row.lastKnownLocation,
        isManualLocation: Boolean(row.isManualLocation),
        healthScore: row.healthScore,
        amenities: row.amenities || raw.amenities || []
      };
    });
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, plate, model, type, capacity, current_load as "currentLoad",
             driver_id as "driverId", route_id as "routeId", status, fuel_level as "fuelLevel",
             speed_kmh as "speedKmh", heading, coords, gps_status as "gpsStatus",
             gps_source as "source", age_seconds as "ageSeconds",
             last_gps_sync_ms as "_lastGpsSyncTimeMs", last_gps_sync as "lastGpsSync",
             last_known_location as "lastKnownLocation", is_manual_location as "isManualLocation",
             health_score as "healthScore", amenities, raw_json
      FROM buses
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
    return {
      ...raw,
      id: row.id,
      capacity: row.capacity,
      currentLoad: row.currentLoad,
      driverId: row.driverId,
      routeId: row.routeId,
      status: row.status,
      fuelLevel: row.fuelLevel,
      speedKmh: row.speedKmh ? parseFloat(row.speedKmh) : 0,
      heading: row.heading,
      coords: row.coords || raw.coords || [37.77, -122.42],
      gpsStatus: row.gpsStatus,
      source: row.source || raw.source,
      ageSeconds: row.ageSeconds,
      _lastGpsSyncTimeMs: row._lastGpsSyncTimeMs ? parseInt(row._lastGpsSyncTimeMs, 10) : raw._lastGpsSyncTimeMs,
      lastGpsSync: row.lastGpsSync,
      lastKnownLocation: row.lastKnownLocation,
      isManualLocation: Boolean(row.isManualLocation),
      healthScore: row.healthScore,
      amenities: row.amenities || raw.amenities || []
    };
  }

  async upsert(bus) {
    const res = await this.executor.query(`
      INSERT INTO buses (
        id, plate, model, type, capacity, current_load, driver_id, route_id,
        status, fuel_level, speed_kmh, heading, coords, gps_status,
        gps_source, age_seconds, last_gps_sync_ms, last_gps_sync,
        last_known_location, is_manual_location, health_score,
        amenities, raw_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        plate = COALESCE(EXCLUDED.plate, buses.plate),
        capacity = EXCLUDED.capacity,
        current_load = EXCLUDED.current_load,
        driver_id = EXCLUDED.driver_id,
        route_id = EXCLUDED.route_id,
        status = EXCLUDED.status,
        fuel_level = EXCLUDED.fuel_level,
        speed_kmh = EXCLUDED.speed_kmh,
        heading = EXCLUDED.heading,
        coords = EXCLUDED.coords,
        gps_status = EXCLUDED.gps_status,
        gps_source = EXCLUDED.gps_source,
        age_seconds = EXCLUDED.age_seconds,
        last_gps_sync_ms = EXCLUDED.last_gps_sync_ms,
        last_gps_sync = EXCLUDED.last_gps_sync,
        last_known_location = EXCLUDED.last_known_location,
        is_manual_location = EXCLUDED.is_manual_location,
        health_score = EXCLUDED.health_score,
        amenities = EXCLUDED.amenities,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW()
      RETURNING *;
    `, [
      bus.id,
      bus.plate || bus.number || bus.id,
      bus.model || 'Standard School Bus',
      bus.type || 'Diesel',
      bus.capacity || 54,
      bus.currentLoad !== undefined ? bus.currentLoad : 0,
      bus.driverId || null,
      bus.routeId || null,
      bus.status || 'in_service',
      bus.fuelLevel !== undefined ? bus.fuelLevel : 100,
      bus.speedKmh !== undefined ? bus.speedKmh : 0,
      bus.heading !== undefined ? bus.heading : 0,
      bus.coords || [37.77, -122.42],
      bus.gpsStatus || 'live',
      bus.source || bus.gpsSource || 'mock_telematics',
      bus.ageSeconds || 0,
      bus._lastGpsSyncTimeMs || Date.now(),
      bus.lastGpsSync || new Date().toISOString(),
      bus.lastKnownLocation || null,
      Boolean(bus.isManualLocation),
      bus.healthScore || 100,
      bus.amenities || [],
      JSON.stringify(bus)
    ]);

    return this.getById(bus.id);
  }
}
