// ============================================================================
// TESTS: RESPONSIBLE AI EXPLANATION, UNCERTAINTY LAYER & AUDIT LOGGING
// ============================================================================
import { AppStore } from '../src/state/store.js';
import { replanningEngine, buildExplanationAndUncertainty } from '../src/utils/replanningEngine.js';

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
console.log('  EXPLANATION, UNCERTAINTY LAYER & AUDIT LOGGING: UNIT TEST SUITE');
console.log('========================================================================\n');

// Mock Fleet State
const mockFleetState = {
  buses: [
    { id: 'BUS-05', model: 'Depot Reserve', capacity: 8, currentLoad: 0, status: 'in_depot', driverId: 'DRV-106', coords: [37.755, -122.405], gpsStatus: 'live', gpsAgeSeconds: 18 },
    { id: 'BUS-02', model: 'Full Route Bus', capacity: 54, currentLoad: 54, status: 'in_transit', routeId: 'RT-102', driverId: 'DRV-102', coords: [37.78, -122.41], gpsStatus: 'live' },
    { id: 'BUS-03', model: 'Busy Route Bus', capacity: 54, currentLoad: 30, status: 'in_transit', routeId: 'RT-103', driverId: 'DRV-103', coords: [37.79, -122.40], gpsStatus: 'live' },
    { id: 'BUS-07', model: 'Maintenance Bus', capacity: 54, currentLoad: 0, status: 'maintenance', coords: [37.75, -122.40], gpsStatus: 'live' }
  ],
  routes: [
    {
      id: 'RT-102',
      name: 'Route 102',
      assignedBus: 'BUS-02',
      assignedDriver: 'Driver 2',
      schoolId: 'SCH-01',
      totalStops: 4,
      completedStops: [{ id: 'S1', name: 'Stop 1' }],
      stops: [
        { id: 'S1', name: 'Stop 1', coords: [37.78, -122.41], status: 'completed' },
        { id: 'S2', name: 'Stop 2', coords: [37.782, -122.408], status: 'pending' }
      ]
    },
    {
      id: 'RT-103',
      name: 'Route 103',
      assignedBus: 'BUS-03',
      assignedDriver: 'Driver 3',
      schoolId: 'SCH-01',
      totalStops: 4,
      completedStops: [],
      stops: [{ id: 'R1', name: 'Stop R1', coords: [37.79, -122.40], status: 'pending' }]
    }
  ],
  drivers: [
    { id: 'DRV-106', name: 'Amina Al-Mansoor', availabilityStatus: 'standby', currentLocation: [37.755, -122.405], locationSource: 'depot_checkin' },
    { id: 'DRV-102', name: 'Driver 2', availabilityStatus: 'active', currentLocation: [37.78, -122.41], locationSource: 'mobile_gps' },
    { id: 'DRV-103', name: 'Driver 3', availabilityStatus: 'active', currentAssignment: 'RT-103', commitments: ['Assigned to Charter Route'], currentLocation: [37.79, -122.40], locationSource: 'mobile_gps' }
  ]
};

const urgentContext = {
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
// TEST 1: Explanation Layer: Why selected?
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const exp = replanResult.explanationAndUncertainty;

  const hasRecommended = exp && exp.recommendedBusId === 'BUS-05';
  const hasWhyList = exp && Array.isArray(exp.whySelected) && exp.whySelected.length >= 4;
  const hasCapacityReason = exp && exp.whySelected.some(w => w.includes('available seats'));
  const hasDriverReason = exp && exp.whySelected.some(w => w.includes('Driver available'));
  const hasRouteReason = exp && exp.whySelected.some(w => w.includes('Route compatible'));
  const hasDelayReason = exp && exp.whySelected.some(w => w.includes('additional delay'));

  assert(
    hasRecommended && hasWhyList && hasCapacityReason && hasDriverReason && hasRouteReason && hasDelayReason,
    '1. Why selected: positive criteria transparently articulated'
  );
}

