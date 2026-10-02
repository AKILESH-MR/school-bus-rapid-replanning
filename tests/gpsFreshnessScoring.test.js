/**
 * Unit & Integration Tests: GPS Freshness & Distance-Based Candidate Scoring
 * 
 * Verifies that GPS telemetry freshness deterministically influences candidate scoring
 * without overriding operational hard constraints.
 */
import assert from 'assert';
import { candidateScorer, replanningEngine } from '../src/utils/replanningEngine.js';

console.log('========================================================================');
console.log('  GPS FRESHNESS & DISTANCE-BASED CANDIDATE SCORING: TEST SUITE');
console.log('========================================================================\n');

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
  }
}

// Baseline parameters for isolated scoring comparison
const baseParams = {
  additionalDistance: 2.5,
  additionalDelay: 4.0,
  currentLoad: 40,
  capacity: 54,
  requiredSeats: 1,
  existingPassengers: 40,
  driverDistanceMi: 1.0
};

// ============================================================================
// TEST 1: LIVE GPS Score
// ============================================================================
runTest('1. LIVE GPS: standard distance-based scoring with zero penalty', () => {
  const result = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'LIVE',
    gpsAgeSeconds: 15
  });

  assert.strictEqual(result.breakdown.gpsStatus, 'LIVE');
  assert.strictEqual(result.breakdown.gpsTrustLevel, 'HIGH');
  assert.strictEqual(result.breakdown.gpsConfidenceMultiplier, 1.0);
  assert.strictEqual(result.breakdown.gpsDistanceAdjustment, 0.0);
  assert.strictEqual(result.breakdown.reducedTrustInDistance, false);
  assert.strictEqual(result.breakdown.requiresDispatcherVerification, false);
  assert.ok(result.totalScore > 0, 'Total score must be calculated');
});

// ============================================================================
// TEST 2: LAST_KNOWN GPS Score
// ============================================================================
runTest('2. LAST_KNOWN GPS: reduced confidence with documented 25% uncertainty penalty', () => {
  const liveResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'LIVE',
    gpsAgeSeconds: 15
  });

  const lastKnownResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'LAST_KNOWN',
    gpsAgeSeconds: 85
  });

  assert.strictEqual(lastKnownResult.breakdown.gpsStatus, 'LAST_KNOWN');
  assert.strictEqual(lastKnownResult.breakdown.gpsTrustLevel, 'MEDIUM');
  assert.strictEqual(lastKnownResult.breakdown.gpsConfidenceMultiplier, 0.75);
  assert.strictEqual(lastKnownResult.breakdown.reducedTrustInDistance, true);
  assert.strictEqual(lastKnownResult.breakdown.requiresDispatcherVerification, true);
  assert.ok(lastKnownResult.breakdown.gpsDistanceAdjustment > 0, 'Adjustment must be positive');
  assert.ok(
    lastKnownResult.totalScore > liveResult.totalScore,
    `LAST_KNOWN score (${lastKnownResult.totalScore}) must exceed LIVE score (${liveResult.totalScore})`
  );
});

// ============================================================================
// TEST 3: STALE GPS Score
// ============================================================================
runTest('3. STALE GPS: stronger 60% uncertainty penalty and verification required', () => {
  const lastKnownResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'LAST_KNOWN',
    gpsAgeSeconds: 85
  });

  const staleResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'STALE',
    gpsAgeSeconds: 300
  });

  assert.strictEqual(staleResult.breakdown.gpsStatus, 'STALE');
  assert.strictEqual(staleResult.breakdown.gpsTrustLevel, 'LOW');
  assert.strictEqual(staleResult.breakdown.gpsConfidenceMultiplier, 0.40);
  assert.strictEqual(staleResult.breakdown.requiresDispatcherVerification, true);
  assert.ok(
    staleResult.breakdown.gpsDistanceAdjustment > lastKnownResult.breakdown.gpsDistanceAdjustment,
    'STALE penalty must exceed LAST_KNOWN penalty'
  );
  assert.ok(
    staleResult.totalScore > lastKnownResult.totalScore,
    `STALE score (${staleResult.totalScore}) must exceed LAST_KNOWN score (${lastKnownResult.totalScore})`
  );
});

