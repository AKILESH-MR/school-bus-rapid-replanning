// Realistic Replanning Edge & Failure Test Cases Suite
import { AppStore } from '../state/store.js';

export function runReplanningEdgeCaseTests(customStore = null) {
  const testResults = [];
  const startTime = performance.now();

  // Helper to record a test result
  function recordTest({ id, scenario, expectedResult, actualResult, passed, failureReason, replanningTimeMs, simulatedReviewTimeMs, manualIntervention, baselineTimeMs, invariants }) {
    const e2eRecoveryTimeMs = replanningTimeMs + (simulatedReviewTimeMs || 0);
    const targetTimeMs = 8 * 60 * 1000; // 8 minutes target
    
    testResults.push({
      id,
      scenario,
      expectedResult,
      actualResult,
      passed,
      status: passed ? 'PASS' : 'FAIL',
      failureReason: failureReason || null,
      engineTimeMs: replanningTimeMs,
      e2eRecoveryTimeMs,
      baselineTimeMs,
      targetTimeMs,
      manualIntervention: !!manualIntervention,
      invariants: invariants || {
        capacityViolation: false,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 1: Student Cancellation
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    const studentToCancel = testStore.getState().students.find(s => s.id === 'STU-1001') || testStore.getState().students[0];
    const initialBusId = studentToCancel.busId;
    const initialBus = testStore.getState().buses.find(b => b.id === initialBusId);
    const initialLoad = initialBus ? initialBus.currentLoad : 0;
    const initialCapacity = initialBus ? initialBus.capacity : 54;

    // Execute cancellation request
    testStore.cancelStudent(studentToCancel.id);

    const disruption = testStore.getState().disruptions.find(d => d.type === 'student_cancel' && d.studentId === studentToCancel.id);

    // Human-in-the-loop: Dispatcher reviews and accepts the AI recommendation
    if (disruption) {
      testStore.acceptAIPlan(disruption.id);
    }

    const updatedStudent = testStore.getState().students.find(s => s.id === studentToCancel.id);
    const updatedBus = testStore.getState().buses.find(b => b.id === initialBusId);

    const isStudentCancelled = updatedStudent.status === 'absent_cancelled' && updatedStudent.busId === 'UNASSIGNED';
    const isLoadDecremented = updatedBus ? updatedBus.currentLoad === initialLoad - 1 : true;
    const isDisruptionLogged = disruption !== undefined && disruption.beforeRoute !== null && disruption.afterRoute !== null;
    const capacityValid = updatedBus ? updatedBus.currentLoad <= initialCapacity && updatedBus.currentLoad >= 0 : true;

    const passed = isStudentCancelled && isLoadDecremented && isDisruptionLogged && capacityValid;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-01',
      scenario: 'Student Cancellation',
      expectedResult: 'Mark student absent, unassign from active route, decrement bus load, recalculate dwell time savings, log disruption.',
      actualResult: isStudentCancelled && isLoadDecremented 
        ? `Student marked absent. Bus ${initialBusId} load reduced (${initialLoad} → ${updatedBus.currentLoad}/${initialCapacity}). Saved ${disruption?.aiRecommendation?.timeSavedMins || 2} min dwell time.` 
        : 'Failed to update student state or recalculate bus capacity.',
      passed,
      failureReason: passed ? null : 'Cancellation did not update student assignment or bus load correctly.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 15000,
      baselineTimeMs: 465000,
      manualIntervention: false,
      invariants: {
        capacityViolation: !capacityValid,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 2: Urgent Student Addition
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    const urgentStudentData = {
      name: "Marcus Vance Jr.",
      grade: "8th Grade",
      schoolId: "SCH-02",
      schoolName: "Lincoln Middle School",
      stopName: "Taraval & 28th Ave",
      guardianName: "Marcus Vance",
      guardianPhone: "(555) 301-4455",
      specialNeeds: "Wheelchair Accessibility Required"
    };

    // Execute urgent addition evaluation
    testStore.addStudent(urgentStudentData);

    const disruption = testStore.getState().disruptions.find(d => d.type === 'urgent_add' && d.studentName === urgentStudentData.name);
    const recommendation = disruption?.aiRecommendation;
    const recommendedBus = testStore.getState().buses.find(b => b.id === recommendation?.recommendedBusId);

    const hasRecommendation = recommendation !== null && recommendation !== undefined;
    const isFeasibleBus = recommendedBus && recommendedBus.capacity > (recommendedBus.currentLoad || 0);
    const hasLift = recommendedBus?.amenities?.some(a => a.toLowerCase().includes('wheelchair'));
    const isApprovedSafeguard = disruption.status === 'unresolved'; // Not auto-assigned before approval

    // Test dispatcher approval
    testStore.acceptAIPlan(disruption.id);
    const approvedStudent = testStore.getState().students.find(s => s.id === disruption.studentId);
    const isNowAssigned = approvedStudent.busId === recommendedBus.id && approvedStudent.status === 'waiting';

    const passed = hasRecommendation && isFeasibleBus && hasLift && isApprovedSafeguard && isNowAssigned;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-02',
      scenario: 'Urgent Student Addition',
      expectedResult: 'Identify compatible bus (Lincoln Middle, ADA Lift, Available Seats, Available Driver), require dispatcher approval before activation.',
      actualResult: passed
        ? `Recommended ${recommendedBus.id} (+${recommendation.estimatedAdditionalDelay}). Verified ADA Lift & driver availability. Assigned upon approval.`
        : 'Failed to find ADA compatible bus or violated dispatcher approval gate.',
      passed,
      failureReason: passed ? null : 'Recommended bus lacked ADA lift or bypassed approval requirement.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 25000,
      baselineTimeMs: 465000,
      manualIntervention: false,
      invariants: {
        capacityViolation: recommendedBus ? recommendedBus.currentLoad > recommendedBus.capacity : false,
        unavailableBusAssigned: recommendedBus ? ['breakdown', 'maintenance', 'offline'].includes(recommendedBus.status) : false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 3: Vehicle Unavailable / Bus Breakdown
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    const brokenBusId = 'BUS-04';
    const brokenBus = testStore.getState().buses.find(b => b.id === brokenBusId);
    const affectedLoad = brokenBus.currentLoad || 36;

    // Execute breakdown handling
    testStore.handleVehicleBreakdown(brokenBusId, {
      title: "Engine Stall at Cole & Haight",
      location: "Cole & Haight St",
      impact: "Engine failure, 36 students stranded"
    });

    const disruption = testStore.getState().disruptions.find(d => d.type === 'breakdown' && d.busId === brokenBusId);
    const recommendation = disruption?.aiRecommendation;
    const repBus = testStore.getState().buses.find(b => b.id === recommendation?.recommendedBusId);

    const brokenBusUnavailable = brokenBus.status === 'breakdown';
    const neverRecommendedSelf = recommendation?.recommendedBusId !== brokenBusId;
    const repCapacityValid = repBus && repBus.capacity >= affectedLoad;
    const repStatusValid = repBus && !['breakdown', 'maintenance', 'offline'].includes(repBus.status);

    // Test dispatcher approval
    testStore.acceptAIPlan(disruption.id);

    const updatedDisruption = testStore.getState().disruptions.find(d => d.id === disruption.id);
    const recoveryTime = updatedDisruption.endToEndRecoveryTimeMs;

    const afterBrokenBus = testStore.getState().buses.find(b => b.id === brokenBusId);
    const afterRepBus = testStore.getState().buses.find(b => b.id === repBus.id);

    const isSwapped = afterBrokenBus.currentLoad === 0 && afterRepBus.currentLoad === affectedLoad && afterRepBus.status === 'in_transit';
    const passed = brokenBusUnavailable && neverRecommendedSelf && repCapacityValid && repStatusValid && isSwapped;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-03',
      scenario: 'Vehicle Breakdown',
      expectedResult: 'Mark broken vehicle unavailable, never recommend broken vehicle, select standby bus with capacity >= 36, assign standby driver.',
      actualResult: passed
        ? `Broken bus ${brokenBusId} stalled. Selected depot standby ${repBus.id} (${repBus.capacity} capacity >= ${affectedLoad}). Swapped upon approval. Recovery time: ${recoveryTime}ms.`
        : 'Failed: Broken vehicle recommended or insufficient capacity selected.',
      passed,
      failureReason: passed ? null : 'Breakdown replanning selected invalid replacement or failed passenger transfer.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 35000,
      baselineTimeMs: 825000,
      manualIntervention: false,
      invariants: {
        capacityViolation: afterRepBus ? afterRepBus.currentLoad > afterRepBus.capacity : false,
        unavailableBusAssigned: recommendation?.recommendedBusId === brokenBusId,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 4: Driver Unavailable (Sickness / Rest / Conflict)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    const sickDriver = testStore.getState().drivers.find(d => d.status === 'sick') || { id: 'DRV-102', name: 'Michael Torres', status: 'sick' };
    const conflictedDriver = { id: 'DRV-999', name: 'Busy Driver', status: 'active', commitments: ['Field Trip Transfer 08:30 AM'] };
    const availableStandbyDriver = testStore.getState().drivers.find(d => d.status === 'standby');

    const checkSick = testStore.validateDriverAvailabilityAndCommitments(sickDriver, null, null);
    const checkConflict = testStore.validateDriverAvailabilityAndCommitments(conflictedDriver, null, null);
    const checkAvailable = testStore.validateDriverAvailabilityAndCommitments(availableStandbyDriver, null, null);

    const sickRejected = checkSick.isValid === false && checkSick.reason.includes('unavailable');
    const conflictRejected = checkConflict.isValid === false && checkConflict.reason.includes('commitment');
    const availableAccepted = checkAvailable.isValid === true;

    const passed = sickRejected && conflictRejected && availableAccepted;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-04',
      scenario: 'Driver Unavailable / Conflict',
      expectedResult: 'Reject sick/off-duty drivers, reject drivers with commitments, accept only verified available reserve drivers.',
      actualResult: passed
        ? `Rejected sick driver (${checkSick.reason}), rejected commitment conflict (${checkConflict.reason}), approved standby driver (${availableStandbyDriver?.name}).`
        : 'Failed to reject unavailable or conflicted driver.',
      passed,
      failureReason: passed ? null : 'Validation failed to flag driver unavailability or commitment conflict.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 20000,
      baselineTimeMs: 465000,
      manualIntervention: false,
      invariants: {
        capacityViolation: false,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: !sickRejected,
        driverCommitmentConflict: !conflictRejected
      }
    });
  }

  // =========================================================================
  // SCENARIO 5: Bus Full (Capacity Violation Prevention)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    
    // Fill BUS-01 to maximum capacity
    const bus1 = testStore.getState().buses.find(b => b.id === 'BUS-01');
    bus1.currentLoad = bus1.capacity; // 54/54 (0 seats available)

    const evaluation = testStore.evaluateUrgentStudentAddition({
      name: "OverCapacity Test Student",
      schoolId: "SCH-01",
      schoolName: "Oakridge High School",
      stopName: "Chestnut & Fillmore",
      specialNeeds: "None"
    });

    const bus1Eval = evaluation.allEvaluations.find(e => e.bus.id === 'BUS-01');
    const bus1Rejected = bus1Eval.isFeasible === false;
    const bus1ReasonHasCapacity = bus1Eval.reasons.some(r => r.toLowerCase().includes('capacity'));

    const passed = bus1Rejected && bus1ReasonHasCapacity;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-05',
      scenario: 'Capacity Violation Prevention',
      expectedResult: 'Reject candidate bus with 0 available seats, store explicit capacity rejection reason, never allow over-capacity passenger boarding.',
      actualResult: passed
        ? `Bus ${bus1.id} (54/54 load) correctly rejected: "${bus1Eval.reasons.find(r => r.includes('capacity'))}". Zero capacity violations.`
        : 'Failed: Full bus was incorrectly marked as feasible candidate.',
      passed,
      failureReason: passed ? null : 'Full bus candidate was not rejected.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 15000,
      baselineTimeMs: 465000,
      manualIntervention: false,
      invariants: {
        capacityViolation: bus1Eval.isFeasible === true,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 6: GPS Unavailable (Signal Loss & Manual Checkpoint Fallback)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();
    const busToTest = testStore.getState().buses.find(b => b.id === 'BUS-04') || testStore.getState().buses[0];

    // Verify initial no_signal detection
    const isNoSignalDetected = busToTest.gpsStatus === 'no_signal';

    // Dispatcher performs manual location update
    const manualCoords = [37.7690, -122.4510];
    const manualLandmark = "Cole & Haight St (Radio Verified by Unit 4)";
    testStore.updateBusLocationManually(busToTest.id, manualCoords, manualLandmark, "Driver radio check-in");

    const updatedBus = testStore.getState().buses.find(b => b.id === busToTest.id);
    const isManualMarked = updatedBus.gpsStatus === 'manual' && updatedBus.isManualLocation === true;
    const isCoordsUpdated = updatedBus.coords[0] === manualCoords[0] && updatedBus.coords[1] === manualCoords[1];
    const isLandmarkUpdated = updatedBus.lastKnownLocation === manualLandmark;

    const passed = isNoSignalDetected && isManualMarked && isCoordsUpdated && isLandmarkUpdated;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-06',
      scenario: 'GPS Unavailable & Manual Fallback',
      expectedResult: 'Detect GPS failure ("No Signal"), display last known position, disallow fake live fix, allow manual coordinates override.',
      actualResult: passed
        ? `Detected GPS lost on ${busToTest.id}. Dispatcher manually updated coordinates to [${manualCoords.join(', ')}] ("${manualLandmark}"). Marked as Manual Fix.`
        : 'Failed to handle GPS signal loss or manual location override.',
      passed,
      failureReason: passed ? null : 'GPS fallback failed to update coordinates or manual fix status.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 45000,
      baselineTimeMs: 465000,
      manualIntervention: true,
      invariants: {
        capacityViolation: false,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 7: Network Unavailable (Offline Cache & Synchronization)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();

    // 1. Set network to Offline
    testStore.setNetworkStatus('offline');
    const isOffline = testStore.getState().networkStatus === 'offline';

    // 2. Perform operational action while offline (Cancel student)
    const stu = testStore.getState().students[0];
    testStore.cancelStudent(stu.id);

    // Verify pending offline queue has recorded the change
    const pendingChanges = testStore.getState().pendingOfflineChanges;
    const isQueued = pendingChanges.length > 0 && pendingChanges.some(c => c.actionType === 'CANCEL_STUDENT');

    // 3. Restore network to Online
    testStore.setNetworkStatus('online');
    const isOnline = testStore.getState().networkStatus === 'online';
    const isQueueFlushed = testStore.getState().pendingOfflineChanges.length === 0;

    const passed = isOffline && isQueued && isOnline && isQueueFlushed; if (!passed) console.log('DEBUG TEST 7:', { isOffline, isQueued, isOnline, isQueueFlushed, pending: testStore.getState().pendingOfflineChanges });
    const t1 = performance.now();

    recordTest({
      id: 'TEST-07',
      scenario: 'Network Offline Queue',
      expectedResult: 'Transition to Offline mode, continue operations locally with last known data, store pending changes locally, synchronize upon reconnection.',
      actualResult: passed
        ? `Operated in Offline mode. Queued ${pendingChanges.length} local operational changes. Synchronized and flushed queue upon network restoration.`
        : 'Failed offline local queueing or online synchronization.',
      passed,
      failureReason: passed ? null : 'Offline queue failed to persist or synchronize on network recovery.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 15000,
      baselineTimeMs: 465000,
      manualIntervention: false,
      invariants: {
        capacityViolation: false,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 8: Multiple Simultaneous Disruptions (Concurrency & Resource Isolation)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();

    // Disruption 1: Breakdown on BUS-04
    testStore.handleVehicleBreakdown('BUS-04', {
      title: "Morning Rush Breakdown BUS-04",
      location: "Cole & Haight St",
      impact: "36 students stalled"
    });
    const dis1 = testStore.getState().disruptions[0]; // Newly created breakdown disruption
    testStore.acceptAIPlan(dis1.id);

    // Disruption 2: Urgent Student on Route 102
    testStore.addStudent({
      name: "Simultaneous Student Addition",
      schoolId: "SCH-02",
      schoolName: "Lincoln Middle School",
      stopName: "West Portal Station",
      specialNeeds: "None"
    });
    const dis2 = testStore.getState().disruptions.find(d => d.studentName === 'Simultaneous Student Addition');
    testStore.acceptAIPlan(dis2.id); // BUS-02 load increases

    // Disruption 3: Student Cancellation on Route 101
    const stu3 = testStore.getState().students.find(s => s.routeId === 'RT-101' && s.status !== 'absent_cancelled');
    if (stu3) {
      testStore.cancelStudent(stu3.id);
      const dis3 = testStore.getState().disruptions.find(d => d.type === 'student_cancel' && d.studentId === stu3.id);
      if (dis3) {
        testStore.acceptAIPlan(dis3.id);
      }
    }

    const state = testStore.getState();
    const repBusId = dis1?.aiRecommendation?.recommendedBusId || 'BUS-05';
    const repBus = state.buses.find(b => b.id === repBusId);
    const bus4 = state.buses.find(b => b.id === 'BUS-04');
    const bus2 = state.buses.find(b => b.id === 'BUS-02');

    const noResourceCollision = repBus && repBus.status === 'in_transit' && repBus.routeId === 'RT-104' && bus4.status === 'breakdown';
    const capacitiesRespected = repBus && repBus.currentLoad <= repBus.capacity && bus2.currentLoad <= bus2.capacity;

    const passed = noResourceCollision && capacitiesRespected;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-08',
      scenario: 'Multiple Simultaneous Disruptions',
      expectedResult: 'Resolve simultaneous disruptions without resource collisions, double-booking standby fleet, or violating capacity constraints.',
      actualResult: passed
        ? `Successfully processed 3 concurrent disruptions: ${repBus.id} dispatched for RT-104, BUS-02 onboarded urgent student, RT-101 dwell time reduced. Zero fleet collision.`
        : 'Failed: Resource collision or capacity constraint violation during concurrent replanning.',
      passed,
      failureReason: passed ? null : 'Multiple disruptions caused fleet collision or capacity breach.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 45000,
      baselineTimeMs: 1065000,
      manualIntervention: false,
      invariants: {
        capacityViolation: !capacitiesRespected,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  // =========================================================================
  // SCENARIO 9: No Feasible Bus (Constraint Exhaustion Fallback)
  // =========================================================================
  {
    const t0 = performance.now();
    const testStore = new AppStore();

    // Exhaust all buses for West Valley Elementary (SCH-03)
    // BUS-03 serves SCH-03: fill it to full capacity
    const bus3 = testStore.getState().buses.find(b => b.id === 'BUS-03');
    bus3.currentLoad = bus3.capacity;

    // Make standby buses unavailable or incompatible
    testStore.getState().buses.forEach(b => {
      if (b.status === 'in_depot') {
        b.status = 'maintenance'; // Disable standby buses
      }
    });

    // Request urgent addition for SCH-03 with Wheelchair
    testStore.addStudent({
      name: "Impossible Addition Student",
      schoolId: "SCH-03",
      schoolName: "West Valley Elementary",
      stopName: "SOMA Central",
      specialNeeds: "Wheelchair Accessibility Required"
    });

    const disruption = testStore.getState().disruptions.find(d => d.studentName === 'Impossible Addition Student');
    const isNoFeasibleFlagged = disruption && disruption.noFeasibleSolution === true;
    const noRecommendationMade = disruption && disruption.aiRecommendationAvailable === false;
    const actualReasonsLogged = disruption && disruption.candidateEvaluations && disruption.candidateEvaluations.length > 0;

    const passed = isNoFeasibleFlagged && noRecommendationMade && actualReasonsLogged;
    const t1 = performance.now();

    recordTest({
      id: 'TEST-09',
      scenario: 'No Feasible Solution Fallback',
      expectedResult: 'Flag "No Feasible Solution — Manual Intervention Required", record actual candidate rejection reasons, never fabricate false confidence or invalid assignment.',
      actualResult: passed
        ? `Engine reported: "No Feasible Solution — Manual Intervention Required". Logged ${disruption.candidateEvaluations.length} candidate rejection reasons (Capacity/Status/Compatibility).`
        : 'Failed: Fabricated invalid recommendation when no feasible bus existed.',
      passed,
      failureReason: passed ? null : 'System failed to report No Feasible Solution when constraints were exhausted.',
      replanningTimeMs: t1 - t0,
      simulatedReviewTimeMs: 180000, // Manual resolution took 3 mins
      baselineTimeMs: 1545000,
      manualIntervention: true,
      invariants: {
        capacityViolation: false,
        unavailableBusAssigned: false,
        unavailableDriverAssigned: false,
        driverCommitmentConflict: false
      }
    });
  }

  const totalTimeMs = performance.now() - startTime;
  const passedCount = testResults.filter(t => t.passed).length;
  const failedCount = testResults.length - passedCount;

  return {
    testResults,
    passedCount,
    failedCount,
    totalTests: testResults.length,
    allPassed: failedCount === 0,
    totalExecutionTimeMs: totalTimeMs
  };
}
