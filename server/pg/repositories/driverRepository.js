// Driver Repository for PostgreSQL
export class DriverRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, name, phone, license, rating, experience_yrs as "experienceYrs",
             status, availability_status as "availabilityStatus",
             current_assignment as "currentAssignment", current_location as "currentLocation",
             location_source as "locationSource", is_location_stale as "isLocationStale",
             shift_start as "shiftStart", shift_end as "shiftEnd", photo, raw_json
      FROM drivers
      ORDER BY id ASC
    `);
    return res.rows.map(row => {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
      return {
        ...raw,
        id: row.id,
        name: row.name,
        phone: row.phone,
        license: row.license,
        rating: row.rating ? parseFloat(row.rating) : 4.5,
        experienceYrs: row.experienceYrs,
        status: row.status,
        availabilityStatus: row.availabilityStatus,
        currentAssignment: row.currentAssignment,
        currentLocation: row.currentLocation || raw.currentLocation,
        locationSource: row.locationSource,
        isLocationStale: Boolean(row.isLocationStale),
        shiftStart: row.shiftStart,
        shiftEnd: row.shiftEnd,
        photo: row.photo
      };
    });
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, name, phone, license, rating, experience_yrs as "experienceYrs",
             status, availability_status as "availabilityStatus",
             current_assignment as "currentAssignment", current_location as "currentLocation",
             location_source as "locationSource", is_location_stale as "isLocationStale",
             shift_start as "shiftStart", shift_end as "shiftEnd", photo, raw_json
      FROM drivers
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
    return {
      ...raw,
      id: row.id,
      name: row.name,
      phone: row.phone,
      license: row.license,
      rating: row.rating ? parseFloat(row.rating) : 4.5,
      experienceYrs: row.experienceYrs,
      status: row.status,
      availabilityStatus: row.availabilityStatus,
      currentAssignment: row.currentAssignment,
      currentLocation: row.currentLocation || raw.currentLocation,
      locationSource: row.locationSource,
      isLocationStale: Boolean(row.isLocationStale),
      shiftStart: row.shiftStart,
      shiftEnd: row.shiftEnd,
      photo: row.photo
    };
  }

  async upsert(driver) {
    await this.executor.query(`
      INSERT INTO drivers (
        id, name, phone, license, rating, experience_yrs, status,
        availability_status, current_assignment, current_location,
        location_source, is_location_stale, shift_start, shift_end,
        photo, raw_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        license = EXCLUDED.license,
        rating = EXCLUDED.rating,
        experience_yrs = EXCLUDED.experience_yrs,
        status = EXCLUDED.status,
        availability_status = EXCLUDED.availability_status,
        current_assignment = EXCLUDED.current_assignment,
        current_location = EXCLUDED.current_location,
        location_source = EXCLUDED.location_source,
        is_location_stale = EXCLUDED.is_location_stale,
        shift_start = EXCLUDED.shift_start,
        shift_end = EXCLUDED.shift_end,
        photo = EXCLUDED.photo,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      driver.id || driver.driverId,
      driver.name,
      driver.phone || null,
      driver.license || null,
      driver.rating || 4.5,
      driver.experienceYrs || 0,
      driver.status || 'active',
      driver.availabilityStatus || 'active',
      driver.currentAssignment || null,
      driver.currentLocation || [37.77, -122.42],
      driver.locationSource || 'last_known',
      Boolean(driver.isLocationStale),
      driver.shiftStart || null,
      driver.shiftEnd || null,
      driver.photo || null,
      JSON.stringify(driver)
    ]);

    return this.getById(driver.id || driver.driverId);
  }
}
