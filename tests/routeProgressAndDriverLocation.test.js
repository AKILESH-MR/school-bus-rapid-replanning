/**
 * Unit Tests for Current Route Progress & Driver Location Inputs
 */
import {
  replanningEngine,
  constraintValidator,
  routeInsertion,
  computeRouteProgress,
  getDistanceMiles,
  getDistanceKm
} from '../src/utils/replanningEngine.js';

console.log('========================================================================');
console.log('  ROUTE PROGRESS & DRIVER LOCATION: UNIT TEST SUITE');
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

// Reusable Route with mixed completed, current, next, and pending stops
const sampleRoute = {
  id: 'RT-TEST-01',
  schoolId: 'SCH-01',
  schoolName: 'Oakridge High School',
  assignedBus: 'BUS-01',
  assignedDriver: 'Sarah Jenkins',
  totalStops: 6,
  stops: [
    { id: 'ST-01', name: 'Stop 1 (Marina)', coords: [37.8040, -122.4410], status: 'completed' },
    { id: 'ST-02', name: 'Stop 2 (Chestnut)', coords: [37.8000, -122.4340], status: 'completed' },
    { id: 'ST-03', name: 'Stop 3 (Pacific Heights)', coords: [37.7930, -122.4310], status: 'completed' },
    { id: 'ST-04', name: 'Stop 4 (Japantown)', coords: [37.7860, -122.4300], status: 'next' },
    { id: 'ST-05', name: 'Stop 5 (Alamo Square)', coords: [37.7770, -122.4320], status: 'pending' },
    { id: 'ST-06', name: 'Stop 6 (School Dropoff)', coords: [37.7749, -122.4194], status: 'destination' }
  ]
};

const sampleBus = {
  id: 'BUS-01',
  capacity: 54,
  currentLoad: 42,
  coords: [37.7880, -122.4310], // Near Stop 4
  status: 'in_transit',
  driverId: 'DRV-101',
  routeId: 'RT-TEST-01',
  amenities: ['Wheelchair Lift', 'GPS Telematics']
};

// ============================================================================
// TEST 1: Completed Stops
// ============================================================================
{
  const progress = computeRouteProgress(sampleRoute, sampleBus);
  const isOk = Array.isArray(progress.completedStops) &&
               progress.completedStops.length === 3 &&
               progress.completedStops.every(s => s.status === 'completed') &&
               progress.completedStops.every(s => !progress.remainingStops.some(r => r.id === s.id));

  assert(isOk, '1. Completed stops', `Completed stops: ${JSON.stringify(progress.completedStops.map(s => s.id))}`);
}

// ============================================================================
// TEST 2: Current Stop
// ============================================================================
{
  const progress = computeRouteProgress(sampleRoute, sampleBus);
  const isOk = progress.currentStop !== null &&
               progress.currentStop.id === 'ST-04' &&
               progress.currentStop.name === 'Stop 4 (Japantown)' &&
               progress.currentStop.status === 'next';

  assert(isOk, '2. Current stop', `Current stop: ${JSON.stringify(progress.currentStop)}`);
}

// ============================================================================
// TEST 3: Remaining Stops
// ============================================================================
{
  const progress = computeRouteProgress(sampleRoute, sampleBus);
  const isOk = Array.isArray(progress.remainingStops) &&
               progress.remainingStops.length === 3 &&
               progress.remainingStops[0].id === 'ST-04' &&
               progress.remainingStops[1].id === 'ST-05' &&
               progress.remainingStops[2].id === 'ST-06' &&
               progress.nextStop !== null &&
               progress.nextStop.id === 'ST-05' &&
               progress.routeProgressPercentage === 50; // 3/6 = 50%

  assert(isOk, '3. Remaining stops', `Remaining: ${progress.remainingStops.length}, Next: ${progress.nextStop?.id}, Progress: ${progress.routeProgressPercentage}%`);
}

// ============================================================================
// TEST 4: Urgent Insertion into Remaining Route Only
// ============================================================================
{
  const studentStop = {
    name: 'New Student Pickup (Hayes Valley)',
    coords: [37.7760, -122.4240],
    specialNeeds: 'None'
  };

  const insertion = routeInsertion.evaluateUrgentStudentInsertion(sampleBus, sampleRoute, studentStop);

  // Best position must be strictly >= completedStops.length (i.e., >= 3)
  const isPositionValid = insertion.bestPosition >= 3;
  const isCompletedPreserved = insertion.newStops[0].id === 'ST-01' &&
                               insertion.newStops[1].id === 'ST-02' &&
                               insertion.newStops[2].id === 'ST-03';
  const isDelayCalculated = insertion.additionalDelay > 0;

  // Run full replan to verify explanation layer output
  const testState = {
    buses: [sampleBus],
    routes: [sampleRoute],
    drivers: [
      {
        id: 'DRV-101',
        driverId: 'DRV-101',
        name: 'Sarah Jenkins',
        currentLocation: [37.7880, -122.4310],
        availabilityStatus: 'active',
        status: 'active',
        locationSource: 'mobile_gps',
        lastUpdated: new Date().toISOString()
      }
    ]
  };

  const replanResult = replanningEngine.replan({
    type: 'urgent_add',
    destinationSchoolId: 'SCH-01',
    studentStop,
    requiredSeats: 1
  }, testState);

  const hasRemainingReason = replanResult.reasons.some(r => r.includes('Only remaining route stops were considered'));
  const hasDelayReason = replanResult.reasons.some(r => r.includes('Additional delay'));
  const hasDriverReason = replanResult.reasons.some(r => r.includes('Driver is available'));

  const isOk = isPositionValid && isCompletedPreserved && isDelayCalculated && hasRemainingReason && hasDelayReason && hasDriverReason;

  assert(isOk, '4. Urgent insertion into remaining route', `Position: ${insertion.bestPosition}, Reasons: ${JSON.stringify(replanResult.reasons)}`);
}

