/**
 * PostgreSQL Database Layer: Comprehensive Test Suite
 *
 * Verifies:
 * 1. Schema & Migration Files (all 11 required tables)
 * 2. Demo Seed Data Integrity (matching MVP mockData.js)
 * 3. Repository CRUD Operations for all entities:
 *    - buses
 *    - drivers
 *    - routes & route_stops
 *    - students
 *    - disruptions
 *    - replans & replan_candidates
 *    - approvals
 *    - gps_updates
 *    - offline_actions (idempotency tracking)
 *    - audit_logs (append-only audit trail)
 * 4. Graceful Connection Failure & SQLite Fallback Handling
 * 5. Idempotency Key Deduplication
 * 6. Audit Trail Invariants
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PgMigrator } from '../server/pg/migrator.js';
import { seedDatabase } from '../server/pg/seed.js';
import { PgConnectionManager } from '../server/pg/connection.js';
import { createDatabase, getDatabaseMetadata } from '../server/databaseFactory.js';
import { BusRepository } from '../server/pg/repositories/busRepository.js';
import { DriverRepository } from '../server/pg/repositories/driverRepository.js';
import { RouteRepository } from '../server/pg/repositories/routeRepository.js';
import { StudentRepository } from '../server/pg/repositories/studentRepository.js';
import { DisruptionRepository } from '../server/pg/repositories/disruptionRepository.js';
import { ReplanRepository } from '../server/pg/repositories/replanRepository.js';
import { ApprovalRepository } from '../server/pg/repositories/approvalRepository.js';
import { GpsRepository } from '../server/pg/repositories/gpsRepository.js';
import { OfflineActionRepository } from '../server/pg/repositories/offlineActionRepository.js';
import { AuditLogRepository } from '../server/pg/repositories/auditLogRepository.js';
import { PgDatabase } from '../server/pg/db.js';
import { BUSES, DRIVERS, ROUTES, STUDENTS, DISRUPTIONS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================================');
console.log('  POSTGRESQL DATABASE LAYER & REPOSITORY TEST SUITE');
console.log('========================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, message = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}: ${message}`);
  }
}

/**
 * In-memory Mock SQL Executor for PostgreSQL Repository Testing
 * Translates parameterized queries into in-memory state mutations
 * to enable deterministic testing of repository contracts and SQL generation.
 */
class MockPgExecutor {
  constructor() {
    this.tables = {
      schema_migrations: new Map(),
      buses: new Map(),
      drivers: new Map(),
      routes: new Map(),
      route_stops: new Map(),
      students: new Map(),
      disruptions: new Map(),
      replans: new Map(),
      replan_candidates: new Map(),
      approvals: new Map(),
      gps_updates: [],
      offline_actions: new Map(),
      audit_logs: []
    };
    this.queryLog = [];
  }

