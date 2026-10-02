// ============================================================================
// TESTS: DISPATCHER "MODIFY" WORKFLOW & CONSTRAINT CUSTOMIZER
// ============================================================================
import { AppStore } from '../src/state/store.js';
import { replanningEngine, recalculateWithCustomConstraints, computeBeforeAfterComparison } from '../src/utils/replanningEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, errorDetails = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName} - ${errorDetails}`);
    failed++;
  }
}

console.log('========================================================================');
console.log('  DISPATCHER "MODIFY" WORKFLOW & CONSTRAINT CUSTOMIZER: UNIT TEST SUITE');
console.log('========================================================================\n');

// Common mock data
const mockFleetState = {
  buses: [
    { id: 'BUS-01', model: 'Blue Bird', capacity: 54, currentLoad: 42, status: 'in_transit', routeId: 'RT-101', coords: [37.77, -122.42] },
    { id: 'BUS-02', model: 'Thomas Built', capacity: 54, currentLoad: 30, status: 'in_transit', routeId: 'RT-102', coords: [37.78, -122.41] },
    { id: 'BUS-05', model: 'Depot Reserve Shuttle', capacity: 30, currentLoad: 0, status: 'in_depot', routeId: null, coords: [37.755, -122.405] }
  ],
  routes: [
    {
      id: 'RT-101',
      name: 'Route 101',
      assignedBus: 'BUS-01',
      totalStops: 4,
      completedStops: [{ id: 'S1', name: 'Stop 1' }],
      stops: [
        { id: 'S1', name: 'Stop 1', coords: [37.77, -122.42], status: 'completed' },
        { id: 'S2', name: 'Stop 2', coords: [37.775, -122.418], status: 'pending' },
        { id: 'S3', name: 'Stop 3', coords: [37.78, -122.415], status: 'pending' },
        { id: 'S4', name: 'Destination School', coords: [37.785, -122.41], status: 'pending' }
      ]
    },
    {
      id: 'RT-102',
      name: 'Route 102',
      assignedBus: 'BUS-02',
      totalStops: 4,
      completedStops: [{ id: 'R1', name: 'Stop R1' }],
      stops: [
        { id: 'R1', name: 'Stop R1', coords: [37.78, -122.41], status: 'completed' },
        { id: 'R2', name: 'Stop R2', coords: [37.782, -122.408], status: 'pending' },
        { id: 'R3', name: 'Stop R3', coords: [37.784, -122.406], status: 'pending' },
        { id: 'R4', name: 'Destination School', coords: [37.785, -122.41], status: 'pending' }
      ]
    }
  ],
  drivers: [
    { id: 'DRV-101', name: 'Driver 1', availabilityStatus: 'active', currentLocation: [37.77, -122.42], locationSource: 'mobile_gps' },
    { id: 'DRV-102', name: 'Driver 2', availabilityStatus: 'active', currentLocation: [37.78, -122.41], locationSource: 'mobile_gps' },
    { id: 'DRV-106', name: 'Reserve Driver', availabilityStatus: 'standby', currentLocation: [37.755, -122.405], locationSource: 'depot_checkin' }
  ]
};

const baseUrgentContext = {
  type: 'urgent_add',
  destinationSchoolId: 'SCH-01',
  studentStop: {
    name: '1250 Mission St',
    coords: [37.776, -122.416],
    specialNeeds: 'None'
  },
  requiredSeats: 1
};

// ============================================================================
// TEST 1: Modify Maximum Allowed Delay
// ============================================================================
{
  // First calculate baseline without strict max delay
  const baseResult = replanningEngine.replan(baseUrgentContext, mockFleetState);
  assert(baseResult.feasibleCandidates.length >= 2, '1. Modify maximum delay: baseline has multiple feasible candidates');

  // Now dispatcher modifies maximum allowed delay to be very tight (e.g. 1.0 min)
  const modifiedResult = recalculateWithCustomConstraints(baseUrgentContext, mockFleetState, {
    maxAllowedDelay: 1.0
  });

  // Verify candidates exceeding 1.0 min delay were rejected
  const anyExceedingDelay = modifiedResult.feasibleCandidates.some(c => c.additionalDelay > 1.0);
  const rejectionsHaveDelayReason = modifiedResult.rejectedCandidates.some(r => r.reason.toLowerCase().includes('exceeds maximum allowed delay'));

  assert(!anyExceedingDelay && rejectionsHaveDelayReason, '1. Modify maximum delay: candidates exceeding delay limit are filtered out');
}

// ============================================================================
// TEST 2: Modify Preferred Bus
// ============================================================================
{
  // Baseline selects best score candidate
  const baseResult = replanningEngine.replan(baseUrgentContext, mockFleetState);
  const originalBestBus = baseResult.selectedBus;

  // Dispatcher explicitly designates BUS-02 as the preferred vehicle
  const preferredBusTarget = 'BUS-02';
  const modifiedResult = recalculateWithCustomConstraints(baseUrgentContext, mockFleetState, {
    preferredBusId: preferredBusTarget
  });

  const bestCandidate = modifiedResult.feasibleCandidates[0];
  const isPreferredSelected = bestCandidate && bestCandidate.bus.id === preferredBusTarget;
  const hasPreferredTag = bestCandidate && bestCandidate.isPreferredBus === true;

  assert(isPreferredSelected && hasPreferredTag, '2. Modify preferred bus: specified vehicle receives priority and ranks #1');
}