// ============================================================================
// TEST 4: NO_SIGNAL GPS Score
// ============================================================================
runTest('4. NO_SIGNAL: conservative handling without inventing coordinates', () => {
  const staleResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'STALE',
    gpsAgeSeconds: 300
  });

  const noSignalResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'NO_SIGNAL',
    gpsAgeSeconds: 900
  });

  assert.strictEqual(noSignalResult.breakdown.gpsStatus, 'NO_SIGNAL');
  assert.strictEqual(noSignalResult.breakdown.gpsTrustLevel, 'NONE');
  assert.strictEqual(noSignalResult.breakdown.gpsConfidenceMultiplier, 0.10);
  assert.strictEqual(noSignalResult.breakdown.reducedTrustInDistance, true);
  assert.strictEqual(noSignalResult.breakdown.requiresDispatcherVerification, true);
  assert.ok(
    noSignalResult.totalScore > staleResult.totalScore,
    `NO_SIGNAL score (${noSignalResult.totalScore}) must exceed STALE score (${staleResult.totalScore})`
  );
});

// ============================================================================
// TEST 5: MANUAL GPS Score
// ============================================================================
runTest('5. MANUAL GPS: explicit manual source with checkpoint confidence', () => {
  const liveResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'LIVE',
    gpsAgeSeconds: 15
  });

  const manualResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'MANUAL',
    gpsAgeSeconds: 45
  });

  const staleResult = candidateScorer.calculateScore({
    ...baseParams,
    gpsStatus: 'STALE',
    gpsAgeSeconds: 300
  });

  assert.strictEqual(manualResult.breakdown.gpsStatus, 'MANUAL');
  assert.strictEqual(manualResult.breakdown.gpsTrustLevel, 'MANUAL_VERIFIED');
  assert.strictEqual(manualResult.breakdown.gpsConfidenceMultiplier, 0.85);
  // Manual has small checkpoint buffer, so score > live but far better than stale
  assert.ok(
    manualResult.totalScore > liveResult.totalScore,
    'MANUAL score should be slightly above LIVE due to checkpoint buffer'
  );
  assert.ok(
    manualResult.totalScore < staleResult.totalScore,
    'MANUAL score must be strictly better than STALE score'
  );
});

// ============================================================================
// TEST 6: Monotonic Penalty Ordering Across All 5 Telemetry States
// ============================================================================
runTest('6. Penalty ordering: LIVE (0.0) < MANUAL < LAST_KNOWN < STALE < NO_SIGNAL', () => {
  const live = candidateScorer.calculateScore({ ...baseParams, gpsStatus: 'LIVE' });
  const manual = candidateScorer.calculateScore({ ...baseParams, gpsStatus: 'MANUAL' });
  const lastKnown = candidateScorer.calculateScore({ ...baseParams, gpsStatus: 'LAST_KNOWN' });
  const stale = candidateScorer.calculateScore({ ...baseParams, gpsStatus: 'STALE' });
  const noSignal = candidateScorer.calculateScore({ ...baseParams, gpsStatus: 'NO_SIGNAL' });

  const pLive = live.breakdown.gpsDistanceAdjustment;
  const pManual = manual.breakdown.gpsDistanceAdjustment;
  const pLastKnown = lastKnown.breakdown.gpsDistanceAdjustment;
  const pStale = stale.breakdown.gpsDistanceAdjustment;
  const pNoSignal = noSignal.breakdown.gpsDistanceAdjustment;

  assert.strictEqual(pLive, 0.0);
  assert.ok(pLive < pManual, `LIVE (${pLive}) < MANUAL (${pManual})`);
  assert.ok(pManual < pLastKnown, `MANUAL (${pManual}) < LAST_KNOWN (${pLastKnown})`);
  assert.ok(pLastKnown < pStale, `LAST_KNOWN (${pLastKnown}) < STALE (${pStale})`);
  assert.ok(pStale < pNoSignal, `STALE (${pStale}) < NO_SIGNAL (${pNoSignal})`);
});

