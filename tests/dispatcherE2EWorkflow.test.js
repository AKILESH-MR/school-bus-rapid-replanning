// Dispatcher End-to-End Workflow Hardening Test Suite (Phase 7)
// Verifies:
// Scenario A: Student Cancellation -> Generate -> Accept
// Scenario B: Urgent Student Addition -> Generate -> Modify -> Accept
// Scenario C: Vehicle Breakdown -> Generate -> Reject
// Scenario D: Stale recommendation -> routeVersionKey mismatch detected & safely recalculated
// Scenario E: Failed approval / synchronization -> state preserved + retry available
// Scenario F: Duplicate approval / action -> no duplicate application
// Scenario G: No feasible plan -> manual escalation
// Scenario H: Post-action state reflects final decision
// Scenario I: Endpoint contract verification between frontend and backend

import assert from 'node:assert';
import { AppStore } from '../src/state/store.js';
import * as client from '../src/api/client.js';
import { createServer } from '../server/server.js';
import { LocalDatabase } from '../server/db.js';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

console.log('========================================================================');
console.log('  PHASE 7: DISPATCHER END-TO-END WORKFLOW HARDENING TESTS');
console.log('========================================================================\n');

// -------------------------------------------------------------------------
// Scenario A: Student Cancellation -> Generate -> Accept
// -------------------------------------------------------------------------
test('A. Student Cancellation -> Generate -> Accept updates roster and frees seat', () => {
  const store = new AppStore();
  const student = store.getState().students.find(s => s.busId && s.busId !== 'UNASSIGNED');
  assert.ok(student, 'Must have an active assigned student');

  const bus = store.getState().buses.find(b => b.id === student.busId);
  const route = store.getState().routes.find(r => r.id === student.routeId);
  const origLoad = bus.currentLoad;
  const origDelay = route.delayMinutes || 0;

  // 1. Dispatcher initiates cancellation
  store.cancelStudent(student.id);

  const disruption = store.getState().disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);
  assert.ok(disruption, 'Disruption must be generated for student cancellation');
  assert.strictEqual(disruption.status, 'unresolved', 'Disruption remains unresolved awaiting dispatcher approval');
  assert.strictEqual(bus.currentLoad, origLoad, 'Bus load must remain unchanged before approval');

  // 2. Dispatcher accepts cancellation plan
  store.acceptAIPlan(disruption.id);

  assert.strictEqual(disruption.status, 'accepted', 'Disruption marked accepted');
  assert.strictEqual(student.status, 'absent_cancelled', 'Student status updated to absent_cancelled');
  assert.strictEqual(bus.currentLoad, origLoad - 1, 'Bus load decremented by 1 upon approval');
  assert.ok(route.delayMinutes <= origDelay, 'Route delay decreased or preserved');

  const audit = store.getState().auditEvents.find(e => e.disruptionId === disruption.id && e.action === 'RECOMMENDATION_ACCEPTED');
  assert.ok(audit, 'Audit log must record RECOMMENDATION_ACCEPTED');
});

// -------------------------------------------------------------------------
// Scenario B: Urgent Student Addition -> Generate -> Modify -> Accept
// -------------------------------------------------------------------------
test('B. Urgent Student Addition -> Generate -> Modify -> Accept', () => {
  const store = new AppStore();
  const testStudent = {
    id: 'STU-DISP-001',
    name: 'Marcus Vance',
    grade: '4th',
    schoolId: 'SCH-01',
    stopName: '450 Hayes St',
    pickupCoords: [37.7760, -122.4240],
    specialNeeds: 'None'
  };

  // 1. Generate recommendation
  store.addStudent(testStudent);
  const disruption = store.getState().disruptions.find(d => d.type === 'urgent_add' && (d.studentName === testStudent.name || d.studentId === testStudent.id));
  assert.ok(disruption, 'Urgent student disruption created');
  assert.ok(disruption.aiRecommendation, 'Recommendation generated');
  const originalBusId = disruption.aiRecommendation.recommendedBusId;

  // 2. Modify constraints
  store.openConstraintCustomizer(disruption.id);
  store.recalculateModifiedConstraints(disruption.id, {
    maxAllowedDelay: 25,
    minRequiredSeats: 2
  });

  const customizer = store.getState().customizer;
  assert.ok(customizer.isOpen, 'Customizer is open');
  assert.ok(customizer.selectedCandidate, 'Selected candidate exists');
  const appliedBusId = customizer.selectedCandidate.bus.id;
  const targetBus = store.getState().buses.find(b => b.id === appliedBusId);
  const origBusLoad = targetBus.currentLoad;

  // 3. Accept modified plan
  store.acceptModifiedPlan(disruption.id);

  assert.strictEqual(disruption.status, 'accepted', 'Modified plan accepted');
  assert.strictEqual(disruption.aiRecommendation.recommendedBusId, appliedBusId, 'Disruption updated with modified bus');
  assert.strictEqual(targetBus.currentLoad, origBusLoad + 1, 'Target bus load incremented');

  const modifyAudit = store.getState().auditEvents.find(e => e.action === 'MODIFY_PLAN');
  assert.ok(modifyAudit, 'Audit log must record MODIFY_PLAN');
  assert.strictEqual(modifyAudit.selectedPlan.recommendedBusId, appliedBusId);
});