// ============================================================================
// TEST 2: Explanation Layer: Why other candidates rejected?
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const exp = replanResult.explanationAndUncertainty;

  const hasRejected = exp && Array.isArray(exp.rejectedCandidates) && exp.rejectedCandidates.length > 0;
  const hasCapRejection = exp && exp.rejectedCandidates.some(r => r.busId === 'BUS-02' && r.reason.toLowerCase().includes('capacity'));
  const hasUnavailableRejection = exp && exp.rejectedCandidates.some(r => r.busId === 'BUS-07' && (r.reason.toLowerCase().includes('unavailable') || r.reason.toLowerCase().includes('maintenance')));

  assert(hasRejected && hasCapRejection && hasUnavailableRejection, '2. Why rejected: specific failure reasons for every non-selected vehicle');
}

// ============================================================================
// TEST 3: Explanation Layer: Which constraints were checked?
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const exp = replanResult.explanationAndUncertainty;

  const constraints = exp && exp.constraintsChecked;
  const is6Constraints = Array.isArray(constraints) && constraints.length === 6;
  const allVerified = constraints && constraints.every(c => c.status === 'VERIFIED');
  const hasOperational = constraints && constraints.some(c => c.name.toLowerCase().includes('operational'));
  const hasCapacity = constraints && constraints.some(c => c.name.toLowerCase().includes('capacity'));
  const hasDriver = constraints && constraints.some(c => c.name.toLowerCase().includes('driver'));
  const hasRoute = constraints && constraints.some(c => c.name.toLowerCase().includes('route'));
  const hasADA = constraints && constraints.some(c => c.name.toLowerCase().includes('ada'));
  const hasDelay = constraints && constraints.some(c => c.name.toLowerCase().includes('delay'));

  assert(
    is6Constraints && allVerified && hasOperational && hasCapacity && hasDriver && hasRoute && hasADA && hasDelay,
    '3. Which constraints checked: all 6 operational hard constraints explicitly audited'
  );
}

// ============================================================================
// TEST 4: Explanation Layer: What data was used?
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const exp = replanResult.explanationAndUncertainty;

  const dataUsed = exp && exp.dataUsed;
  const hasData = Array.isArray(dataUsed) && dataUsed.length >= 4;
  const hasGpsData = dataUsed && dataUsed.some(d => d.toLowerCase().includes('gps'));
  const hasRosterData = dataUsed && dataUsed.some(d => d.toLowerCase().includes('driver'));
  const hasManifestData = dataUsed && dataUsed.some(d => d.toLowerCase().includes('manifest') || d.toLowerCase().includes('passenger'));

  assert(hasData && hasGpsData && hasRosterData && hasManifestData, '4. What data was used: explicit data provenance and telematics sources');
}

// ============================================================================
// TEST 5: Explanation Layer: Is any data stale or unavailable? (Data Quality & Warning)
// ============================================================================
{
  // 5A: Live GPS
  const liveResult = replanningEngine.replan(urgentContext, mockFleetState);
  const liveQuality = liveResult.explanationAndUncertainty.dataQuality;
  const liveOk = liveQuality && liveQuality.gpsStatus === 'LIVE' && liveQuality.warning === null;

  // 5B: Stale GPS (simulate 5-minute-old telematics)
  const staleFleetState = {
    ...mockFleetState,
    buses: mockFleetState.buses.map(b => b.id === 'BUS-05' ? { ...b, gpsStatus: 'stale', gpsAgeSeconds: 300 } : b)
  };
  const staleResult = replanningEngine.replan(urgentContext, staleFleetState);
  const staleQuality = staleResult.explanationAndUncertainty.dataQuality;

  const staleOk = staleQuality &&
                  staleQuality.gpsStatus === 'STALE' &&
                  staleQuality.isStale === true &&
                  (staleQuality.warning === 'GPS data is 5 minutes old. Distance-based ranking may be less reliable.' ||
                   staleQuality.warning === 'GPS data is 5 minutes old. Distance-based ranking may be inaccurate.') &&
                  staleQuality.requiresDispatcherVerification === true;

  assert(liveOk && staleOk, '5. Data quality & stale GPS: warning triggered when telematics > 2m old with verification requirement');
}