// ============================================================================
// TEST 7: Stale GPS Requiring Dispatcher Verification in Replan
// ============================================================================
runTest('7. Stale GPS recommendation flags dispatcher verification and emits warning', () => {
  const testFleet = {
    buses: [
      {
        id: 'BUS-STALE',
        model: 'Blue Bird All American',
        capacity: 54,
        currentLoad: 20,
        status: 'in_transit',
        driverId: 'DRV-1',
        routeId: 'RT-1',
        coords: [37.77, -122.42],
        gpsStatus: 'stale',
        ageSeconds: 300,
        amenities: ['GPS Telematics']
      }
    ],
    routes: [
      {
        id: 'RT-1',
        name: 'Route 1',
        assignedBus: 'BUS-STALE',
        schoolId: 'SCH-01',
        stops: [
          { id: 'ST-1', name: 'Stop 1', coords: [37.77, -122.42], status: 'pending' },
          { id: 'ST-2', name: 'Stop 2', coords: [37.78, -122.41], status: 'pending' }
        ]
      }
    ],
    drivers: [
      {
        id: 'DRV-1',
        name: 'Active Driver',
        status: 'active',
        availabilityStatus: 'available',
        currentLocation: [37.77, -122.42]
      }
    ]
  };

  const result = replanningEngine.replan({
    type: 'urgent_add',
    destinationSchoolId: 'SCH-01',
    requiredSeats: 1,
    studentStop: { name: 'Urgent Stop', coords: [37.775, -122.415] }
  }, testFleet);

  assert.strictEqual(result.selectedBus, 'BUS-STALE');
  assert.strictEqual(result.explanationAndUncertainty.dataQuality.gpsStatus, 'STALE');
  assert.strictEqual(result.explanationAndUncertainty.dataQuality.requiresDispatcherVerification, true);
  assert.ok(
    result.explanationAndUncertainty.dataQuality.warning.includes('minutes old'),
    'Must contain age warning'
  );
  assert.ok(
    result.scoreBreakdown.gpsDistanceAdjustment > 0,
    'Score breakdown must record positive GPS uncertainty adjustment'
  );
});

// ============================================================================
// TEST 8: GPS Trust Changing Candidate Ranking
// ============================================================================
runTest('8. GPS trust penalty changes candidate ranking (Live Bus beats Stale Bus)', () => {
  // Scenario:
  // BUS-A: LIVE GPS, but slightly farther away (distance 3.0 mi)
  // BUS-B: STALE GPS, appears closer on stale data (distance 1.5 mi)
  // With distance penalty, BUS-A (reliable live fix) must outrank BUS-B!
  const competingFleet = {
    buses: [
      {
        id: 'BUS-A-LIVE',
        model: 'Thomas Built C2',
        capacity: 54,
        currentLoad: 20,
        status: 'in_transit',
        driverId: 'DRV-A',
        routeId: 'RT-A',
        coords: [37.780, -122.415], // Slightly farther away (0.65 mi detour)
        gpsStatus: 'live',
        ageSeconds: 12,
        amenities: ['GPS Telematics']
      },
      {
        id: 'BUS-B-STALE',
        model: 'Lion Electric LionC',
        capacity: 54,
        currentLoad: 20,
        status: 'in_transit',
        driverId: 'DRV-B',
        routeId: 'RT-B',
        coords: [37.774, -122.414], // Appears closer on stale coordinates (0.06 mi detour)
        gpsStatus: 'stale',
        ageSeconds: 360,
        amenities: ['GPS Telematics']
      }
    ],
    routes: [
      {
        id: 'RT-A',
        schoolId: 'SCH-01',
        stops: [
          { id: 'SA-1', name: 'Stop A1', coords: [37.780, -122.415], status: 'pending' },
          { id: 'SA-2', name: 'Stop A2', coords: [37.785, -122.410], status: 'pending' }
        ]
      },
      {
        id: 'RT-B',
        schoolId: 'SCH-01',
        stops: [
          { id: 'SB-1', name: 'Stop B1', coords: [37.774, -122.414], status: 'pending' },
          { id: 'SB-2', name: 'Stop B2', coords: [37.778, -122.412], status: 'pending' }
        ]
      }
    ],
    drivers: [
      { id: 'DRV-A', name: 'Driver A', status: 'active', availabilityStatus: 'available', currentLocation: [37.780, -122.415] },
      { id: 'DRV-B', name: 'Driver B', status: 'active', availabilityStatus: 'available', currentLocation: [37.774, -122.414] }
    ]
  };

  const result = replanningEngine.replan({
    type: 'urgent_add',
    destinationSchoolId: 'SCH-01',
    requiredSeats: 1,
    studentStop: { name: 'Target Pickup', coords: [37.775, -122.415] }
  }, competingFleet);

  assert.strictEqual(
    result.selectedBus,
    'BUS-A-LIVE',
    `Expected BUS-A-LIVE to win due to stale GPS penalty on BUS-B-STALE, got ${result.selectedBus}`
  );

  const busACand = result.feasibleCandidates.find(c => c.bus.id === 'BUS-A-LIVE');
  const busBCand = result.feasibleCandidates.find(c => c.bus.id === 'BUS-B-STALE');

  assert.ok(busACand.score < busBCand.score, 'BUS-A score must be lower (better) than BUS-B score');
  assert.strictEqual(busACand.scoreBreakdown.gpsDistanceAdjustment, 0.0);
  assert.ok(busBCand.scoreBreakdown.gpsDistanceAdjustment > 4.0, 'BUS-B must receive >4.0 GPS uncertainty penalty');
});

