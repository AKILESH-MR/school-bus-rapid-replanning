// GPS Telemetry Repository for PostgreSQL
export class GpsRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async recordUpdate(update) {
    const lat = update.latitude !== undefined ? update.latitude : (update.coords ? update.coords[0] : 37.77);
    const lon = update.longitude !== undefined ? update.longitude : (update.coords ? update.coords[1] : -122.42);

    const res = await this.executor.query(`
      INSERT INTO gps_updates (
        bus_id, latitude, longitude, speed_kmh, heading,
        source, gps_status, trust_level, age_seconds,
        is_manual, location_name, is_simulated, payload_json, received_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *;
    `, [
      update.busId,
      lat,
      lon,
      update.speedKmh !== undefined ? update.speedKmh : null,
      update.heading !== undefined ? update.heading : null,
      update.source || 'mock_telematics',
      update.gpsStatus || 'LIVE',
      update.trustLevel || 'HIGH',
      update.ageSeconds !== undefined ? update.ageSeconds : 0,
      Boolean(update.isManual),
      update.locationName || null,
      update.isSimulated !== undefined ? Boolean(update.isSimulated) : true,
      JSON.stringify(update)
    ]);

    return res.rows[0];
  }

  async getRecentForBus(busId, limit = 20) {
    const res = await this.executor.query(`
      SELECT id, bus_id as "busId", latitude, longitude, speed_kmh as "speedKmh",
             heading, source, gps_status as "gpsStatus", trust_level as "trustLevel",
             age_seconds as "ageSeconds", is_manual as "isManual",
             location_name as "locationName", is_simulated as "isSimulated",
             payload_json as "payloadJson", received_at as "receivedAt"
      FROM gps_updates
      WHERE bus_id = $1
      ORDER BY received_at DESC
      LIMIT $2
    `, [busId, limit]);

    return res.rows.map(row => ({
      ...row,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      speedKmh: row.speedKmh ? parseFloat(row.speedKmh) : null,
      coords: [parseFloat(row.latitude), parseFloat(row.longitude)]
    }));
  }

  async getAllRecent(limit = 100) {
    const res = await this.executor.query(`
      SELECT id, bus_id as "busId", latitude, longitude, speed_kmh as "speedKmh",
             heading, source, gps_status as "gpsStatus", trust_level as "trustLevel",
             age_seconds as "ageSeconds", is_manual as "isManual",
             location_name as "locationName", is_simulated as "isSimulated",
             payload_json as "payloadJson", received_at as "receivedAt"
      FROM gps_updates
      ORDER BY received_at DESC
      LIMIT $1
    `, [limit]);

    return res.rows.map(row => ({
      ...row,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      speedKmh: row.speedKmh ? parseFloat(row.speedKmh) : null,
      coords: [parseFloat(row.latitude), parseFloat(row.longitude)]
    }));
  }
}