// ============================================================================
// TEST 6: Explanation Layer: Expected impact & Dispatcher Overrides
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const exp = replanResult.explanationAndUncertainty;

  // Impact
  const impact = exp.expectedImpact;
  const hasImpact = impact && impact.additionalDistanceKm > 0 && impact.additionalDelayMinutes > 0 && Boolean(impact.passengerImpact);

  // Overrides
  const overrides = exp.dispatcherOverrides;
  const hasOverrides = Array.isArray(overrides) && overrides.length >= 3;
  const mentionsVehicleOverride = overrides && overrides.some(o => o.toLowerCase().includes('override vehicle'));
  const mentionsConstraintOverride = overrides && overrides.some(o => o.toLowerCase().includes('constraint'));

  // No unmathematical confidence score claims
  const noBogusConfidence = !('confidenceScore' in exp) && !('aiConfidencePercent' in exp);

  assert(
    hasImpact && hasOverrides && mentionsVehicleOverride && mentionsConstraintOverride && noBogusConfidence,
    '6. Expected impact & Dispatcher Overrides: quantified impact and explicit human authority levers'
  );
}

// ============================================================================
// TEST 7: Audit Logs: All 6 Event Types Persisted
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions[0];

  // 1. RECOMMENDATION_GENERATED
  const log1 = store.logRecommendationGenerated(testDisruption.id, testDisruption.aiRecommendation);
  assert(log1 && log1.action === 'RECOMMENDATION_GENERATED', '7A. Audit log: RECOMMENDATION_GENERATED');

  // 2. RECOMMENDATION_ACCEPTED
  const log2 = store.logRecommendationAccepted(testDisruption.id, testDisruption.aiRecommendation);
  assert(log2 && log2.action === 'RECOMMENDATION_ACCEPTED', '7B. Audit log: RECOMMENDATION_ACCEPTED');

  // 3. RECOMMENDATION_MODIFIED
  const log3 = store.logRecommendationModified(testDisruption.aiRecommendation, { maxAllowedDelay: 8 }, { recommendedBusId: 'BUS-02' });
  assert(log3 && log3.action === 'RECOMMENDATION_MODIFIED', '7C. Audit log: RECOMMENDATION_MODIFIED');

  // 4. RECOMMENDATION_REJECTED
  const log4 = store.logRecommendationRejected(testDisruption.id, 'Capacity reservation');
  assert(log4 && log4.action === 'RECOMMENDATION_REJECTED', '7D. Audit log: RECOMMENDATION_REJECTED');

  // 5. MANUAL_OVERRIDE
  const log5 = store.logManualOverride('MANUAL_ROUTE_DISPATCH', { routeId: 'RT-101', busId: 'BUS-05' });
  assert(log5 && log5.action === 'MANUAL_OVERRIDE', '7E. Audit log: MANUAL_OVERRIDE');

  // 6. FALLBACK_TRIGGERED
  const log6 = store.logFallbackTriggered('GPS_LOSS_DEAD_RECKONING', { busId: 'BUS-04' });
  assert(log6 && log6.action === 'FALLBACK_TRIGGERED', '7F. Audit log: FALLBACK_TRIGGERED');

  // Check state retention
  const allEvents = store.getAuditEvents();
  const actionsLogged = new Set(allEvents.map(e => e.action));
  const hasAll6 = ['RECOMMENDATION_GENERATED', 'RECOMMENDATION_ACCEPTED', 'RECOMMENDATION_MODIFIED', 'RECOMMENDATION_REJECTED', 'MANUAL_OVERRIDE', 'FALLBACK_TRIGGERED'].every(a => actionsLogged.has(a));

  assert(hasAll6, '7G. Audit log: all 6 required lifecycle events recorded in audit log');
}

// ============================================================================
// TEST 8: Explanation Consistency: Displayed Selected Bus Equals Applied Bus
// ============================================================================
{
  const store = new AppStore();
  const student = {
    name: 'Emma Watson',
    grade: '9th Grade',
    schoolId: 'SCH-01',
    schoolName: 'Oakridge High',
    stopName: 'Market & 5th St',
    pickupCoords: [37.784, -122.408],
    specialNeeds: 'None'
  };

  store.addStudent(student);
  const urgentDisruption = store.state.disruptions.find(d => d.type === 'urgent_add' && d.status === 'unresolved');
  const displayedBus = urgentDisruption?.aiRecommendation?.selectedBus || urgentDisruption?.aiRecommendation?.recommendedBusId;

  // Dispatcher reviews and accepts recommendation
  store.acceptAIPlan(urgentDisruption.id);

  const appliedStudent = store.state.students.find(s => s.id === urgentDisruption.studentId);
  const appliedBus = appliedStudent?.busId;

  assert(
    displayedBus && appliedBus && displayedBus === appliedBus,
    '8. Explanation consistency: displayed selected bus equals applied bus',
    `Expected ${displayedBus} to equal ${appliedBus}`
  );
}