// ============================================================================
// TEST 9: Hard Constraints Always Take Priority Over GPS Trust
// ============================================================================
runTest('9. Hard constraints take absolute priority over GPS trust (Full Bus Rejected)', () => {
  // Scenario:
  // BUS-FULL: LIVE GPS, 0.2 miles away, BUT 54/54 load (Capacity violation!)
  // BUS-FEASIBLE: STALE GPS, 3.0 miles away, BUT has 15 available seats.
  // BUS-FULL must be REJECTED by hard constraints. BUS-FEASIBLE must be selected!
  const priorityFleet = {
    buses: [
      {
        id: 'BUS-FULL',
        model: 'Thomas Built C2',
        capacity: 54,
        currentLoad: 54, // 0 seats available!
        status: 'in_transit',
        driverId: 'DRV-1',
        routeId: 'RT-1',
        coords: [37.775, -122.415], // Perfect location
        gpsStatus: 'live',
        ageSeconds: 5,
        amenities: ['GPS Telematics']
      },
      {
        id: 'BUS-FEASIBLE',
        model: 'Blue Bird All American',
        capacity: 54,
        currentLoad: 30, // 24 seats available
        status: 'in_transit',
        driverId: 'DRV-2',
        routeId: 'RT-2',
        coords: [37.760, -122.430], // Farther & stale
        gpsStatus: 'stale',
        ageSeconds: 240,
        amenities: ['GPS Telematics']
      }
    ],
    routes: [
      {
        id: 'RT-1',
        schoolId: 'SCH-01',
        stops: [{ id: 'S1', name: 'Stop 1', coords: [37.775, -122.415], status: 'pending' }]
      },
      {
        id: 'RT-2',
        schoolId: 'SCH-01',
        stops: [{ id: 'S2', name: 'Stop 2', coords: [37.760, -122.430], status: 'pending' }]
      }
    ],
    drivers: [
      { id: 'DRV-1', name: 'Driver 1', status: 'active', availabilityStatus: 'available', currentLocation: [37.775, -122.415] },
      { id: 'DRV-2', name: 'Driver 2', status: 'active', availabilityStatus: 'available', currentLocation: [37.760, -122.430] }
    ]
  };

  const result = replanningEngine.replan({
    type: 'urgent_add',
    destinationSchoolId: 'SCH-01',
    requiredSeats: 1,
    studentStop: { name: 'Target Pickup', coords: [37.775, -122.415] }
  }, priorityFleet);

  assert.strictEqual(
    result.selectedBus,
    'BUS-FEASIBLE',
    'Feasible bus with STALE GPS must be chosen over infeasible bus with LIVE GPS'
  );

  const fullRejection = result.rejectedCandidates.find(r => r.busId === 'BUS-FULL');
  assert.ok(fullRejection, 'BUS-FULL must be in rejected candidates list');
  assert.ok(fullRejection.reason.toLowerCase().includes('capacity'), 'Rejection reason must cite capacity');
});

console.log('------------------------------------------------------------------------');
console.log(`GPS Freshness Scoring Tests Summary: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%).`);
console.log('========================================================================\n');

if (passed !== total) {
  process.exit(1);
}
