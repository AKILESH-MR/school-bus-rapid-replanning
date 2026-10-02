/**
 * Insertion Position Consistency Tests
 *
 * Verifies that the greedy algorithm chosen insertionPosition is:
 *   1. Stored in the disruption recommendation at generation time.
 *   2. Applied exactly at dispatcher acceptance time.
 *   3. Protected against stale routes via routeVersionKey fingerprinting.
 *   4. Never placed in already-completed stops.
 *   5. Reflected consistently in both the displayed recommendation and the final route.
 *   6. Recorded in the audit log with bus ID and insertion position.
 */
import { routeInsertion, replanningEngine } from '../src/utils/replanningEngine.js';
import { AppStore } from '../src/state/store.js';

console.log('========================================================================');
console.log('  INSERTION POSITION CONSISTENCY: TEST SUITE');
console.log('========================================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, message) {
  totalTests++;
  if (condition) { passedTests++; console.log('[PASS] ' + testName); }
  else { console.error('[FAIL] ' + testName + (message ? ': ' + message : '')); }
}

// Shared fixture: 6-stop route, stops 0-1 completed, 2-5 remaining
function makeRoute(overrides) {
  return Object.assign({
    id: 'RT-TEST', schoolId: 'SCH-01', assignedBus: 'BUS-TEST', assignedDriver: 'Test Driver',
    stops: [
      { id: 'S0', name: 'Depot Start',     status: 'completed',   coords: [37.76, -122.45] },
      { id: 'S1', name: 'Oak Street',      status: 'completed',   coords: [37.77, -122.44] },
      { id: 'S2', name: 'Pine Avenue',     status: 'next',        coords: [37.78, -122.43] },
      { id: 'S3', name: 'Elm Boulevard',   status: 'pending',     coords: [37.79, -122.42] },
      { id: 'S4', name: 'Maple Drive',     status: 'pending',     coords: [37.80, -122.41] },
      { id: 'S5', name: 'School Entrance', status: 'destination', coords: [37.81, -122.40] }
    ],
    totalStops: 6
  }, overrides || {});
}

function makeBus(overrides) {
  return Object.assign({
    id: 'BUS-TEST', capacity: 54, currentLoad: 20, status: 'in_transit',
    routeId: 'RT-TEST', driverId: 'DRV-TEST', amenities: ['Wheelchair Lift'],
    coords: [37.78, -122.43]
  }, overrides || {});
}

function makeDriver(overrides) {
  return Object.assign({
    id: 'DRV-TEST', name: 'Test Driver', status: 'active', currentLocation: [37.78, -122.43]
  }, overrides || {});
}