// -------------------------------------------------------------------------
// Scenario C: Vehicle Breakdown -> Generate -> Reject
// -------------------------------------------------------------------------
test('C. Vehicle Breakdown -> Generate -> Reject preserves original state without mutation', () => {
  const store = new AppStore();
  const activeBus = store.getState().buses.find(b => b.status === 'in_transit');
  assert.ok(activeBus, 'Must have active in-transit bus');
  const origBusId = activeBus.id;

  store.handleVehicleBreakdown(origBusId, { impact: 'Engine coolant temperature warning' });
  const disruption = store.getState().disruptions.find(d => d.type === 'breakdown' && d.busId === origBusId);
  assert.ok(disruption, 'Breakdown disruption created');

  const candidateBusId = disruption.aiRecommendation?.recommendedBusId;
  const candidateBus = store.getState().buses.find(b => b.id === candidateBusId);
  const candOrigLoad = candidateBus ? candidateBus.currentLoad : 0;

  // Dispatcher rejects replacement
  store.rejectAIPlan(disruption.id, 'Operations manager dispatching tow vehicle; no passenger transfer');

  assert.strictEqual(disruption.status, 'rejected', 'Disruption marked rejected');
  assert.strictEqual(disruption.rejectionReason, 'Operations manager dispatching tow vehicle; no passenger transfer');

  if (candidateBus) {
    assert.strictEqual(candidateBus.currentLoad, candOrigLoad, 'Candidate bus load unchanged on rejection');
  }

  const rejectAudit = store.getState().auditEvents.find(e => e.action === 'RECOMMENDATION_REJECTED' && e.disruptionId === disruption.id);
  assert.ok(rejectAudit, 'Audit log must record RECOMMENDATION_REJECTED');
  assert.strictEqual(rejectAudit.rejectionReason, 'Operations manager dispatching tow vehicle; no passenger transfer');
});

// -------------------------------------------------------------------------
// Scenario D: Stale recommendation protection
// -------------------------------------------------------------------------
test('D. Stale recommendation: routeVersionKey mismatch detected & insertion safely recalculated', () => {
  const store = new AppStore();
  const student = {
    id: 'STU-STALE-001',
    name: 'Chloe Bennett',
    stopName: '200 Guerrero St',
    pickupCoords: [37.7680, -122.4240],
    schoolId: 'SCH-01',
    specialNeeds: 'None'
  };

  store.addStudent(student);
  const disruption = store.getState().disruptions.find(d => d.studentName === student.name || d.studentId === student.id);
  assert.ok(disruption?.aiRecommendation, 'Recommendation generated');

  const rec = disruption.aiRecommendation;
  const targetRoute = store.getState().routes.find(r => r.id === rec.recommendedRouteId);
  assert.ok(targetRoute, 'Target route found');

  // Simulate route progression while recommendation was pending: mark first stop completed
  if (targetRoute.stops && targetRoute.stops.length > 0) {
    targetRoute.stops[0].status = 'completed';
  }
  // Change route fingerprint
  targetRoute.stops.push({
    id: 'ST-EXTRA-TEST',
    name: 'Temporary Police Detour Stop',
    coords: [37.77, -122.42],
    status: 'passed'
  });

  // Attempt to approve plan
  store.acceptAIPlan(disruption.id);

  assert.strictEqual(disruption.status, 'accepted');
  assert.strictEqual(rec.wasStaleReplanned, true, 'wasStaleReplanned flag set on stale route');
  assert.ok(rec.appliedInsertionPosition >= 1, 'Insertion position recalculated past completed stop');

  const staleLog = store.getState().metrics.recentAuditLogs.find(l => l.status === 'STALE_RECOMMENDATION_REPLAN');
  assert.ok(staleLog, 'Audit log must record STALE_RECOMMENDATION_REPLAN');
});