// ============================================================================
// TEST 9: Explanation Consistency: Displayed Insertion Position Equals Applied Position
// ============================================================================
{
  const store = new AppStore();
  const student = {
    name: 'Liam Neeson',
    grade: '11th Grade',
    schoolId: 'SCH-01',
    schoolName: 'Oakridge High',
    stopName: 'Alamo Square Park',
    pickupCoords: [37.776, -122.434],
    specialNeeds: 'None'
  };

  store.addStudent(student);
  const urgentDisruption = store.state.disruptions.find(d => d.type === 'urgent_add' && d.status === 'unresolved');
  const displayedPos = urgentDisruption?.aiRecommendation?.insertionPosition ?? urgentDisruption?.aiRecommendation?.greedyInsertionPosition;

  // Dispatcher reviews and accepts
  store.acceptAIPlan(urgentDisruption.id);

  const appliedRoute = store.state.routes.find(r => r.id === urgentDisruption.aiRecommendation.recommendedRouteId);
  const insertedStopIndex = appliedRoute.stops.findIndex(s => s.id.includes(urgentDisruption.studentId));
  const auditEvent = store.state.auditEvents.find(e => e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === urgentDisruption.id);
  const auditAppliedPos = auditEvent?.selectedPlan?.appliedInsertionPosition;

  assert(
    displayedPos !== undefined && insertedStopIndex === displayedPos && auditAppliedPos === displayedPos,
    '9. Explanation consistency: displayed insertion position equals applied position',
    `Displayed: ${displayedPos}, Inserted: ${insertedStopIndex}, Audit: ${auditAppliedPos}`
  );
}

// ============================================================================
// TEST 10: Explanation Consistency: Rejection Reasons Match Actual Failed Constraints
// ============================================================================
{
  const replanResult = replanningEngine.replan(urgentContext, mockFleetState);
  const rejected = replanResult.explanationAndUncertainty.rejectedCandidates;

  // BUS-02 is full (54/54) -> Reason must be Insufficient capacity
  const bus02 = rejected.find(r => r.busId === 'BUS-02');
  const capMatches = bus02 && bus02.reason === 'Insufficient capacity';

  // BUS-03 has driver assigned with commitment conflict -> Reason must be Driver already assigned
  const bus03 = rejected.find(r => r.busId === 'BUS-03');
  const driverMatches = bus03 && bus03.reason === 'Driver already assigned';

  // BUS-07 is in maintenance -> Reason must be Vehicle unavailable
  const bus07 = rejected.find(r => r.busId === 'BUS-07');
  const unavailMatches = bus07 && bus07.reason === 'Vehicle unavailable';

  // Wheelchair requirement check
  const wheelchairContext = {
    ...urgentContext,
    studentStop: {
      ...urgentContext.studentStop,
      specialNeeds: 'Wheelchair Lift Required'
    },
    requiresWheelchair: true
  };
  const fleetWithNoAda = {
    ...mockFleetState,
    buses: [
      { id: 'BUS-08', capacity: 54, currentLoad: 20, status: 'in_transit', amenities: ['Air Conditioning'], routeId: 'RT-102', coords: [37.78, -122.41], gpsStatus: 'live' }
    ]
  };
  const adaResult = replanningEngine.replan(wheelchairContext, fleetWithNoAda);
  const adaRejected = adaResult.explanationAndUncertainty.rejectedCandidates;
  const adaMatches = adaRejected.some(r => r.busId === 'BUS-08' && r.reason.includes('ADA'));

  assert(
    capMatches && driverMatches && unavailMatches && adaMatches,
    '10. Explanation consistency: rejection reasons match actual failed constraints',
    `cap: ${capMatches}, driver: ${driverMatches}, unavail: ${unavailMatches}, ada: ${adaMatches}`
  );
}

