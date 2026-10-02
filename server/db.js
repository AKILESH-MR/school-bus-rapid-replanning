// Local SQLite Database Manager for School Bus Replanning MVP
// Uses Node.js 24 built-in DatabaseSync from 'node:sqlite'
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUSES, ROUTES, STUDENTS, DISRUPTIONS, DRIVERS, SCHOOLS, DEPOT } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DB_PATH = path.resolve(__dirname, '../data/school_bus.db');

export class LocalDatabase {
  constructor(dbPath = DEFAULT_DB_PATH) {
    this.type = 'sqlite-local';
    this.dbPath = dbPath;
    if (dbPath !== ':memory:') {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    this.db = new DatabaseSync(dbPath);
    this.initSchema();
    this.seedInitialData();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS buses (
        id TEXT PRIMARY KEY,
        number TEXT,
        capacity INTEGER,
        current_load INTEGER,
        status TEXT,
        fuel_level INTEGER,
        driver_id TEXT,
        route_id TEXT,
        coords TEXT,
        gps_status TEXT,
        speed_kmh REAL,
        last_gps_sync TEXT,
        last_updated TEXT,
        raw_json TEXT
      );

      CREATE TABLE IF NOT EXISTS drivers (
        id TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        license TEXT,
        rating REAL,
        experience_yrs INTEGER,
        status TEXT,
        availability_status TEXT,
        current_assignment TEXT,
        current_location TEXT,
        location_source TEXT,
        is_location_stale INTEGER,
        shift_start TEXT,
        shift_end TEXT,
        photo TEXT,
        raw_json TEXT
      );

      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT,
        color TEXT,
        school_id TEXT,
        school_name TEXT,
        assigned_bus TEXT,
        assigned_driver TEXT,
        total_students INTEGER,
        delay_minutes REAL,
        stops TEXT,
        raw_json TEXT
      );

      CREATE TABLE IF NOT EXISTS route_stops (
        id TEXT,
        route_id TEXT,
        sequence_order INTEGER,
        name TEXT,
        lat REAL,
        lon REAL,
        scheduled_time TEXT,
        students_count INTEGER,
        status TEXT,
        PRIMARY KEY (route_id, id)
      );

      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT,
        grade TEXT,
        school_id TEXT,
        school_name TEXT,
        bus_id TEXT,
        route_id TEXT,
        stop_name TEXT,
        pickup_coords TEXT,
        status TEXT,
        special_needs TEXT,
        raw_json TEXT
      );

      CREATE TABLE IF NOT EXISTS disruptions (
        id TEXT PRIMARY KEY,
        reported_at TEXT,
        type TEXT,
        title TEXT,
        status TEXT,
        severity TEXT,
        bus_id TEXT,
        route_id TEXT,
        student_id TEXT,
        location TEXT,
        impact TEXT,
        ai_recommendation TEXT,
        original_state TEXT,
        proposed_state TEXT,
        raw_json TEXT
      );

      CREATE TABLE IF NOT EXISTS replans (
        id TEXT PRIMARY KEY,
        disruption_id TEXT,
        status TEXT,
        strategy TEXT,
        recommended_bus_id TEXT,
        recommended_route_id TEXT,
        score REAL,
        details TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS replan_candidates (
        id TEXT PRIMARY KEY,
        replan_id TEXT,
        bus_id TEXT,
        route_id TEXT,
        rank INTEGER,
        score REAL,
        is_recommended INTEGER,
        rejection_reason TEXT,
        score_breakdown TEXT,
        gps_status TEXT
      );

      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        replan_id TEXT,
        disruption_id TEXT,
        action TEXT,
        dispatcher_id TEXT,
        dispatcher_role TEXT,
        reason TEXT,
        modifications TEXT,
        applied_changes TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS gps_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_id TEXT,
        latitude REAL,
        longitude REAL,
        speed_kmh REAL,
        heading INTEGER,
        source TEXT,
        gps_status TEXT,
        trust_level TEXT,
        age_seconds INTEGER,
        is_manual INTEGER,
        location_name TEXT,
        is_simulated INTEGER,
        payload_json TEXT,
        received_at TEXT
      );