  async query(text, params = []) {
    this.queryLog.push({ text, params, timestamp: new Date().toISOString() });
    const normalized = text.trim().replace(/\s+/g, ' ');

    // 1. SELECT COUNT(*) as count FROM buses
    if (/SELECT COUNT\(\*\) as count FROM buses/i.test(normalized)) {
      return { rows: [{ count: this.tables.buses.size.toString() }] };
    }

    // 2. schema_migrations
    if (/CREATE TABLE IF NOT EXISTS schema_migrations/i.test(normalized)) {
      return { rows: [] };
    }
    if (/SELECT version FROM schema_migrations/i.test(normalized)) {
      const rows = Array.from(this.tables.schema_migrations.values()).map(v => ({ version: v.version }));
      return { rows };
    }
    if (/INSERT INTO schema_migrations/i.test(normalized)) {
      this.tables.schema_migrations.set(params[0], { version: params[0], description: params[1] });
      return { rows: [] };
    }

    // 3. BUSES
    if (/INSERT INTO buses/i.test(normalized)) {
      const rawObj = params[22] ? (typeof params[22] === 'string' ? JSON.parse(params[22]) : params[22]) : {};
      const busRecord = {
        id: params[0],
        plate: params[1],
        model: params[2],
        type: params[3],
        capacity: params[4],
        current_load: params[5],
        currentLoad: params[5],
        driver_id: params[6],
        driverId: params[6],
        route_id: params[7],
        routeId: params[7],
        status: params[8],
        fuel_level: params[9],
        fuelLevel: params[9],
        speed_kmh: params[10],
        speedKmh: params[10],
        heading: params[11],
        coords: params[12] || rawObj.coords || [37.77, -122.42],
        gps_status: params[13],
        gpsStatus: params[13],
        gps_source: params[14],
        source: params[14],
        age_seconds: params[15],
        ageSeconds: params[15],
        last_gps_sync_ms: params[16],
        _lastGpsSyncTimeMs: params[16],
        last_gps_sync: params[17],
        lastGpsSync: params[17],
        last_known_location: params[18],
        lastKnownLocation: params[18],
        is_manual_location: params[19],
        isManualLocation: Boolean(params[19]),
        health_score: params[20],
        healthScore: params[20],
        amenities: params[21] || [],
        raw_json: params[22]
      };
      this.tables.buses.set(params[0], busRecord);
      return { rows: [busRecord] };
    }

    if (/FROM buses WHERE id = \$1/i.test(normalized)) {
      const bus = this.tables.buses.get(params[0]);
      return { rows: bus ? [bus] : [] };
    }

    if (/FROM buses/i.test(normalized)) {
      return { rows: Array.from(this.tables.buses.values()) };
    }

    // 4. DRIVERS
    if (/INSERT INTO drivers/i.test(normalized)) {
      const driverRecord = {
        id: params[0],
        name: params[1],
        phone: params[2],
        license: params[3],
        rating: params[4],
        experience_yrs: params[5],
        experienceYrs: params[5],
        status: params[6],
        availability_status: params[7],
        availabilityStatus: params[7],
        current_assignment: params[8],
        currentAssignment: params[8],
        current_location: params[9],
        currentLocation: params[9],
        location_source: params[10],
        locationSource: params[10],
        is_location_stale: params[11],
        isLocationStale: Boolean(params[11]),
        shift_start: params[12],
        shiftStart: params[12],
        shift_end: params[13],
        shiftEnd: params[13],
        photo: params[14],
        raw_json: params[15]
      };
      this.tables.drivers.set(params[0], driverRecord);
      return { rows: [driverRecord] };
    }

    if (/FROM drivers WHERE id = \$1/i.test(normalized)) {
      const drv = this.tables.drivers.get(params[0]);
      return { rows: drv ? [drv] : [] };
    }

    if (/FROM drivers/i.test(normalized)) {
      return { rows: Array.from(this.tables.drivers.values()) };
    }

    // 5. ROUTES & ROUTE STOPS
    if (/INSERT INTO routes/i.test(normalized)) {
      const routeRecord = {
        id: params[0],
        name: params[1],
        school_id: params[2],
        schoolId: params[2],
        school_name: params[3],
        schoolName: params[3],
        assigned_bus: params[4],
        assignedBus: params[4],
        assigned_driver: params[5],
        assignedDriver: params[5],
        status: params[6],
        total_stops: params[7],
        totalStops: params[7],
        completed_stops: params[8],
        completedStops: params[8],
        total_students: params[9],
        totalStudents: params[9],
        scheduled_start_time: params[10],
        scheduledStartTime: params[10],
        scheduled_arrival_time: params[11],
        scheduledArrivalTime: params[11],
        current_eta: params[12],
        currentEta: params[12],
        delay_minutes: params[13],
        delayMinutes: params[13],
        color: params[14],
        raw_json: params[15]
      };
      this.tables.routes.set(params[0], routeRecord);
      return { rows: [routeRecord] };
    }

    if (/DELETE FROM route_stops WHERE route_id = \$1/i.test(normalized)) {
      for (const [key, stop] of this.tables.route_stops.entries()) {
        if (stop.route_id === params[0] || stop.routeId === params[0]) {
          this.tables.route_stops.delete(key);
        }
      }
      return { rows: [] };
    }

    if (/INSERT INTO route_stops/i.test(normalized)) {
      const stopRecord = {
        id: params[0],
        route_id: params[1],
        routeId: params[1],
        sequence_order: params[2],
        sequenceOrder: params[2],
        name: params[3],
        lat: params[4],
        lon: params[5],
        scheduled_time: params[6],
        scheduledTime: params[6],
        students_count: params[7],
        studentsCount: params[7],
        status: params[8]
      };
      this.tables.route_stops.set(`${params[1]}_${params[0]}`, stopRecord);
      return { rows: [stopRecord] };
    }

    if (/FROM route_stops WHERE route_id = \$1/i.test(normalized)) {
      const stops = Array.from(this.tables.route_stops.values())
        .filter(s => s.route_id === params[0] || s.routeId === params[0])
        .sort((a, b) => a.sequence_order - b.sequence_order);
      return { rows: stops };
    }

    if (/FROM routes WHERE id = \$1/i.test(normalized)) {
      const route = this.tables.routes.get(params[0]);
      return { rows: route ? [route] : [] };
    }

    if (/FROM routes/i.test(normalized)) {
      return { rows: Array.from(this.tables.routes.values()) };
    }

    // 6. STUDENTS
    if (/INSERT INTO students/i.test(normalized)) {
      const studentRecord = {
        id: params[0],
        name: params[1],
        grade: params[2],
        school_id: params[3],
        schoolId: params[3],
        school_name: params[4],
        schoolName: params[4],
        bus_id: params[5],
        busId: params[5],
        route_id: params[6],
        routeId: params[6],
        stop_name: params[7],
        stopName: params[7],
        pickup_lat: params[8],
        pickupLat: params[8],
        pickup_lon: params[9],
        pickupLon: params[9],
        guardian_name: params[10],
        guardianName: params[10],
        guardian_phone: params[11],
        guardianPhone: params[11],
        status: params[12],
        special_needs: params[13],
        specialNeeds: params[13],
        photo: params[14],
        raw_json: params[15]
      };
      this.tables.students.set(params[0], studentRecord);
      return { rows: [studentRecord] };
    }

    if (/FROM students WHERE id = \$1/i.test(normalized)) {
      const s = this.tables.students.get(params[0]);
      return { rows: s ? [s] : [] };
    }

    if (/FROM students/i.test(normalized)) {
      return { rows: Array.from(this.tables.students.values()) };
    }

    // 7. DISRUPTIONS
    if (/INSERT INTO disruptions/i.test(normalized)) {
      const dRecord = {
        id: params[0],
        reported_at: params[1],
        reportedAt: params[1],
        type: params[2],
        title: params[3],
        status: params[4],
        severity: params[5],
        bus_id: params[6],
        busId: params[6],
        route_id: params[7],
        routeId: params[7],
        student_id: params[8],
        studentId: params[8],
        location: params[9],
        impact: params[10],
        ai_recommendation: params[11],
        aiRecommendation: params[11],
        original_state: params[12],
        originalState: params[12],
        proposed_state: params[13],
        proposedState: params[13],
        final_state: params[14],
        finalState: params[14],
        raw_json: params[15]
      };
      this.tables.disruptions.set(params[0], dRecord);
      return { rows: [dRecord] };
    }

    if (/FROM disruptions WHERE id = \$1/i.test(normalized)) {
      const d = this.tables.disruptions.get(params[0]);
      return { rows: d ? [d] : [] };
    }

    if (/FROM disruptions/i.test(normalized)) {
      return { rows: Array.from(this.tables.disruptions.values()) };
    }

    // 8. REPLANS & CANDIDATES
    if (/INSERT INTO replans/i.test(normalized)) {
      const rRecord = {
        id: params[0],
        disruption_id: params[1],
        disruptionId: params[1],
        status: params[2],
        strategy: params[3],
        recommended_bus_id: params[4],
        recommendedBusId: params[4],
        recommended_route_id: params[5],
        recommendedRouteId: params[5],
        score: params[6],
        details: params[7],
        created_at: new Date().toISOString()
      };
      this.tables.replans.set(params[0], rRecord);
      return { rows: [rRecord] };
    }

    if (/DELETE FROM replan_candidates WHERE replan_id = \$1/i.test(normalized)) {
      for (const [key, cand] of this.tables.replan_candidates.entries()) {
        if (cand.replan_id === params[0] || cand.replanId === params[0]) {
          this.tables.replan_candidates.delete(key);
        }
      }
      return { rows: [] };
    }

    if (/INSERT INTO replan_candidates/i.test(normalized)) {
      const candRecord = {
        id: `CAND-${Date.now()}-${Math.random()}`,
        replan_id: params[0],
        replanId: params[0],
        bus_id: params[1],
        busId: params[1],
        route_id: params[2],
        routeId: params[2],
        rank: params[3],
        score: params[4],
        is_recommended: params[5],
        isRecommended: params[5],
        rejection_reason: params[6],
        rejectionReason: params[6],
        score_breakdown: params[7],
        scoreBreakdown: params[7],
        gps_status: params[8],
        gpsStatus: params[8],
        created_at: new Date().toISOString()
      };
      this.tables.replan_candidates.set(candRecord.id, candRecord);
      return { rows: [candRecord] };
    }

    if (/FROM replan_candidates WHERE replan_id = \$1/i.test(normalized)) {
      const cands = Array.from(this.tables.replan_candidates.values())
        .filter(c => c.replan_id === params[0] || c.replanId === params[0])
        .sort((a, b) => a.rank - b.rank);
      return { rows: cands };
    }

    if (/FROM replans WHERE id = \$1/i.test(normalized)) {
      const r = this.tables.replans.get(params[0]);
      return { rows: r ? [r] : [] };
    }

    if (/FROM replans/i.test(normalized)) {
      return { rows: Array.from(this.tables.replans.values()) };
    }

    // 9. APPROVALS
    if (/INSERT INTO approvals/i.test(normalized)) {
      const appRecord = {
        id: params[0],
        replan_id: params[1],
        replanId: params[1],
        disruption_id: params[2],
        disruptionId: params[2],
        action: params[3],
        dispatcher_id: params[4],
        dispatcherId: params[4],
        dispatcher_role: params[5],
        dispatcherRole: params[5],
        reason: params[6],
        modifications: params[7],
        applied_changes: params[8],
        appliedChanges: params[8],
        created_at: new Date().toISOString()
      };
      this.tables.approvals.set(params[0], appRecord);
      return { rows: [appRecord] };
    }

    if (/FROM approvals WHERE replan_id = \$1/i.test(normalized)) {
      const apps = Array.from(this.tables.approvals.values())
        .filter(a => a.replan_id === params[0] || a.replanId === params[0]);
      return { rows: apps };
    }

    if (/FROM approvals/i.test(normalized)) {
      return { rows: Array.from(this.tables.approvals.values()) };
    }

    // 10. GPS UPDATES
    if (/INSERT INTO gps_updates/i.test(normalized)) {
      const gpsRecord = {
        id: this.tables.gps_updates.length + 1,
        bus_id: params[0],
        busId: params[0],
        latitude: params[1],
        longitude: params[2],
        speed_kmh: params[3],
        speedKmh: params[3],
        heading: params[4],
        source: params[5],
        gps_status: params[6],
        gpsStatus: params[6],
        trust_level: params[7],
        trustLevel: params[7],
        age_seconds: params[8],
        ageSeconds: params[8],
        is_manual: params[9],
        isManual: params[9],
        location_name: params[10],
        locationName: params[10],
        is_simulated: params[11],
        isSimulated: params[11],
        payload_json: params[12],
        received_at: new Date().toISOString()
      };
      this.tables.gps_updates.push(gpsRecord);
      return { rows: [gpsRecord] };
    }

    if (/FROM gps_updates WHERE bus_id = \$1/i.test(normalized)) {
      const updates = this.tables.gps_updates
        .filter(u => u.bus_id === params[0] || u.busId === params[0])
        .slice(-params[1] || -20);
      return { rows: updates };
    }

    // 11. OFFLINE ACTIONS (IDEMPOTENCY)
    if (/FROM offline_actions WHERE action_id = \$1/i.test(normalized)) {
      const action = this.tables.offline_actions.get(params[0]);
      if (action && (!normalized.includes("status = 'synced'") || action.status === 'synced')) {
        return { rows: [action] };
      }
      return { rows: [] };
    }

    if (/INSERT INTO offline_actions/i.test(normalized)) {
      const isSynced = normalized.includes("'synced'");
      const actionRecord = {
        action_id: params[0],
        actionId: params[0],
        action_type: params[1],
        actionType: params[1],
        user_id: params[2],
        userId: params[2],
        role: params[3],
        status: isSynced ? 'synced' : 'pending',
        payload: isSynced ? params[4] : params[4],
        result: isSynced ? params[5] : null,
        retry_count: isSynced ? (params[6] || 0) : (params[5] || 0),
        retryCount: isSynced ? (params[6] || 0) : (params[5] || 0),
        created_at: new Date().toISOString(),
        synced_at: new Date().toISOString(),
        last_attempt_at: new Date().toISOString()
      };
      this.tables.offline_actions.set(params[0], actionRecord);
      return { rows: [actionRecord] };
    }

    // 12. AUDIT LOGS
    if (/INSERT INTO audit_logs/i.test(normalized)) {
      const logRecord = {
        id: params[0],
        action: params[1],
        action_type: params[2],
        actionType: params[2],
        user_role: params[3],
        userRole: params[3],
        disruption_id: params[4],
        disruptionId: params[4],
        recommendation_id: params[5],
        recommendationId: params[5],
        timestamp: params[6],
        original_state: params[7],
        originalState: params[7],
        proposed_state: params[8],
        proposedState: params[8],
        final_state: params[9],
        finalState: params[9],
        event_message: params[10],
        eventMessage: params[10],
        details: params[11],
        created_at: new Date().toISOString()
      };
      this.tables.audit_logs.push(logRecord);
      return { rows: [logRecord] };
    }

    if (/FROM audit_logs WHERE disruption_id = \$1/i.test(normalized)) {
      const logs = this.tables.audit_logs.filter(l => l.disruption_id === params[0] || l.disruptionId === params[0]);
      return { rows: logs };
    }

    if (/FROM audit_logs/i.test(normalized)) {
      return { rows: [...this.tables.audit_logs].reverse() };
    }

    return { rows: [] };
  }
}