// -------------------------------------------------------------------------
// Scenario E: Failed approval / synchronization -> state preserved + retry available
// -------------------------------------------------------------------------
test('E. Failed approval synchronization preserves error state with retry parameters', () => {
  const store = new AppStore();
  const disruption = store.getState().disruptions[0];

  store.setErrorState('planDecision', {
    message: 'Unable to synchronize plan APPROVE with central server. Local plan active.',
    retryable: true,
    action: 'APPROVE',
    disruptionId: disruption.id,
    payload: { replanId: disruption.aiRecommendation?.planId || disruption.id },
    operation: 'planDecision'
  });

  const err = store.getOperationError('planDecision');
  assert.ok(err, 'Operation error recorded');
  assert.strictEqual(err.retryable, true, 'Error marked retryable');
  assert.strictEqual(err.disruptionId, disruption.id, 'Disruption ID preserved');

  // Verify retryPlanDecision clears error and re-executes
  let planDecisionInvoked = false;
  const origPersist = store.persistPlanDecision.bind(store);
  store.persistPlanDecision = (id, action, payload) => {
    planDecisionInvoked = true;
    return origPersist(id, action, payload);
  };

  store.retryPlanDecision(disruption.id);
  assert.strictEqual(planDecisionInvoked, true, 'retryPlanDecision invoked persistPlanDecision');
  store.persistPlanDecision = origPersist;
});

// -------------------------------------------------------------------------
// Scenario F: Duplicate approval / action -> no duplicate application
// -------------------------------------------------------------------------
test('F. Duplicate approval calls on already accepted plan are suppressed idempotently', () => {
  const store = new AppStore();
  const disruption = store.getState().disruptions.find(d => d.status === 'unresolved');
  if (disruption && disruption.aiRecommendation?.recommendedBusId) {
    const bus = store.getState().buses.find(b => b.id === disruption.aiRecommendation.recommendedBusId);
    const route = store.getState().routes.find(r => r.id === disruption.aiRecommendation.recommendedRouteId);
    
    // First accept
    store.acceptAIPlan(disruption.id);
    assert.strictEqual(disruption.status, 'accepted');
    const loadAfterFirst = bus ? bus.currentLoad : null;
    const stopsAfterFirst = route ? route.stops.length : null;

    // Second duplicate accept
    store.acceptAIPlan(disruption.id);
    if (bus) {
      assert.strictEqual(bus.currentLoad, loadAfterFirst, 'Duplicate accept must not increment bus load again');
    }
    if (route) {
      assert.strictEqual(route.stops.length, stopsAfterFirst, 'Duplicate accept must not insert stop again');
    }
  }

  // Duplicate rejection
  const rejDisruption = store.getState().disruptions[1] || store.getState().disruptions[0];
  store.rejectAIPlan(rejDisruption.id, 'First rejection');
  assert.strictEqual(rejDisruption.status, 'rejected');
  const auditCount = store.getState().auditEvents.filter(e => e.action === 'RECOMMENDATION_REJECTED' && e.disruptionId === rejDisruption.id).length;

  // Second duplicate reject
  store.rejectAIPlan(rejDisruption.id, 'Second duplicate rejection');
  const auditCountAfter = store.getState().auditEvents.filter(e => e.action === 'RECOMMENDATION_REJECTED' && e.disruptionId === rejDisruption.id).length;
  assert.strictEqual(auditCountAfter, auditCount, 'Duplicate reject must not duplicate audit events');
});