// ============================================================================
// TEST 11: Explanation Consistency: GPS Warning Appears When GPS is Stale
// ============================================================================
{
  // 11A: Stale GPS flag
  const staleFleet = {
    ...mockFleetState,
    buses: mockFleetState.buses.map(b => b.id === 'BUS-05' ? { ...b, gpsStatus: 'stale', gpsAgeSeconds: 300 } : b)
  };
  const staleResult = replanningEngine.replan(urgentContext, staleFleet);
  const expStale = staleResult.explanationAndUncertainty;

  const warningPresent = Boolean(expStale.warning && expStale.warning.includes('Distance-based ranking may be less reliable.'));
  const textWarningPresent = expStale.formattedText.includes('WARNING:\n"GPS data is 5 minutes old. Distance-based ranking may be less reliable."');
  const requiresVerification = expStale.requiresDispatcherVerification === true;

  // 11B: Fresh GPS -> No warning
  const freshResult = replanningEngine.replan(urgentContext, mockFleetState);
  const noWarningOnFresh = freshResult.explanationAndUncertainty.warning === null;

  assert(
    warningPresent && textWarningPresent && requiresVerification && noWarningOnFresh,
    '11. Explanation consistency: GPS warning appears when GPS is stale',
    `warningPresent: ${warningPresent}, textWarningPresent: ${textWarningPresent}, noWarningOnFresh: ${noWarningOnFresh}`
  );
}

// ============================================================================
// TEST 12: Explanation Consistency: Audit Event Matches Dispatcher Action
// ============================================================================
{
  const store = new AppStore();
  const testDisruption = store.state.disruptions[0];

  // 1. Accept action
  store.acceptAIPlan(testDisruption.id);
  const acceptAudit = store.state.auditEvents.find(e => e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === testDisruption.id);
  const acceptValid = acceptAudit &&
                      acceptAudit.disruptionId === testDisruption.id &&
                      acceptAudit.userRole &&
                      acceptAudit.timestamp &&
                      acceptAudit.selectedPlan &&
                      acceptAudit.finalState;

  // 2. Reject action
  const rejectDisruption = store.state.disruptions[1] || store.state.disruptions[0];
  store.rejectAIPlan(rejectDisruption.id, 'Capacity reservation for senior route');
  const rejectAudit = store.state.auditEvents.find(e => e.action === 'RECOMMENDATION_REJECTED' && e.disruptionId === rejectDisruption.id);
  const rejectValid = rejectAudit &&
                      rejectAudit.rejectionReason === 'Capacity reservation for senior route' &&
                      rejectAudit.finalState !== undefined &&
                      rejectAudit.timestamp;

  // 3. Modify action
  store.logRecommendationModified(
    testDisruption.aiRecommendation,
    { maxAllowedDelay: 10, minRequiredSeats: 5 },
    { recommendedBusId: 'BUS-05', score: 12.4 },
    'Dispatcher'
  );
  const modifyAudit = store.state.auditEvents.find(e => e.action === 'RECOMMENDATION_MODIFIED');
  const modifyValid = modifyAudit &&
                      modifyAudit.modifiedConstraints.maxAllowedDelay === 10 &&
                      modifyAudit.selectedPlan.recommendedBusId === 'BUS-05';

  // 4. Manual override action
  store.logManualOverride('MANUAL_ROUTE_REROUTE', { busId: 'BUS-01', newStopsCount: 6 });
  const overrideAudit = store.state.auditEvents.find(e => e.action === 'MANUAL_OVERRIDE');
  const overrideValid = overrideAudit && overrideAudit.details.overrideType === 'MANUAL_ROUTE_REROUTE';

  // 5. Fallback triggered action
  store.logFallbackTriggered('NO_FEASIBLE_CANDIDATE_ESCALATION', { disruptionId: 'DIS-2026-009' });
  const fallbackAudit = store.state.auditEvents.find(e => e.action === 'FALLBACK_TRIGGERED');
  const fallbackValid = fallbackAudit && fallbackAudit.details.fallbackType === 'NO_FEASIBLE_CANDIDATE_ESCALATION';

  // 6. Complete reconstruction data check
  const allEventsHaveReconstruction = [acceptAudit, rejectAudit, modifyAudit, overrideAudit, fallbackAudit].every(
    e => e.action && e.timestamp && e.userRole && (e.details || e.selectedPlan || e.finalState)
  );

  assert(
    acceptValid && rejectValid && modifyValid && overrideValid && fallbackValid && allEventsHaveReconstruction,
    '12. Explanation consistency: audit event matches dispatcher action with complete decision reconstruction data'
  );
}

console.log('------------------------------------------------------------------------');
console.log(`Explanation & Audit Tests: ${passed}/${passed + failed} Passed (${Math.round((passed / (passed + failed)) * 100)}%).`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
}
