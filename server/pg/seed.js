// PostgreSQL Seeder matching MVP Demo Data
import { BUSES, ROUTES, STUDENTS, DISRUPTIONS, DRIVERS } from '../../src/data/mockData.js';

export async function seedDatabase(executor, options = { force: false }) {
  const force = options.force || false;

  // Check if buses already seeded
  const checkRes = await executor.query('SELECT COUNT(*) as count FROM buses');
  const count = parseInt(checkRes.rows[0]?.count || '0', 10);

  if (count > 0 && !force) {
    return {
      status: 'SKIPPED_ALREADY_SEEDED',
      busesCount: count
    };
  }

  if (force) {
    // Truncate in reverse foreign key order
    await executor.query(`
      TRUNCATE TABLE route_stops, replan_candidates, approvals, replans,
                     disruptions, students, routes, drivers, buses,
                     gps_updates, offline_actions, audit_logs CASCADE;
    `);
  }

  // 1. Seed Drivers
  for (const drv of DRIVERS) {
    await executor.query(`
      INSERT INTO drivers (
        id, name, phone, license, rating, experience_yrs, status,
        availability_status, current_assignment, current_location,
        location_source, is_location_stale, shift_start, shift_end,
        photo, raw_json, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        status = EXCLUDED.status,
        availability_status = EXCLUDED.availability_status,
        current_assignment = EXCLUDED.current_assignment,
        current_location = EXCLUDED.current_location,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      drv.id || drv.driverId,
      drv.name,
      drv.phone || null,
      drv.license || null,
      drv.rating || 4.5,
      drv.experienceYrs || 0,
      drv.status || 'active',
      drv.availabilityStatus || 'active',
      drv.currentAssignment || null,
      drv.currentLocation || [37.77, -122.42],
      drv.locationSource || 'last_known',
      drv.isLocationStale || false,
      drv.shiftStart || null,
      drv.shiftEnd || null,
      drv.photo || null,
      JSON.stringify(drv)
    ]);
  }

  // 2. Seed Buses
  for (const b of BUSES) {
    await executor.query(`
      INSERT INTO buses (
        id, plate, model, type, capacity, current_load, driver_id, route_id,
        status, fuel_level, speed_kmh, heading, coords, gps_status,
        gps_source, age_seconds, last_gps_sync_ms, last_gps_sync,
        last_known_location, is_manual_location, health_score,
        amenities, raw_json, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        capacity = EXCLUDED.capacity,
        current_load = EXCLUDED.current_load,
        driver_id = EXCLUDED.driver_id,
        route_id = EXCLUDED.route_id,
        status = EXCLUDED.status,
        coords = EXCLUDED.coords,
        gps_status = EXCLUDED.gps_status,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      b.id,
      b.plate || b.number || b.id,
      b.model || 'Blue Bird Vision',
      b.type || 'Diesel',
      b.capacity || 54,
      b.currentLoad || 0,
      b.driverId || null,
      b.routeId || null,
      b.status || 'in_service',
      b.fuelLevel || 100,
      b.speedKmh || 0,
      b.heading || 0,
      b.coords || [37.77, -122.42],
      b.gpsStatus || 'live',
      b.source || b.gpsSource || 'mock_telematics',
      b.ageSeconds || 0,
      b._lastGpsSyncTimeMs || Date.now(),
      b.lastGpsSync || new Date().toISOString(),
      b.lastKnownLocation || null,
      Boolean(b.isManualLocation),
      b.healthScore || 100,
      b.amenities || [],
      JSON.stringify(b)
    ]);
  }

  // 3. Seed Routes and Route Stops
  for (const r of ROUTES) {
    await executor.query(`
      INSERT INTO routes (
        id, name, school_id, school_name, assigned_bus, assigned_driver,
        status, total_stops, completed_stops, total_students,
        scheduled_start_time, scheduled_arrival_time, current_eta,
        delay_minutes, color, raw_json, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
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
      r.id,
      r.name,
      r.schoolId || 'SCH-01',
      r.schoolName || 'District School',
      r.assignedBus || null,
      r.assignedDriver || null,
      r.status || 'on_time',
      r.stops ? r.stops.length : (r.totalStops || 0),
      r.completedStops || 0,
      r.totalStudents || 0,
      r.scheduledStartTime || '07:00 AM',
      r.scheduledArrivalTime || '08:15 AM',
      r.currentEta || '08:15 AM',
      r.delayMinutes || 0,
      r.color || '#3b82f6',
      JSON.stringify(r)
    ]);

    // Seed Route Stops if present
    if (Array.isArray(r.stops)) {
      let seq = 0;
      for (const stop of r.stops) {
        seq++;
        const stopId = stop.id || `ST-${r.id}-${seq}`;
        const lat = stop.coords ? stop.coords[0] : (stop.lat || 37.77);
        const lon = stop.coords ? stop.coords[1] : (stop.lon || -122.42);
        await executor.query(`
          INSERT INTO route_stops (
            id, route_id, sequence_order, name, lat, lon, scheduled_time, students_count, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (route_id, id) DO UPDATE SET
            sequence_order = EXCLUDED.sequence_order,
            name = EXCLUDED.name,
            lat = EXCLUDED.lat,
            lon = EXCLUDED.lon,
            scheduled_time = EXCLUDED.scheduled_time,
            students_count = EXCLUDED.students_count,
            status = EXCLUDED.status;
        `, [
          stopId,
          r.id,
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
  }

  // 4. Seed Students
  for (const s of STUDENTS) {
    const lat = s.pickupCoords ? s.pickupCoords[0] : (s.pickupLat || 37.77);
    const lon = s.pickupCoords ? s.pickupCoords[1] : (s.pickupLon || -122.42);
    await executor.query(`
      INSERT INTO students (
        id, name, grade, school_id, school_name, bus_id, route_id,
        stop_name, pickup_lat, pickup_lon, guardian_name, guardian_phone,
        status, special_needs, photo, raw_json, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        grade = EXCLUDED.grade,
        bus_id = EXCLUDED.bus_id,
        route_id = EXCLUDED.route_id,
        stop_name = EXCLUDED.stop_name,
        status = EXCLUDED.status,
        special_needs = EXCLUDED.special_needs,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      s.id,
      s.name,
      s.grade || 'K-5',
      s.schoolId || 'SCH-01',
      s.schoolName || 'District School',
      s.busId || null,
      s.routeId || null,
      s.stopName || '',
      lat,
      lon,
      s.guardianName || null,
      s.guardianPhone || null,
      s.status || 'waiting',
      s.specialNeeds || 'None',
      s.photo || null,
      JSON.stringify(s)
    ]);
  }

  // 5. Seed Disruptions
  for (const d of DISRUPTIONS) {
    await executor.query(`
      INSERT INTO disruptions (
        id, reported_at, type, title, status, severity,
        bus_id, route_id, student_id, location, impact,
        ai_recommendation, original_state, proposed_state,
        raw_json, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        severity = EXCLUDED.severity,
        ai_recommendation = EXCLUDED.ai_recommendation,
        original_state = EXCLUDED.original_state,
        proposed_state = EXCLUDED.proposed_state,
        raw_json = EXCLUDED.raw_json,
        updated_at = NOW();
    `, [
      d.id,
      d.reportedAt || '07:30 AM',
      d.type || 'breakdown',
      d.title || 'Operational Disruption',
      d.status || 'unresolved',
      d.severity || 'warning',
      d.busId || null,
      d.routeId || null,
      d.studentId || null,
      d.location || '',
      d.impact || '',
      d.aiRecommendation ? JSON.stringify(d.aiRecommendation) : null,
      d.originalState ? JSON.stringify(d.originalState) : null,
      d.proposedState ? JSON.stringify(d.proposedState) : null,
      JSON.stringify(d)
    ]);
  }

  return {
    status: 'SEEDED_SUCCESSFULLY',
    busesCount: BUSES.length,
    driversCount: DRIVERS.length,
    routesCount: ROUTES.length,
    studentsCount: STUDENTS.length,
    disruptionsCount: DISRUPTIONS.length
  };
}