async function runTests() {
  // =========================================================================
  // 1. Schema & Migration Files Verification
  // =========================================================================
  const migrationsDir = path.resolve(__dirname, '../server/pg/migrations');
  assert(fs.existsSync(migrationsDir), '1a. Migrations directory exists');

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  assert(files.length >= 1 && files.includes('001_initial_schema.sql'), '1b. 001_initial_schema.sql migration file exists');

  const schemaSql = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf8');

  // Verify all 11 required tables exist in migration SQL
  const requiredTables = [
    'buses',
    'drivers',
    'routes',
    'route_stops',
    'disruptions',
    'replans',
    'replan_candidates',
    'approvals',
    'gps_updates',
    'offline_actions',
    'audit_logs'
  ];

  for (const table of requiredTables) {
    const tablePattern = new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`, 'i');
    assert(tablePattern.test(schemaSql), `1c. Schema defines table: ${table}`);
  }

  // Verify Migrator logic
  const mockExecutor = new MockPgExecutor();
  const migrator = new PgMigrator(mockExecutor, migrationsDir);
  const migrationResults = await migrator.runMigrations();
  assert(migrationResults.length >= 1, '1d. Migrator successfully parsed and executed migrations');
  assert(mockExecutor.tables.schema_migrations.has('001'), '1e. Migration 001 recorded in schema_migrations');

  // Second run -> idempotency check
  const secondRun = await migrator.runMigrations();
  assert(secondRun[0].status === 'SKIPPED_ALREADY_APPLIED', '1f. Migrator idempotency: already applied migrations are skipped');

  // =========================================================================
  // 2. Demo Seed Data Verification
  // =========================================================================
  const seedResult = await seedDatabase(mockExecutor);
  assert(seedResult.status === 'SEEDED_SUCCESSFULLY', '2a. Seeder executes successfully');
  assert(mockExecutor.tables.buses.size === BUSES.length, `2b. Seeded ${BUSES.length} buses matching mockData.js`);
  assert(mockExecutor.tables.drivers.size === DRIVERS.length, `2c. Seeded ${DRIVERS.length} drivers matching mockData.js`);
  assert(mockExecutor.tables.routes.size === ROUTES.length, `2d. Seeded ${ROUTES.length} routes matching mockData.js`);
  assert(mockExecutor.tables.students.size === STUDENTS.length, `2e. Seeded ${STUDENTS.length} students matching mockData.js`);
  assert(mockExecutor.tables.disruptions.size === DISRUPTIONS.length, `2f. Seeded ${DISRUPTIONS.length} disruptions matching mockData.js`);

  // Verify normalized route_stops count
  const expectedStopsCount = ROUTES.reduce((sum, r) => sum + (r.stops ? r.stops.length : 0), 0);
  assert(mockExecutor.tables.route_stops.size === expectedStopsCount, `2g. Seeded ${expectedStopsCount} normalized route_stops`);

  // =========================================================================
  // 3. Repository CRUD Operations
  // =========================================================================

  // 3.1 BusRepository
  const busRepo = new BusRepository(mockExecutor);
  const bus1 = await busRepo.getById('BUS-01');
  assert(bus1 && bus1.id === 'BUS-01', '3.1a. BusRepository.getById returns existing bus');
  assert(bus1.capacity === 54 && Array.isArray(bus1.coords), '3.1b. Bus entity preserves capacity and coords');

  // Update bus load and status
  bus1.currentLoad = 43;
  bus1.status = 'in_transit';
  const updatedBus1 = await busRepo.upsert(bus1);
  assert(updatedBus1.currentLoad === 43 && updatedBus1.status === 'in_transit', '3.1c. BusRepository.upsert updates bus record');

  // 3.2 DriverRepository
  const driverRepo = new DriverRepository(mockExecutor);
  const driver1 = await driverRepo.getById('DRV-101');
  assert(driver1 && driver1.name === 'Sarah Jenkins', '3.2a. DriverRepository.getById returns driver');
  driver1.status = 'standby';
  const updatedDriver1 = await driverRepo.upsert(driver1);
  assert(updatedDriver1.status === 'standby', '3.2b. DriverRepository.upsert updates driver status');

  // 3.3 RouteRepository & RouteStops
  const routeRepo = new RouteRepository(mockExecutor);
  const route1 = await routeRepo.getById('RT-101');
  assert(route1 && route1.id === 'RT-101', '3.3a. RouteRepository.getById returns route');
  assert(Array.isArray(route1.stops) && route1.stops.length > 0, '3.3b. Route includes attached route_stops');
  assert(route1.stops[0].name && route1.stops[0].coords, '3.3c. Route stop contains name and coords');

  // 3.4 StudentRepository
  const studentRepo = new StudentRepository(mockExecutor);
  const student1 = await studentRepo.getById('STU-1001');
  assert(student1 && student1.name, '3.4a. StudentRepository.getById returns student');
  student1.status = 'absent_cancelled';
  const updatedStudent1 = await studentRepo.upsert(student1);
  assert(updatedStudent1.status === 'absent_cancelled', '3.4b. StudentRepository.upsert updates status to absent_cancelled');

  // 3.5 DisruptionRepository
  const disruptionRepo = new DisruptionRepository(mockExecutor);
  const newDisruption = {
    id: 'DIS-TEST-001',
    reportedAt: '08:00 AM',
    type: 'breakdown',
    title: 'Test Breakdown Event',
    status: 'unresolved',
    severity: 'critical',
    busId: 'BUS-04',
    location: '19th Ave & Winston Dr'
  };
  await disruptionRepo.upsert(newDisruption);
  const fetchedDisruption = await disruptionRepo.getById('DIS-TEST-001');
  assert(fetchedDisruption && fetchedDisruption.title === newDisruption.title, '3.5a. DisruptionRepository saves and fetches new disruption');

  // 3.6 ReplanRepository & Candidates
  const replanRepo = new ReplanRepository(mockExecutor);
  const testReplan = {
    id: 'REPLAN-TEST-100',
    disruptionId: 'DIS-TEST-001',
    status: 'pending_review',
    strategy: 'Greedy Insertion',
    recommendedBusId: 'BUS-02',
    recommendedRouteId: 'RT-102',
    score: 88.5,
    feasibleCandidates: [
      { bus: { id: 'BUS-02', gpsStatus: 'live' }, route: { id: 'RT-102' }, score: 88.5 },
      { bus: { id: 'BUS-03', gpsStatus: 'last_known' }, route: { id: 'RT-103' }, score: 72.1 }
    ],
    rejectedCandidates: [
      { bus: { id: 'BUS-05' }, reason: 'Capacity exceeded: vehicle at 100%' }
    ]
  };
  await replanRepo.upsert(testReplan);
  const fetchedReplan = await replanRepo.getById('REPLAN-TEST-100');
  assert(fetchedReplan && fetchedReplan.recommendedBusId === 'BUS-02', '3.6a. ReplanRepository saves and retrieves replan');
  const candidates = await replanRepo.getCandidates('REPLAN-TEST-100');
  assert(candidates.length === 3, '3.6b. Replan candidates stored and retrieved across feasible and rejected');
  assert(candidates[0].rank === 1 && candidates[0].isRecommended === true, '3.6c. Top-ranked candidate marked recommended');
  assert(candidates[2].rejectionReason === 'Capacity exceeded: vehicle at 100%', '3.6d. Rejection reason preserved on candidate row');

  // 3.7 ApprovalRepository
  const approvalRepo = new ApprovalRepository(mockExecutor);
  const approvalRecord = await approvalRepo.recordApproval({
    replanId: 'REPLAN-TEST-100',
    disruptionId: 'DIS-TEST-001',
    action: 'APPROVED',
    dispatcherId: 'dispatcher-7',
    dispatcherRole: 'Chief Dispatcher',
    reason: 'Minimizes student delay and stays within route time limit'
  });
  assert(approvalRecord && approvalRecord.action === 'APPROVED', '3.7a. ApprovalRepository records dispatcher approval');
  const replanApprovals = await approvalRepo.getByReplanId('REPLAN-TEST-100');
  assert(replanApprovals.length === 1 && replanApprovals[0].dispatcherRole === 'Chief Dispatcher', '3.7b. Approvals retrieved by replanId');

  // 3.8 GpsRepository
  const gpsRepo = new GpsRepository(mockExecutor);
  const gpsUpdate = await gpsRepo.recordUpdate({
    busId: 'BUS-01',
    latitude: 37.7795,
    longitude: -122.4210,
    speedKmh: 35.5,
    source: 'hardware_gps',
    gpsStatus: 'LIVE',
    trustLevel: 'HIGH',
    isManual: false
  });
  assert(gpsUpdate && gpsUpdate.bus_id === 'BUS-01', '3.8a. GpsRepository.recordUpdate persists incoming telematics update');
  const recentGps = await gpsRepo.getRecentForBus('BUS-01', 5);
  assert(recentGps.length >= 1, '3.8b. GpsRepository retrieves recent updates for bus');

  // 3.9 OfflineActionRepository (Idempotency Protection)
  const offlineRepo = new OfflineActionRepository(mockExecutor);
  const uniqueActionId = `ACT-TEST-${Date.now()}`;
  const actionPayload = {
    actionId: uniqueActionId,
    actionType: 'MANUAL_BUS_LOCATION',
    userId: 'dispatcher-1',
    role: 'dispatcher',
    payload: { busId: 'BUS-01', coords: [37.78, -122.42] }
  };

  // First sync
  const beforeSync = await offlineRepo.isActionSynced(uniqueActionId);
  assert(beforeSync === false, '3.9a. Action not synced prior to execution');

  await offlineRepo.recordSyncedAction(actionPayload, { success: true });
  const afterSync = await offlineRepo.isActionSynced(uniqueActionId);
  assert(afterSync === true, '3.9b. Action recorded as synced with unique actionId');

  // Duplicate idempotency check
  const duplicateDetected = await offlineRepo.isActionSynced(uniqueActionId);
  assert(duplicateDetected === true, '3.9c. Idempotency check: duplicate actionId recognized as ALREADY_SYNCED');

  // 3.10 AuditLogRepository (Append-Only Audit Trail)
  const auditRepo = new AuditLogRepository(mockExecutor);
  const initialAuditCount = (await auditRepo.getAll()).length;

  await auditRepo.record({
    action: 'RECOMMENDATION_ACCEPTED',
    actionType: 'REPLAN_APPROVED',
    userRole: 'Dispatcher',
    disruptionId: 'DIS-TEST-001',
    recommendationId: 'REPLAN-TEST-100',
    eventMessage: 'Dispatcher approved replan REPLAN-TEST-100'
  });

  const auditLogs = await auditRepo.getAll();
  assert(auditLogs.length === initialAuditCount + 1, '3.10a. AuditLogRepository appends new immutable audit record');
  assert(auditLogs[0].action === 'RECOMMENDATION_ACCEPTED', '3.10b. Audit log contains recorded action and role');

  const disruptionLogs = await auditRepo.getByDisruptionId('DIS-TEST-001');
  assert(disruptionLogs.length >= 1, '3.10c. Audit logs queried by disruptionId');

  // =========================================================================
  // 4. PostgreSQL Connection Failure & Graceful Fallback
  // =========================================================================

  // Test 4a: Connection failure with unreachable port / host
  const unreachableConn = new PgConnectionManager({
    host: '127.0.0.1',
    port: 54399, // Intentional unreachable port
    connectionTimeoutMillis: 500
  });

  const testConn = await unreachableConn.testConnection();
  assert(testConn.connected === false, '4a. PgConnectionManager catches connection failure when PostgreSQL unreachable');
  assert(testConn.error && typeof testConn.error === 'string', '4b. Connection test returns diagnostic error description');
  await unreachableConn.close();

  // Test 4b: createDatabase factory falls back to SQLite gracefully
  const fallbackDb = await createDatabase({
    usePostgres: true,
    dbPath: ':memory:',
    pgConfig: {
      host: '127.0.0.1',
      port: 54399,
      connectionTimeoutMillis: 500
    }
  });

  const meta = getDatabaseMetadata();
  assert(fallbackDb !== null, '4c. createDatabase returns active database even when PostgreSQL fails');
  assert(meta.isFallback === true, '4d. Metadata flags isFallback = true');
  assert(meta.backend === 'sqlite-fallback', '4e. Backend is designated as sqlite-fallback');
  assert(typeof fallbackDb.getBuses === 'function', '4f. Fallback database implements full domain interface');

  const busesFromFallback = await fallbackDb.getBuses();
  assert(Array.isArray(busesFromFallback) && busesFromFallback.length >= 8, '4g. Fallback database serves fleet data without interruption');

  // Verify all tables exist and work on fallback database as well
  assert(typeof fallbackDb.getDrivers === 'function', '4h. Fallback implements getDrivers');
  assert(typeof fallbackDb.saveApproval === 'function', '4i. Fallback implements saveApproval');
  assert(typeof fallbackDb.recordGpsUpdate === 'function', '4j. Fallback implements recordGpsUpdate');
  assert(typeof fallbackDb.isActionSynced === 'function', '4k. Fallback implements isActionSynced');

  // Test 4c: Clean shutdown
  if (fallbackDb.close) {
    fallbackDb.close();
  }

  // =========================================================================
  // 5. PgDatabase Facade Integration
  // =========================================================================
  const pgFacade = new PgDatabase(mockExecutor);
  const facadeBuses = await pgFacade.getBuses();
  assert(Array.isArray(facadeBuses) && facadeBuses.length > 0, '5a. PgDatabase facade exposes getBuses()');

  const facadeRoutes = await pgFacade.getRoutes();
  assert(Array.isArray(facadeRoutes) && facadeRoutes.length > 0, '5b. PgDatabase facade exposes getRoutes()');

  const facadeDisruptions = await pgFacade.getDisruptions();
  assert(Array.isArray(facadeDisruptions) && facadeDisruptions.length > 0, '5c. PgDatabase facade exposes getDisruptions()');

  console.log('\n------------------------------------------------------------------------');
  console.log(`PostgreSQL Database Tests Summary: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%).`);
  console.log('========================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('PostgreSQL Database tests failed with unexpected error:', err);
  process.exit(1);
});