      CREATE TABLE IF NOT EXISTS offline_actions (
        action_id TEXT PRIMARY KEY,
        action_type TEXT,
        user_id TEXT,
        role TEXT,
        timestamp TEXT,
        status TEXT,
        payload TEXT,
        result TEXT
      );

      CREATE TABLE IF NOT EXISTS synced_actions (
        action_id TEXT PRIMARY KEY,
        action_type TEXT,
        user_id TEXT,
        role TEXT,
        timestamp TEXT,
        status TEXT,
        payload TEXT,
        result TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT,
        action_type TEXT,
        user_role TEXT,
        disruption_id TEXT,
        recommendation_id TEXT,
        timestamp TEXT,
        original_state TEXT,
        proposed_state TEXT,
        final_state TEXT,
        event_message TEXT,
        details TEXT
      );
    `);
  }

  seedInitialData(force = false) {
    const busCount = this.db.prepare('SELECT COUNT(*) as count FROM buses').get().count;
    if (busCount > 0 && !force) {
      return;
    }

    if (force) {
      this.db.exec('DELETE FROM buses; DELETE FROM drivers; DELETE FROM routes; DELETE FROM route_stops; DELETE FROM students; DELETE FROM disruptions;');
    }

    // Seed Drivers
    const insertDriver = this.db.prepare(`
      INSERT INTO drivers (id, name, phone, license, rating, experience_yrs, status, availability_status, current_assignment, current_location, location_source, is_location_stale, shift_start, shift_end, photo, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const drv of DRIVERS) {
      insertDriver.run(
        drv.id || drv.driverId,
        drv.name,
        drv.phone || '',
        drv.license || '',
        drv.rating || 4.5,
        drv.experienceYrs || 0,
        drv.status || 'active',
        drv.availabilityStatus || 'active',
        drv.currentAssignment || null,
        JSON.stringify(drv.currentLocation || [37.77, -122.42]),
        drv.locationSource || 'last_known',
        drv.isLocationStale ? 1 : 0,
        drv.shiftStart || '',
        drv.shiftEnd || '',
        drv.photo || '',
        JSON.stringify(drv)
      );
    }