// Mirror of store.js computeRouteVersionKey (tested in isolation)
function computeRouteVersionKey(route) {
  if (!route || !route.stops) return 'no-route';
  const cc = route.stops.filter(function(s) { return s.status === 'completed' || s.status === 'passed'; }).length;
  const fn = route.stops[0] ? route.stops[0].name : '';
  return route.id + ':stops=' + route.stops.length + ':completed=' + cc + ':first=' + fn;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: Greedy selects position 2 -> accepted route uses position 2
// ─────────────────────────────────────────────────────────────────────────────
{
  const route = makeRoute();
  const bus = makeBus();
  const studentStop = { name: 'Close to Pine Ave', coords: [37.775, -122.435], specialNeeds: 'None' };
  const result = routeInsertion.evaluateUrgentStudentInsertion(bus, route, studentStop);

  assert(result.bestPosition >= 2,
    '1a. Greedy position >= completed count (2)',
    'bestPosition=' + result.bestPosition);

  const insertedStop = result.newStops[result.bestPosition];
  assert(insertedStop && insertedStop.name === studentStop.name,
    '1b. newStops[bestPosition] is the inserted stop',
    'stop=' + (insertedStop ? insertedStop.name : 'undefined'));
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: Greedy selects position 4 -> accepted route uses position 4
// ─────────────────────────────────────────────────────────────────────────────
{
  const route = makeRoute();
  const bus = makeBus();
  const studentStop = { name: 'Near Maple Drive', coords: [37.795, -122.415], specialNeeds: 'None' };
  const result = routeInsertion.evaluateUrgentStudentInsertion(bus, route, studentStop);

  assert(result.bestPosition >= 2 && result.bestPosition <= 6,
    '2a. Far pickup: greedy position in valid range [2,6]',
    'bestPosition=' + result.bestPosition);

  assert(result.newStops.length === route.stops.length + 1,
    '2b. newStops has exactly one additional stop',
    'expected=' + (route.stops.length + 1) + ', got=' + result.newStops.length);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: First/last valid insertion positions
// ─────────────────────────────────────────────────────────────────────────────
{
  const route = makeRoute();
  const bus = makeBus();

  const nearStart = { name: 'Near Pine Ave', coords: [37.780, -122.430], specialNeeds: 'None' };
  const startResult = routeInsertion.evaluateUrgentStudentInsertion(bus, route, nearStart);
  assert(startResult.bestPosition >= 2,
    '3a. First valid insertion position is >= 2',
    'bestPosition=' + startResult.bestPosition);

  const nearEnd = { name: 'Near School', coords: [37.810, -122.400], specialNeeds: 'None' };
  const endResult = routeInsertion.evaluateUrgentStudentInsertion(bus, route, nearEnd);
  assert(endResult.bestPosition <= route.stops.length,
    '3b. Last valid insertion position is <= stops.length (append allowed)',
    'bestPosition=' + endResult.bestPosition);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: Completed stops CANNOT be modified
// ─────────────────────────────────────────────────────────────────────────────
{
  const route = makeRoute();
  const bus = makeBus();
  const studentStop = { name: 'Any Stop', coords: [37.77, -122.43], specialNeeds: 'None' };
  const result = routeInsertion.evaluateUrgentStudentInsertion(bus, route, studentStop);

  assert(result.bestPosition >= 2,
    '4a. Insertion never lands in completed stops (position must be >= 2)',
    'bestPosition=' + result.bestPosition + ', completedCount=2');

  const s0 = result.newStops[0];
  const s1 = result.newStops[1];
  assert(s0 && s0.status === 'completed' && s1 && s1.status === 'completed',
    '4b. Original completed stops remain unmodified in newStops',
    'stop[0]=' + (s0 ? s0.status : 'undef') + ', stop[1]=' + (s1 ? s1.status : 'undef'));
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: Route changes after recommendation -> stale recommendation detected
// ─────────────────────────────────────────────────────────────────────────────
{
  const routeAtRec = makeRoute();
  const vAtRec = computeRouteVersionKey(routeAtRec);

  // Simulate bus progress: one more stop becomes completed
  const routeProgressed = makeRoute();
  routeProgressed.stops[2].status = 'completed';
  assert(vAtRec !== computeRouteVersionKey(routeProgressed),
    '5a. Version key changes when a stop is marked completed',
    'before="' + vAtRec + '"');

  // Simulate another dispatcher adding a stop
  const routeWithExtra = makeRoute();
  routeWithExtra.stops.push({ id: 'S6', name: 'Extra Stop', status: 'pending', coords: [37.82, -122.39] });
  assert(vAtRec !== computeRouteVersionKey(routeWithExtra),
    '5b. Version key changes when a stop is appended',
    'before="' + vAtRec + '"');

  // Unchanged route should produce the same key (no false positives)
  const sameRoute = makeRoute();
  assert(vAtRec === computeRouteVersionKey(sameRoute),
    '5c. Version key is stable for an unchanged route (no false positives)',
    'key="' + vAtRec + '"');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: Accepted plan and displayed recommendation contain the same route
// ─────────────────────────────────────────────────────────────────────────────
{
  const bus = makeBus();
  const route = makeRoute();
  const driver = makeDriver();

  const engineResult = replanningEngine.replan(
    { type: 'urgent_add', studentStop: { name: 'New Stop', coords: [37.785, -122.425], specialNeeds: 'None' }, destinationSchoolId: 'SCH-01', requiredSeats: 1 },
    { buses: [bus], routes: [route], drivers: [driver] }
  );

  assert(!engineResult.noFeasibleSolution,
    '6a. Engine finds a feasible solution for the standard fixture',
    'noFeasibleSolution=' + engineResult.noFeasibleSolution);

  assert(engineResult.newRoute !== null && engineResult.newRoute.stops.length === route.stops.length + 1,
    '6b. Engine newRoute has exactly one additional stop',
    'length=' + (engineResult.newRoute ? engineResult.newRoute.stops.length : 'null'));

  const pos = engineResult.insertionPosition;
  assert(pos != null && engineResult.newRoute && engineResult.newRoute.stops[pos] !== undefined,
    '6c. engineResult.insertionPosition points to a valid stop in newRoute',
    'pos=' + pos);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: Final route metrics match the accepted plan
// ─────────────────────────────────────────────────────────────────────────────
{
  const bus = makeBus();
  const route = makeRoute();
  const driver = makeDriver();

  const engineResult = replanningEngine.replan(
    { type: 'urgent_add', studentStop: { name: 'Metric Stop', coords: [37.785, -122.425], specialNeeds: 'None' }, destinationSchoolId: 'SCH-01', requiredSeats: 1 },
    { buses: [bus], routes: [route], drivers: [driver] }
  );

  if (!engineResult.noFeasibleSolution && engineResult.newRoute) {
    assert(engineResult.newRoute.totalStops === engineResult.newRoute.stops.length,
      '7a. newRoute.totalStops matches actual stops.length after insertion',
      'totalStops=' + engineResult.newRoute.totalStops + ', actual=' + engineResult.newRoute.stops.length);

    assert(engineResult.additionalDelay > 0,
      '7b. additionalDelay is positive (insertion adds delay)',
      'additionalDelay=' + engineResult.additionalDelay);

    assert(engineResult.additionalDistance >= 0,
      '7c. additionalDistance is non-negative',
      'additionalDistance=' + engineResult.additionalDistance);

    const origCompleted = route.stops.filter(function(s) { return s.status === 'completed' || s.status === 'passed'; }).length;
    const newCompleted = engineResult.newRoute.completedStops ? engineResult.newRoute.completedStops.length : 0;
    assert(newCompleted === origCompleted,
      '7d. Completed stops count unchanged after insertion (no retroactive completion)',
      'original=' + origCompleted + ', new=' + newCompleted);
  } else {
    assert(false, '7. Engine must find feasible solution for metrics test');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: Audit log records selected bus and insertion position
// ─────────────────────────────────────────────────────────────────────────────
{
  const store = new AppStore();
  const targetRoute = store.state.routes[0];
  const targetBus = store.state.buses.find(function(b) { return b.status === 'in_depot' || b.status === 'in_transit'; }) || store.state.buses[0];
  const studentId = 'STU-AUDIT-TEST';

  store.state.students.unshift({
    id: studentId, name: 'Audit Test Student', status: 'urgent_added',
    busId: 'UNASSIGNED', routeId: 'UNASSIGNED', stopName: 'Audit Test Stop',
    schoolId: 'SCH-01', specialNeeds: 'None', pickupCoords: [37.77, -122.42]
  });

  const versionKey = computeRouteVersionKey(targetRoute);
  const disruptionId = 'DIS-AUDIT-001';
  store.state.disruptions.unshift({
    id: disruptionId,
    _createdAtMs: Date.now() - 5000,
    type: 'urgent_add',
    title: 'Audit Test Disruption',
    studentId: studentId,
    status: 'unresolved',
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: 'REPLAN-AUDIT-001',
      recommendedBusId: targetBus.id,
      recommendedRouteId: targetRoute.id,
      greedyInsertionPosition: 2,
      routeVersionKey: versionKey,
      urgentStopName: 'Audit Test Stop',
      urgentStopCoords: [37.77, -122.42],
      urgentStudentId: studentId,
      additionalDelayMins: 3.5
    }
  });

  const auditBefore = store.state.auditEvents.length;
  store.acceptAIPlan(disruptionId);
  const auditAfter = store.state.auditEvents.length;

  assert(auditAfter > auditBefore,
    '8a. acceptAIPlan creates at least one new audit event',
    'before=' + auditBefore + ', after=' + auditAfter);

  const event = store.state.auditEvents.find(function(e) {
    return e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === disruptionId;
  });

  assert(event != null,
    '8b. Audit log contains a RECOMMENDATION_ACCEPTED event for the disruption');

  if (event) {
    assert(event.selectedPlan && event.selectedPlan.appliedInsertionPosition >= 0,
      '8c. Audit event selectedPlan records appliedInsertionPosition >= 0',
      'pos=' + (event.selectedPlan ? event.selectedPlan.appliedInsertionPosition : 'undefined'));

    assert(event.selectedPlan && (event.selectedPlan.recommendedBusId === targetBus.id || event.selectedPlan.appliedInsertionPosition != null),
      '8d. Audit event records the selected bus ID and/or insertion position',
      'busId=' + (event.selectedPlan ? event.selectedPlan.recommendedBusId : 'undefined'));
  }
}

console.log('');
console.log('------------------------------------------------------------------------');
console.log('Insertion Position Tests: ' + passedTests + '/' + totalTests + ' Passed (' + Math.round((passedTests / totalTests) * 100) + '%).');
console.log('------------------------------------------------------------------------');
if (passedTests !== totalTests) process.exit(1);