// ============================================================================
// TEST 3: Recalculate (Dispatcher Remains Decision-Maker)
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions.find(d => d.type === 'urgent_add') || store.state.disruptions[0];

  // Dispatcher opens customizer and recalculates with new constraints
  const recalculation = store.recalculateModifiedConstraints(testDisruption.id, {
    maxAllowedDelay: 10,
    minRequiredSeats: 3,
    preferredBusId: 'BUS-02',
    driverPreference: 'ANY',
    requiresWheelchair: false,
    preferredRouteId: 'ANY'
  });

  // Verifications:
  // 1. Recalculated result exists with candidate ranking
  const hasRanking = recalculation && recalculation.recalculatedResult && recalculation.recalculatedResult.feasibleCandidates.length > 0;

  // 2. Before/After comparison structure is generated with required fields:
  // BEFORE: Bus, Route, Capacity, Delay
  // AFTER: Bus, Route, Capacity, Delay, Additional distance
  const comp = recalculation.beforeAfterComparison;
  const beforeOk = comp && comp.before && comp.before.bus && comp.before.route && comp.before.capacity && comp.before.delay;
  const afterOk = comp && comp.after && comp.after.bus && comp.after.route && comp.after.capacity && comp.after.delay && comp.after.additionalDistance;

  // 3. IMPORTANT: Human authority requirement - status must NOT be automatically accepted
  const notAutoApplied = testDisruption.status !== 'accepted';

  assert(hasRanking && beforeOk && afterOk && notAutoApplied, '3. Recalculate: candidate ranking and before/after snapshot generated without auto-approval');
}

// ============================================================================
// TEST 4: Accept Modified Plan
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions.find(d => d.type === 'urgent_add') || store.state.disruptions[0];
  const initialStatus = testDisruption.status;

  // Recalculate with modified constraints
  store.recalculateModifiedConstraints(testDisruption.id, {
    preferredBusId: 'BUS-02',
    maxAllowedDelay: 8
  });

  const selectedCand = store.state.customizer.selectedCandidate;
  const candBusId = selectedCand.bus.id;
  const initialLoad = store.state.buses.find(b => b.id === candBusId).currentLoad || 0;

  // Dispatcher explicitly accepts the modified plan
  const auditEvent = store.acceptModifiedPlan(testDisruption.id, store.state.customizer.constraints, selectedCand);

  const updatedBus = store.state.buses.find(b => b.id === candBusId);
  const planAccepted = testDisruption.status === 'accepted';
  const customizerClosed = store.state.customizer.isOpen === false;
  const busLoadUpdated = (updatedBus.currentLoad || 0) >= initialLoad;

  assert(planAccepted && customizerClosed && busLoadUpdated, '4. Accept modified plan: dispatcher approval applies modified plan and updates vehicle load');
}

// ============================================================================
// TEST 5: Reject Modified Plan
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions.find(d => d.type === 'urgent_add') || store.state.disruptions[0];
  const originalStudentBus = store.state.students.find(s => s.id === testDisruption.studentId)?.busId;

  // Recalculate with modified constraints
  store.recalculateModifiedConstraints(testDisruption.id, {
    preferredBusId: 'BUS-02'
  });

  // Dispatcher rejects the modified plan
  store.rejectModifiedPlan(testDisruption.id, "Operational constraint unacceptable to dispatcher");

  const currentStudentBus = store.state.students.find(s => s.id === testDisruption.studentId)?.busId;
  const customizerClosed = store.state.customizer.isOpen === false;
  const noUnintendedStateChange = currentStudentBus === originalStudentBus;

  assert(customizerClosed && noUnintendedStateChange, '5. Reject modified plan: dispatcher rejection discards plan without modifying live assignments');
}

// ============================================================================
// TEST 6: Audit Log Created
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions.find(d => d.type === 'urgent_add') || store.state.disruptions[0];

  // Recalculate and accept
  store.recalculateModifiedConstraints(testDisruption.id, {
    maxAllowedDelay: 5,
    minRequiredSeats: 2,
    preferredBusId: 'BUS-02'
  });

  const auditEvent = store.acceptModifiedPlan(testDisruption.id);
  const allAuditLogs = store.getAuditEvents();

  // Audit event must match specification:
  // {
  //   action: "MODIFY_PLAN",
  //   userRole: "Dispatcher",
  //   originalRecommendation,
  //   modifiedConstraints,
  //   selectedPlan,
  //   timestamp
  // }
  const hasAction = auditEvent.action === 'MODIFY_PLAN';
  const hasUserRole = auditEvent.userRole === 'Dispatcher' || auditEvent.userRole === 'Operations Manager';
  const hasOriginal = auditEvent.originalRecommendation !== undefined;
  const hasModifiedConstraints = auditEvent.modifiedConstraints && auditEvent.modifiedConstraints.maxAllowedDelay === 5;
  const hasSelectedPlan = auditEvent.selectedPlan && (auditEvent.selectedPlan.recommendedBusId || auditEvent.selectedPlan.busId);
  const hasTimestamp = Boolean(auditEvent.timestamp);
  const loggedInState = allAuditLogs.some(a => a.action === 'MODIFY_PLAN');

  assert(
    hasAction && hasUserRole && hasOriginal && hasModifiedConstraints && hasSelectedPlan && hasTimestamp && loggedInState,
    '6. Audit log created: exact required audit event schema persisted'
  );
}

console.log('------------------------------------------------------------------------');
console.log(`Modify Plan Workflow Tests: ${passed}/${passed + failed} Passed (${Math.round((passed / (passed + failed)) * 100)}%).`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
}
