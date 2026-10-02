// Student Repository for PostgreSQL
export class StudentRepository {
  constructor(executor) {
    this.executor = executor;
  }

  async getAll() {
    const res = await this.executor.query(`
      SELECT id, name, grade, school_id as "schoolId", school_name as "schoolName",
             bus_id as "busId", route_id as "routeId", stop_name as "stopName",
             pickup_lat as "pickupLat", pickup_lon as "pickupLon",
             guardian_name as "guardianName", guardian_phone as "guardianPhone",
             status, special_needs as "specialNeeds", photo, raw_json
      FROM students
      ORDER BY id ASC
    `);
    return res.rows.map(row => {
      const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
      return {
        ...raw,
        id: row.id,
        name: row.name,
        grade: row.grade,
        schoolId: row.schoolId,
        schoolName: row.schoolName,
        busId: row.busId,
        routeId: row.routeId,
        stopName: row.stopName,
        pickupCoords: [
          row.pickupLat ? parseFloat(row.pickupLat) : 37.77,
          row.pickupLon ? parseFloat(row.pickupLon) : -122.42
        ],
        guardianName: row.guardianName,
        guardianPhone: row.guardianPhone,
        status: row.status,
        specialNeeds: row.specialNeeds,
        photo: row.photo
      };
    });
  }

  async getById(id) {
    const res = await this.executor.query(`
      SELECT id, name, grade, school_id as "schoolId", school_name as "schoolName",
             bus_id as "busId", route_id as "routeId", stop_name as "stopName",
             pickup_lat as "pickupLat", pickup_lon as "pickupLon",
             guardian_name as "guardianName", guardian_phone as "guardianPhone",
             status, special_needs as "specialNeeds", photo, raw_json
      FROM students
      WHERE id = $1
    `, [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const raw = typeof row.raw_json === 'string' ? JSON.parse(row.raw_json) : (row.raw_json || {});
    return {
      ...raw,
      id: row.id,
      name: row.name,
      grade: row.grade,
      schoolId: row.schoolId,
      schoolName: row.schoolName,
      busId: row.busId,
      routeId: row.routeId,
      stopName: row.stopName,
      pickupCoords: [
        row.pickupLat ? parseFloat(row.pickupLat) : 37.77,
        row.pickupLon ? parseFloat(row.pickupLon) : -122.42
      ],
      guardianName: row.guardianName,
      guardianPhone: row.guardianPhone,
      status: row.status,
      specialNeeds: row.specialNeeds,
      photo: row.photo
    };
  }

  async upsert(student) {
    const lat = student.pickupCoords ? student.pickupCoords[0] : (student.pickupLat || 37.77);
    const lon = student.pickupCoords ? student.pickupCoords[1] : (student.pickupLon || -122.42);

    await this.executor.query(`
      INSERT INTO students (
        id, name, grade, school_id, school_name, bus_id, route_id,
        stop_name, pickup_lat, pickup_lon, guardian_name, guardian_phone,
        status, special_needs, photo, raw_json, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        grade = EXCLUDED.grade,
        school_id = EXCLUDED.school_id,
        school_name = EXCLUDED.school_name,
        bus_id = EXCLUDED.bus_id,
        route_id = EXCLUDED.route_id,
        stop_name = EXCLUDED.stop_name,
        pickup_lat = EXCLUDED.pickup_lat,
        pickup_lon = EXCLUDED.pickup_lon,
        guardian_name = EXCLUDED.guardian_name,
        guardian_phone = EXCLUDED.guardian_phone,
        status = EXCLUDED.status,
        special_needs = EXCLUDED.special_needs,
        photo = EXCLUDED.photo,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      student.id,
      student.name,
      student.grade || 'K-5',
      student.schoolId || 'SCH-01',
      student.schoolName || '',
      student.busId || null,
      student.routeId || null,
      student.stopName || '',
      lat,
      lon,
      student.guardianName || null,
      student.guardianPhone || null,
      student.status || 'waiting',
      student.specialNeeds || 'None',
      student.photo || null,
      JSON.stringify(student)
    ]);

    return this.getById(student.id);
  }
}