// -------------------------------------------------------------------------
// Scenario G: No feasible plan -> manual escalation
// -------------------------------------------------------------------------
test('G. No feasible plan triggers manual escalation and records fallback event', () => {
  const store = new AppStore();
  
  // Set all buses to 0 capacity or breakdown to simulate complete fleet exhaustion
  store.getState().buses.forEach(b => {
    b.currentLoad = b.capacity; // Zero available seats
  });

  const student = {
    id: 'STU-NO-FEASIBLE',
    name: 'Lucas Wright',
    stopName: '300 Mission St',
    pickupCoords: [37.79, -122.40],
    schoolId: 'SCH-01',
    specialNeeds: 'None'
  };

  store.addStudent(student);
  const disruption = store.getState().disruptions.find(d => d.studentName === student.name || d.studentId === student.id);
  assert.ok(disruption, 'Disruption record created for unaccommodated student');
  assert.strictEqual(disruption.noFeasibleSolution, true, 'noFeasibleSolution flag must be true');
  assert.strictEqual(disruption.aiRecommendationAvailable, false, 'aiRecommendationAvailable must be false');
  assert.strictEqual(disruption.aiRecommendation, null, 'aiRecommendation must be null');

  const fallbackAudit = store.getState().auditEvents.find(e => e.action === 'FALLBACK_TRIGGERED');
  assert.ok(fallbackAudit, 'FALLBACK_TRIGGERED audit event recorded');
  assert.strictEqual(fallbackAudit.details.fallbackType, 'NO_FEASIBLE_CANDIDATE_ESCALATION');
});

// -------------------------------------------------------------------------
// Scenario H: Post-action state reflects final decision
// -------------------------------------------------------------------------
test('H. Post-action state reflects final decision across all entities and audit trail', () => {
  const store = new AppStore();
  const disruption = store.getState().disruptions[0];
  assert.ok(disruption, 'Disruption exists');

  store.acceptAIPlan(disruption.id);
  assert.strictEqual(disruption.status, 'accepted');

  // Verify metrics reflect resolved incident
  const metrics = store.getState().metrics;
  assert.ok(metrics.resolvedDisruptionsToday >= 1, 'resolvedDisruptionsToday incremented');

  // Verify audit events contain detailed record
  const auditLogs = store.getState().auditEvents;
  assert.ok(auditLogs.length > 0, 'Audit trail updated');
  const latest = auditLogs[0];
  assert.ok(latest.action, 'Action name recorded');
  assert.ok(latest.timestamp, 'ISO timestamp recorded');
  assert.ok(latest.userRole, 'Dispatcher role recorded');
});

// -------------------------------------------------------------------------
// Scenario I: Endpoint contract verification between frontend and backend
// -------------------------------------------------------------------------
asyncTest('I. Endpoint contract verification: All frontend endpoints exist in server.js', async () => {
  // Test server creation
  const db = new LocalDatabase(':memory:');
  const app = createServer({ db });
  const addr = await app.listen(0);
  const port = addr.port;

  try {
    // 1. Verify GET /api/buses
    const busesRes = await fetch(`http://localhost:${port}/api/buses`);
    assert.strictEqual(busesRes.status, 200, 'GET /api/buses must return HTTP 200');

    // 2. Verify GET /api/routes
    const routesRes = await fetch(`http://localhost:${port}/api/routes`);
    assert.strictEqual(routesRes.status, 200, 'GET /api/routes must return HTTP 200');

    // 3. Verify GET /api/disruptions
    const disRes = await fetch(`http://localhost:${port}/api/disruptions`);
    assert.strictEqual(disRes.status, 200, 'GET /api/disruptions must return HTTP 200');

    // 4. Verify GET /api/drivers
    const drvRes = await fetch(`http://localhost:${port}/api/drivers`);
    assert.strictEqual(drvRes.status, 200, 'GET /api/drivers must return HTTP 200');

    // 5. Verify GET /api/students
    const stuRes = await fetch(`http://localhost:${port}/api/students`);
    assert.strictEqual(stuRes.status, 200, 'GET /api/students must return HTTP 200');

    // 6. Verify GET /api/schools
    const schRes = await fetch(`http://localhost:${port}/api/schools`);
    assert.strictEqual(schRes.status, 200, 'GET /api/schools must return HTTP 200');

    // 7. Verify GET /api/audit
    const audRes = await fetch(`http://localhost:${port}/api/audit`);
    assert.strictEqual(audRes.status, 200, 'GET /api/audit must return HTTP 200');

    // 8. Verify GET /api/health
    const healthRes = await fetch(`http://localhost:${port}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'GET /api/health must return HTTP 200');

    // 9. Verify /api/fleet does NOT exist (must return 404)
    const fleetRes = await fetch(`http://localhost:${port}/api/fleet`);
    assert.strictEqual(fleetRes.status, 404, '/api/fleet must return 404 (endpoint does not exist)');

    // 10. Verify POST /api/sync
    const syncRes = await fetch(`http://localhost:${port}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions: [] })
    });
    assert.strictEqual(syncRes.status, 200, 'POST /api/sync must return HTTP 200');
  } finally {
    await app.close();
  }
});
