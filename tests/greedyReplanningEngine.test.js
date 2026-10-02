/**
 * Unit Tests for Greedy Insertion Replanning Heuristic Engine
 */
import {
  replanningEngine,
  constraintValidator,
  candidateGenerator,
  candidateScorer,
  routeInsertion
} from '../src/utils/replanningEngine.js';

console.log('========================================================================');
console.log('  GREEDY INSERTION REPLANNING ENGINE: UNIT TEST SUITE');
console.log('========================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}: ${message}`);
  }
}

// Standard Mock Data for Isolated Engine Testing
const mockState = {
  buses: [
    {
      id: 'BUS-01',
      model: 'Blue Bird All American',
      capacity: 54,
      currentLoad: 50,
      driverId: 'DRV-101',
      routeId: 'RT-101',
      status: 'in_transit',
      amenities: ['Wheelchair Lift', 'GPS Telematics']
    },
    {
      id: 'BUS-02',
      model: 'Thomas Built C2',
      capacity: 48,
      currentLoad: 48, // Fully loaded for capacity test
      driverId: 'DRV-102',
      routeId: 'RT-102',
      status: 'in_transit',
      amenities: ['GPS Telematics']
    },
    {
      id: 'BUS-03',
      model: 'Lion Electric LionC',
      capacity: 54,
      currentLoad: 10,
      driverId: 'DRV-103',
      routeId: 'RT-103',
      status: 'breakdown', // Disabled for operational status test
      amenities: ['Wheelchair Lift']
    },
    {
      id: 'BUS-05',
      model: 'Thomas Standby',
      capacity: 54,
      currentLoad: 0,
      driverId: 'DRV-105',
      routeId: null,
      status: 'in_depot',
      amenities: ['Wheelchair Lift']
    }
  ],
  routes: [
    {
      id: 'RT-101',
      schoolId: 'SCH-01',
      assignedBus: 'BUS-01',
      assignedDriver: 'Sarah Jenkins',
      stops: [
        { id: 'ST-1', name: 'Stop 1', status: 'completed', coords: [37.77, -122.42] },
        { id: 'ST-2', name: 'Stop 2', status: 'next', coords: [37.78, -122.41] },
        { id: 'ST-3', name: 'Oakridge High School', status: 'pending', coords: [37.79, -122.40] }
      ]
    },
    {
      id: 'RT-102',
      schoolId: 'SCH-02',
      assignedBus: 'BUS-02',
      assignedDriver: 'Michael Torres',
      stops: [
        { id: 'ST-201', name: 'Stop A', status: 'next', coords: [37.76, -122.44] }
      ]
    }
  ],
  drivers: [
    { id: 'DRV-101', name: 'Sarah Jenkins', status: 'active' },
    { id: 'DRV-102', name: 'Michael Torres', status: 'sick' }, // Sick driver for unavailability test
    { id: 'DRV-103', name: 'David Chen', status: 'active' },
    { id: 'DRV-105', name: 'Amina Al-Mansoor', status: 'standby' }
  ]
};

// ============================================================================
// TEST 1: Student Cancellation
// ============================================================================
{
  const result = replanningEngine.replan({
    type: 'student_cancel',
    studentId: 'STU-1001',
    stopName: 'Stop 2',
    busId: 'BUS-01',
    routeId: 'RT-101'
  }, mockState);

  const isOk = result.selectedBus !== null &&
               result.additionalDelay < 0 && // Delay saved / negative added delay
               result.score !== null;

  assert(isOk, '1. Student Cancellation', `Unexpected cancellation result: ${JSON.stringify(result)}`);
}