// ============================================================================
// TEST 5: Driver Unavailable
// ============================================================================
{
  const sickDriver = {
    id: 'DRV-SICK',
    driverId: 'DRV-SICK',
    name: 'Sick Driver',
    availabilityStatus: 'sick',
    status: 'sick',
    currentLocation: [37.7550, -122.4050]
  };

  const unavailableDriver = {
    id: 'DRV-UNAVAIL',
    driverId: 'DRV-UNAVAIL',
    name: 'Unavailable Driver',
    availabilityStatus: 'unavailable',
    status: 'unavailable',
    currentLocation: [37.7550, -122.4050]
  };

  const sickCheck = constraintValidator.validateDriverAvailability(sickDriver, sampleBus, sampleRoute);
  const unavailCheck = constraintValidator.validateDriverAvailability(unavailableDriver, sampleBus, sampleRoute);

  const isOk = sickCheck.isValid === false &&
               sickCheck.reason.includes('unavailable') &&
               unavailCheck.isValid === false &&
               unavailCheck.reason.includes('unavailable');

  assert(isOk, '5. Driver unavailable', `Sick check: ${JSON.stringify(sickCheck)}, Unavail check: ${JSON.stringify(unavailCheck)}`);
}

// ============================================================================
// TEST 6: Driver Far Away
// ============================================================================
{
  // Target location is Central Depot in San Francisco [37.7550, -122.4050]
  const depotCoords = [37.7550, -122.4050];

  // Driver located in San Jose (~45 miles away)
  const farDriver = {
    id: 'DRV-FAR',
    driverId: 'DRV-FAR',
    name: 'Faraway Driver',
    availabilityStatus: 'standby',
    status: 'standby',
    currentLocation: [37.3382, -121.8863], // San Jose
    locationSource: 'mobile_gps',
    lastUpdated: new Date().toISOString()
  };

  // Nearby driver at depot (~0.1 miles away)
  const closeDriver = {
    id: 'DRV-CLOSE',
    driverId: 'DRV-CLOSE',
    name: 'Close Driver',
    availabilityStatus: 'standby',
    status: 'standby',
    currentLocation: [37.7560, -122.4060],
    locationSource: 'depot_checkin',
    lastUpdated: new Date().toISOString()
  };

  const farCheck = constraintValidator.validateDriverLocation(farDriver, depotCoords, 15.0);
  const closeCheck = constraintValidator.validateDriverLocation(closeDriver, depotCoords, 15.0);

  const isOk = farCheck.isValid === false &&
               farCheck.reason.includes('Driver too far away') &&
               farCheck.distanceMi > 15.0 &&
               closeCheck.isValid === true &&
               closeCheck.distanceMi < 1.0;

  assert(isOk, '6. Driver far away', `Far distance: ${farCheck.distanceMi} mi (${farCheck.reason}), Close: ${closeCheck.distanceMi} mi`);
}

// ============================================================================
// TEST 7: Driver Location Stale
// ============================================================================
{
  const depotCoords = [37.7550, -122.4050];

  // Driver with last-known stale location
  const staleDriver = {
    id: 'DRV-STALE',
    driverId: 'DRV-STALE',
    name: 'Stale Telematics Driver',
    availabilityStatus: 'standby',
    status: 'standby',
    lastKnownLocation: [37.7550, -122.4050],
    currentLocation: null, // Live location unavailable
    locationSource: 'last_known',
    isLocationStale: true,
    lastUpdated: '2026-09-28T16:00:00Z'
  };

  const staleCheck = constraintValidator.validateDriverLocation(staleDriver, depotCoords, 15.0);

  // Standby bus assigned to stale driver evaluated in replanning engine
  const staleBus = {
    id: 'BUS-STALE',
    capacity: 54,
    currentLoad: 0,
    status: 'in_depot',
    driverId: 'DRV-STALE',
    amenities: ['Wheelchair Lift']
  };

  const testState = {
    buses: [staleBus],
    routes: [],
    drivers: [staleDriver]
  };

  const replanResult = replanningEngine.replan({
    type: 'breakdown',
    disruptionBusId: 'BUS-BROKEN',
    brokenBus: { id: 'BUS-BROKEN', coords: [37.7680, -122.4550] },
    requiredSeats: 20
  }, testState);

  const isStaleFlagged = staleCheck.isValid === true &&
                         staleCheck.isStale === true &&
                         staleCheck.requiresDispatcherConfirmation === true;

  const hasStaleReason = replanResult.reasons.some(r => r.toLowerCase().includes('stale') || r.toLowerCase().includes('dispatcher confirmation'));

  const isOk = isStaleFlagged && hasStaleReason && replanResult.requiresDispatcherConfirmation === true;

  assert(isOk, '7. Driver location stale', `Stale check: ${JSON.stringify(staleCheck)}, Reasons: ${JSON.stringify(replanResult.reasons)}`);
}

console.log('------------------------------------------------------------------------');
console.log(`Route Progress & Driver Location Tests: ${passedTests}/${totalTests} Passed (${((passedTests / totalTests) * 100).toFixed(0)}%).`);
console.log('========================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