    // Seed Buses
    const insertBus = this.db.prepare(`
      INSERT INTO buses (id, number, capacity, current_load, status, fuel_level, driver_id, route_id, coords, gps_status, speed_kmh, last_gps_sync, last_updated, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const b of BUSES) {
      insertBus.run(
        b.id,
        b.number || b.id,
        b.capacity || 54,
        b.currentLoad || 0,
        b.status || 'in_service',
        b.fuelLevel || 100,
        b.driverId || null,
        b.routeId || null,
        JSON.stringify(b.coords || [37.77, -122.42]),
        b.gpsStatus || 'live',
        b.speedKmh || 0,
        b.lastGpsSync || new Date().toISOString(),
        b.lastUpdated || new Date().toISOString(),
        JSON.stringify(b)
      );
    }

    // Seed Routes
    const insertRoute = this.db.prepare(`
      INSERT INTO routes (id, name, color, school_id, school_name, assigned_bus, assigned_driver, total_students, delay_minutes, stops, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertRouteStop = this.db.prepare(`
      INSERT INTO route_stops (id, route_id, sequence_order, name, lat, lon, scheduled_time, students_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of ROUTES) {
      insertRoute.run(
        r.id,
        r.name,
        r.color || '#3b82f6',
        r.schoolId || 'SCH-01',
        r.schoolName || 'District School',
        r.assignedBus || null,
        r.assignedDriver || null,
        r.totalStudents || 0,
        r.delayMinutes || 0,
        JSON.stringify(r.stops || []),
        JSON.stringify(r)
      );

      if (Array.isArray(r.stops)) {
        let seq = 0;
        for (const stop of r.stops) {
          seq++;
          insertRouteStop.run(
            stop.id || `ST-${r.id}-${seq}`,
            r.id,
            seq,
            stop.name || `Stop ${seq}`,
            stop.coords ? stop.coords[0] : (stop.lat || 37.77),
            stop.coords ? stop.coords[1] : (stop.lon || -122.42),
            stop.time || '07:30 AM',
            stop.studentsCount || 0,
            stop.status || 'pending'
          );
        }
      }
    }

    // Seed Students
    const insertStudent = this.db.prepare(`
      INSERT INTO students (id, name, grade, school_id, school_name, bus_id, route_id, stop_name, pickup_coords, status, special_needs, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of STUDENTS) {
      insertStudent.run(
        s.id,
        s.name,
        s.grade || 'K-5',
        s.schoolId || 'SCH-01',
        s.schoolName || 'District School',
        s.busId || null,
        s.routeId || null,
        s.stopName || '',
        JSON.stringify(s.pickupCoords || [37.77, -122.42]),
        s.status || 'waiting',
        s.specialNeeds || 'None',
        JSON.stringify(s)
      );
    }

    // Seed Disruptions
    const insertDisruption = this.db.prepare(`
      INSERT INTO disruptions (id, reported_at, type, title, status, severity, bus_id, route_id, student_id, location, impact, ai_recommendation, original_state, proposed_state, raw_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const d of DISRUPTIONS) {
      insertDisruption.run(
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
      );
    }
  }

  // Buses
  getBuses() {
    const rows = this.db.prepare('SELECT raw_json FROM buses').all();
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getBusById(id) {
    const row = this.db.prepare('SELECT raw_json FROM buses WHERE id = ?').get(id);
    return row ? JSON.parse(row.raw_json) : null;
  }

  saveBus(bus) {
    const exists = this.getBusById(bus.id);
    if (exists) {
      const stmt = this.db.prepare(`
        UPDATE buses SET
          number = ?, capacity = ?, current_load = ?, status = ?, fuel_level = ?,
          driver_id = ?, route_id = ?, coords = ?, gps_status = ?, speed_kmh = ?,
          last_gps_sync = ?, last_updated = ?, raw_json = ?
        WHERE id = ?
      `);
      stmt.run(
        bus.number || bus.id,
        bus.capacity || 54,
        bus.currentLoad || 0,
        bus.status || 'in_service',
        bus.fuelLevel || 100,
        bus.driverId || null,
        bus.routeId || null,
        JSON.stringify(bus.coords || [37.77, -122.42]),
        bus.gpsStatus || 'live',
        bus.speedKmh || 0,
        bus.lastGpsSync || new Date().toISOString(),
        bus.lastUpdated || new Date().toISOString(),
        JSON.stringify(bus),
        bus.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO buses (id, number, capacity, current_load, status, fuel_level, driver_id, route_id, coords, gps_status, speed_kmh, last_gps_sync, last_updated, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        bus.id,
        bus.number || bus.id,
        bus.capacity || 54,
        bus.currentLoad || 0,
        bus.status || 'in_service',
        bus.fuelLevel || 100,
        bus.driverId || null,
        bus.routeId || null,
        JSON.stringify(bus.coords || [37.77, -122.42]),
        bus.gpsStatus || 'live',
        bus.speedKmh || 0,
        bus.lastGpsSync || new Date().toISOString(),
        bus.lastUpdated || new Date().toISOString(),
        JSON.stringify(bus)
      );
    }
    return bus;
  }

  // Drivers
  getDrivers() {
    const rows = this.db.prepare('SELECT raw_json FROM drivers').all();
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getDriverById(id) {
    const row = this.db.prepare('SELECT raw_json FROM drivers WHERE id = ?').get(id);
    return row ? JSON.parse(row.raw_json) : null;
  }

  saveDriver(driver) {
    const id = driver.id || driver.driverId;
    const exists = this.getDriverById(id);
    if (exists) {
      const stmt = this.db.prepare(`
        UPDATE drivers SET
          name = ?, phone = ?, license = ?, rating = ?, experience_yrs = ?,
          status = ?, availability_status = ?, current_assignment = ?,
          current_location = ?, location_source = ?, is_location_stale = ?,
          shift_start = ?, shift_end = ?, photo = ?, raw_json = ?
        WHERE id = ?
      `);
      stmt.run(
        driver.name,
        driver.phone || '',
        driver.license || '',
        driver.rating || 4.5,
        driver.experienceYrs || 0,
        driver.status || 'active',
        driver.availabilityStatus || 'active',
        driver.currentAssignment || null,
        JSON.stringify(driver.currentLocation || [37.77, -122.42]),
        driver.locationSource || 'last_known',
        driver.isLocationStale ? 1 : 0,
        driver.shiftStart || '',
        driver.shiftEnd || '',
        driver.photo || '',
        JSON.stringify(driver),
        id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO drivers (id, name, phone, license, rating, experience_yrs, status, availability_status, current_assignment, current_location, location_source, is_location_stale, shift_start, shift_end, photo, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id,
        driver.name,
        driver.phone || '',
        driver.license || '',
        driver.rating || 4.5,
        driver.experienceYrs || 0,
        driver.status || 'active',
        driver.availabilityStatus || 'active',
        driver.currentAssignment || null,
        JSON.stringify(driver.currentLocation || [37.77, -122.42]),
        driver.locationSource || 'last_known',
        driver.isLocationStale ? 1 : 0,
        driver.shiftStart || '',
        driver.shiftEnd || '',
        driver.photo || '',
        JSON.stringify(driver)
      );
    }
    return driver;
  }

  // Routes
  getRoutes() {
    const rows = this.db.prepare('SELECT raw_json FROM routes').all();
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getRouteById(id) {
    const row = this.db.prepare('SELECT raw_json FROM routes WHERE id = ?').get(id);
    return row ? JSON.parse(row.raw_json) : null;
  }

  saveRoute(route) {
    const exists = this.getRouteById(route.id);
    if (exists) {
      const stmt = this.db.prepare(`
        UPDATE routes SET
          name = ?, color = ?, school_id = ?, school_name = ?, assigned_bus = ?,
          assigned_driver = ?, total_students = ?, delay_minutes = ?, stops = ?, raw_json = ?
        WHERE id = ?
      `);
      stmt.run(
        route.name,
        route.color || '#3b82f6',
        route.schoolId || 'SCH-01',
        route.schoolName || '',
        route.assignedBus || null,
        route.assignedDriver || null,
        route.totalStudents || 0,
        route.delayMinutes || 0,
        JSON.stringify(route.stops || []),
        JSON.stringify(route),
        route.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO routes (id, name, color, school_id, school_name, assigned_bus, assigned_driver, total_students, delay_minutes, stops, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        route.id,
        route.name,
        route.color || '#3b82f6',
        route.schoolId || 'SCH-01',
        route.schoolName || '',
        route.assignedBus || null,
        route.assignedDriver || null,
        route.totalStudents || 0,
        route.delayMinutes || 0,
        JSON.stringify(route.stops || []),
        JSON.stringify(route)
      );
    }
    return route;
  }

  // Students
  getStudents() {
    const rows = this.db.prepare('SELECT raw_json FROM students').all();
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getStudentById(id) {
    const row = this.db.prepare('SELECT raw_json FROM students WHERE id = ?').get(id);
    return row ? JSON.parse(row.raw_json) : null;
  }

  saveStudent(student) {
    const exists = this.getStudentById(student.id);
    if (exists) {
      const stmt = this.db.prepare(`
        UPDATE students SET
          name = ?, grade = ?, school_id = ?, school_name = ?, bus_id = ?,
          route_id = ?, stop_name = ?, pickup_coords = ?, status = ?, special_needs = ?, raw_json = ?
        WHERE id = ?
      `);
      stmt.run(
        student.name,
        student.grade || 'K-5',
        student.schoolId || 'SCH-01',
        student.schoolName || '',
        student.busId || null,
        student.routeId || null,
        student.stopName || '',
        JSON.stringify(student.pickupCoords || [37.77, -122.42]),
        student.status || 'waiting',
        student.specialNeeds || 'None',
        JSON.stringify(student),
        student.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO students (id, name, grade, school_id, school_name, bus_id, route_id, stop_name, pickup_coords, status, special_needs, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        student.id,
        student.name,
        student.grade || 'K-5',
        student.schoolId || 'SCH-01',
        student.schoolName || '',
        student.busId || null,
        student.routeId || null,
        student.stopName || '',
        JSON.stringify(student.pickupCoords || [37.77, -122.42]),
        student.status || 'waiting',
        student.specialNeeds || 'None',
        JSON.stringify(student)
      );
    }
    return student;
  }

  // Disruptions
  getDisruptions() {
    const rows = this.db.prepare('SELECT raw_json FROM disruptions ORDER BY id DESC').all();
    return rows.map(r => JSON.parse(r.raw_json));
  }

  getDisruptionById(id) {
    const row = this.db.prepare('SELECT raw_json FROM disruptions WHERE id = ?').get(id);
    return row ? JSON.parse(row.raw_json) : null;
  }

  saveDisruption(disruption) {
    const exists = this.getDisruptionById(disruption.id);
    if (exists) {
      const stmt = this.db.prepare(`
        UPDATE disruptions SET
          reported_at = ?, type = ?, title = ?, status = ?, severity = ?,
          bus_id = ?, route_id = ?, student_id = ?, location = ?, impact = ?,
          ai_recommendation = ?, original_state = ?, proposed_state = ?, raw_json = ?
        WHERE id = ?
      `);
      stmt.run(
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
        JSON.stringify(disruption),
        disruption.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO disruptions (id, reported_at, type, title, status, severity, bus_id, route_id, student_id, location, impact, ai_recommendation, original_state, proposed_state, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
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
        JSON.stringify(disruption)
      );
    }
    return disruption;
  }

  // Replans
  getReplans() {
    const rows = this.db.prepare('SELECT details FROM replans ORDER BY created_at DESC').all();
    return rows.map(r => JSON.parse(r.details));
  }

  getReplanById(id) {
    const row = this.db.prepare('SELECT details FROM replans WHERE id = ?').get(id);
    return row ? JSON.parse(row.details) : null;
  }

  saveReplan(replan) {
    const planId = replan.id || replan.planId;
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO replans (id, disruption_id, status, strategy, recommended_bus_id, recommended_route_id, score, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      planId,
      replan.disruptionId || null,
      replan.status || 'pending_review',
      replan.strategy || 'Greedy Insertion',
      replan.recommendedBusId || null,
      replan.recommendedRouteId || null,
      replan.score || 0,
      JSON.stringify(replan),
      replan.createdAt || new Date().toISOString()
    );

    // Save candidates if present
    const candidates = replan.feasibleCandidates || replan.details?.feasibleCandidates || [];
    if (candidates.length > 0) {
      let rank = 1;
      const candStmt = this.db.prepare(`
        INSERT OR REPLACE INTO replan_candidates (id, replan_id, bus_id, route_id, rank, score, is_recommended, rejection_reason, score_breakdown, gps_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of candidates) {
        candStmt.run(
          `CAND-${planId}-${rank}`,
          planId,
          c.bus?.id || c.busId || 'UNKNOWN',
          c.route?.id || c.routeId || null,
          rank,
          c.score || 0,
          rank === 1 ? 1 : 0,
          null,
          JSON.stringify(c.scoreBreakdown || {}),
          c.gpsStatus || c.bus?.gpsStatus || null
        );
        rank++;
      }
    }

    return replan;
  }

  // Approvals
  saveApproval(approval) {
    const id = approval.id || `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    approval.id = id;
    const stmt = this.db.prepare(`
      INSERT INTO approvals (id, replan_id, disruption_id, action, dispatcher_id, dispatcher_role, reason, modifications, applied_changes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      approval.replanId || approval.planId || null,
      approval.disruptionId || null,
      approval.action || 'APPROVED',
      approval.dispatcherId || approval.userId || 'dispatcher-1',
      approval.dispatcherRole || approval.userRole || 'Dispatcher',
      approval.reason || null,
      approval.modifications ? JSON.stringify(approval.modifications) : null,
      approval.appliedChanges ? JSON.stringify(approval.appliedChanges) : null,
      approval.createdAt || new Date().toISOString()
    );
    return approval;
  }

  getApprovals() {
    return this.db.prepare('SELECT * FROM approvals ORDER BY created_at DESC').all();
  }

  getApprovalsByReplanId(replanId) {
    return this.db.prepare('SELECT * FROM approvals WHERE replan_id = ? ORDER BY created_at DESC').all(replanId);
  }

  // GPS Updates
  recordGpsUpdate(update) {
    const stmt = this.db.prepare(`
      INSERT INTO gps_updates (bus_id, latitude, longitude, speed_kmh, heading, source, gps_status, trust_level, age_seconds, is_manual, location_name, is_simulated, payload_json, received_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const lat = update.latitude !== undefined ? update.latitude : (update.coords ? update.coords[0] : 37.77);
    const lon = update.longitude !== undefined ? update.longitude : (update.coords ? update.coords[1] : -122.42);
    stmt.run(
      update.busId,
      lat,
      lon,
      update.speedKmh || 0,
      update.heading || 0,
      update.source || 'mock_telematics',
      update.gpsStatus || 'LIVE',
      update.trustLevel || 'HIGH',
      update.ageSeconds || 0,
      update.isManual ? 1 : 0,
      update.locationName || null,
      update.isSimulated !== false ? 1 : 0,
      JSON.stringify(update),
      new Date().toISOString()
    );
    return update;
  }

  // Audit Logs
  getAuditLogs() {
    const rows = this.db.prepare('SELECT details FROM audit_logs ORDER BY timestamp DESC').all();
    return rows.map(r => JSON.parse(r.details));
  }

  saveAuditLog(log) {
    const id = log.id || `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    log.id = id;
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (id, action, action_type, user_role, disruption_id, recommendation_id, timestamp, original_state, proposed_state, final_state, event_message, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
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
    );
    return log;
  }

  // Synced / Offline Actions (Idempotency Tracking)
  isActionSynced(actionId) {
    if (!actionId) return false;
    const row = this.db.prepare('SELECT action_id FROM offline_actions WHERE action_id = ?').get(actionId) ||
                this.db.prepare('SELECT action_id FROM synced_actions WHERE action_id = ?').get(actionId);
    return !!row;
  }

  recordSyncedAction(action, result = {}) {
    const actionId = action.actionId || action.id;
    if (!actionId) return;
    const stmt1 = this.db.prepare(`
      INSERT OR REPLACE INTO offline_actions (action_id, action_type, user_id, role, timestamp, status, payload, result)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const stmt2 = this.db.prepare(`
      INSERT OR REPLACE INTO synced_actions (action_id, action_type, user_id, role, timestamp, status, payload, result)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const params = [
      actionId,
      action.actionType || 'UNKNOWN_ACTION',
      action.userId || 'dispatcher-1',
      action.role || 'dispatcher',
      action.timestamp || new Date().toISOString(),
      'SYNCED',
      action.payload ? JSON.stringify(action.payload) : null,
      JSON.stringify(result)
    ];
    stmt1.run(...params);
    stmt2.run(...params);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

let defaultDbInstance = null;

export function getDatabase(dbPath = DEFAULT_DB_PATH) {
  if (!defaultDbInstance || (dbPath && defaultDbInstance.dbPath !== dbPath)) {
    defaultDbInstance = new LocalDatabase(dbPath);
  }
  return defaultDbInstance;
}