// ============================================================================
// TEST 2: Urgent Student Addition & Greedy Route Insertion
// ============================================================================
{
  const result = replanningEngine.replan({
    type: 'urgent_add',
    destinationSchoolId: 'SCH-01',
    studentStop: {
      name: 'New Urgent Pickup Stop',
      coords: [37.775, -122.415],
      specialNeeds: 'None'
    },
    requiredSeats: 1
  }, mockState);

  const isOk = result.selectedBus === 'BUS-01' &&
               result.insertionPosition >= 1 && // Inserted after completed stop
               result.newRoute !== null &&
               result.newRoute.stops.length === 4 &&
               result.scoreBreakdown !== null;

  assert(isOk, '2. Urgent Student Addition & Greedy Route Insertion', `Result: ${JSON.stringify(result)}`);
}

// ============================================================================
// TEST 3: Vehicle Breakdown Replanning
// ============================================================================
{
  const brokenBus = mockState.buses.find(b => b.id === 'BUS-01');
  const affectedRoute = mockState.routes.find(r => r.id === 'RT-101');

  const result = replanningEngine.replan({
    type: 'breakdown',
    disruptionBusId: 'BUS-01',
    brokenBus,
    affectedRoute,
    requiredSeats: 36
  }, mockState);

  const isOk = result.selectedBus === 'BUS-05' && // Selected depot standby
               result.rejectedCandidates.some(rc => rc.busId === 'BUS-01') && // Disabled bus rejected
               result.additionalDelay > 0;

  assert(isOk, '3. Vehicle Breakdown Replanning', `Selected: ${result.selectedBus}, rejected: ${JSON.stringify(result.rejectedCandidates)}`);
}

// ============================================================================
// TEST 4: Capacity Violation Prevention
// ============================================================================
{
  const capCheck = constraintValidator.validateCapacity(mockState.buses.find(b => b.id === 'BUS-02'), 1);
  const isOk = capCheck.isValid === false && capCheck.reason.includes('Insufficient capacity');

  assert(isOk, '4. Capacity Violation Prevention', `Capacity check result: ${JSON.stringify(capCheck)}`);
}

// ============================================================================
// TEST 5: Driver Unavailable / Sickness
// ============================================================================
{
  const sickDriver = mockState.drivers.find(d => d.id === 'DRV-102');
  const drvCheck = constraintValidator.validateDriverAvailability(sickDriver, mockState.buses[1], mockState.routes[1]);
  const isOk = drvCheck.isValid === false && drvCheck.reason.includes('unavailable');

  assert(isOk, '5. Driver Unavailable / Sickness Prevention', `Driver check result: ${JSON.stringify(drvCheck)}`);
}

// ============================================================================
// TEST 6: ADA / Accessibility Requirement Enforcement
// ============================================================================
{
  const busWithoutLift = mockState.buses.find(b => b.id === 'BUS-02');
  const adaCheck = constraintValidator.validateAccessibility(busWithoutLift, true);
  const isOk = adaCheck.isValid === false && adaCheck.reason.includes('ADA Wheelchair Lift');

  assert(isOk, '6. ADA / Accessibility Requirement Enforcement', `ADA check result: ${JSON.stringify(adaCheck)}`);
}

// ============================================================================
// TEST 7: No Feasible Solution Fallback
// ============================================================================
{
  // State where all candidate buses fail
  const constrainedState = {
    buses: [
      { id: 'BUS-01', status: 'breakdown', capacity: 54, currentLoad: 0 },
      { id: 'BUS-02', status: 'in_transit', capacity: 48, currentLoad: 48 }
    ],
    routes: [],
    drivers: []
  };

  const result = replanningEngine.replan({
    type: 'urgent_add',
    requiredSeats: 5,
    destinationSchoolId: 'SCH-99'
  }, constrainedState);

  const isOk = result.noFeasibleSolution === true &&
               result.selectedBus === null &&
               result.escalateToManual === true &&
               result.rejectedCandidates.length === 2;

  assert(isOk, '7. No Feasible Solution Fallback', `Result: ${JSON.stringify(result)}`);
}

console.log('------------------------------------------------------------------------');
console.log(`Greedy Engine Tests Summary: ${passedTests}/${totalTests} Passed (${((passedTests / totalTests) * 100).toFixed(0)}%).`);
console.log('------------------------------------------------------------------------\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
