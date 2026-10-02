/**
 * Cancellation Approval Workflow & Human-in-the-Loop Test Suite
 *
 * Verifies that:
 * 1. Cancellation before approval does NOT mutate live student, bus, or route state.
 * 2. Cancellation after approval applies proposed state and updates operational resources.
 * 3. Cancellation rejected preserves original operational state and records reason.
 * 4. Cancellation modified recalculates and applies only dispatcher-approved modified plan.
 * 5. Vehicle breakdown approval updates fleet resources and records required audit schema.
 * 6. Urgent addition approval updates vehicle load, inserts stop, and records audit schema.
 * 7. State does not change unexpectedly before approval across all disruption types.
 * 8. Audit trail records all 8 required attributes for every approved change:
 *    - disruption ID
 *    - action type
 *    - original state
 *    - proposed state
 *    - final state
 *    - dispatcher role
 *    - timestamp
 *    - recommendation ID
 */

import { AppStore } from '../src/state/store.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, detail = '') {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}${detail ? ': ' + detail : ''}`);
  }
}

console.log('========================================================================');
console.log('  CANCELLATION APPROVAL WORKFLOW & HITL CONSISTENCY: TEST SUITE');
console.log('========================================================================\n');

// ============================================================================
// TEST 1: Cancellation Before Approval (No premature mutation)
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1001') || store.state.students[0];
  const originalBusId = student.busId;
  const originalRouteId = student.routeId;
  const originalStatus = student.status;
  const bus = store.state.buses.find(b => b.id === originalBusId);
  const route = store.state.routes.find(r => r.id === originalRouteId);
  const originalLoad = bus.currentLoad;
  const originalStopsCount = route.stops.length;

  // Ingest operational cancellation event
  store.cancelStudent(student.id);

  const disruption = store.state.disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);

  // 1a. Disruption created in unresolved state
  assert(disruption != null, '1a. Cancellation disruption is created');
  assert(disruption.status === 'unresolved', '1b. Disruption status is unresolved before approval', 'status=' + disruption?.status);
  assert(disruption.aiRecommendationAvailable === true, '1c. AI recommendation is available for review');

  // 1b. Verify proposed vs original state snapshots
  assert(disruption.originalState != null && disruption.originalState.student.id === student.id,
    '1d. Original state is captured on disruption');
  assert(disruption.proposedState != null && disruption.proposedState.student.status === 'absent_cancelled',
    '1e. Proposed state indicates absent_cancelled without applying yet');

  // 1c. CRITICAL: Live operational state remains INTACT before approval
  const liveStudent = store.state.students.find(s => s.id === student.id);
  const liveBus = store.state.buses.find(b => b.id === originalBusId);
  const liveRoute = store.state.routes.find(r => r.id === originalRouteId);

  assert(liveStudent.status === originalStatus, '1f. Student status untouched before approval', liveStudent.status + ' vs ' + originalStatus);
  assert(liveStudent.busId === originalBusId, '1g. Student busId unchanged before approval', liveStudent.busId);
  assert(liveStudent.routeId === originalRouteId, '1h. Student routeId unchanged before approval', liveStudent.routeId);
  assert(liveStudent.cancellationPending === true, '1i. Student flagged with cancellationPending review badge');
  assert(liveBus.currentLoad === originalLoad, '1j. Bus load NOT decremented before approval', 'load=' + liveBus.currentLoad);
  assert(liveRoute.stops.length === originalStopsCount, '1k. Route stops count unchanged before approval');
}

// ============================================================================
// TEST 2: Cancellation After Approval
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1001') || store.state.students[0];
  const bus = store.state.buses.find(b => b.id === student.busId);
  const initialLoad = bus.currentLoad;

  store.cancelStudent(student.id);
  const disruption = store.state.disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);

  // Dispatcher approves the recommendation
  store.acceptAIPlan(disruption.id);

  const approvedStudent = store.state.students.find(s => s.id === student.id);
  const approvedBus = store.state.buses.find(b => b.id === bus.id);

  assert(disruption.status === 'accepted', '2a. Disruption status is accepted after approval');
  assert(disruption.endToEndRecoveryTimeMs >= 0, '2b. End-to-end recovery time recorded');
  assert(approvedStudent.status === 'absent_cancelled', '2c. Student status updated to absent_cancelled post-approval');
  assert(approvedStudent.busId === 'UNASSIGNED', '2d. Student busId unassigned post-approval');
  assert(approvedStudent.routeId === 'UNASSIGNED', '2e. Student routeId unassigned post-approval');
  assert(approvedStudent.cancellationPending === undefined, '2f. cancellationPending flag cleared post-approval');
  assert(approvedBus.currentLoad === initialLoad - 1, '2g. Bus load decremented post-approval', 'load=' + approvedBus.currentLoad);
}

// ============================================================================
// TEST 3: Cancellation Rejected (Original operational state preserved)
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1004') || store.state.students[1];
  const originalBusId = student.busId;
  const originalRouteId = student.routeId;
  const originalStatus = student.status;
  const bus = store.state.buses.find(b => b.id === originalBusId);
  const initialLoad = bus.currentLoad;

  store.cancelStudent(student.id);
  const disruption = store.state.disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);

  // Dispatcher rejects the cancellation recommendation
  const rejectReason = 'Guardian phoned: student will ride the bus as scheduled';
  store.rejectAIPlan(disruption.id, rejectReason);

  const postRejectStudent = store.state.students.find(s => s.id === student.id);
  const postRejectBus = store.state.buses.find(b => b.id === originalBusId);

  assert(disruption.status === 'rejected', '3a. Disruption status marked rejected');
  assert(disruption.rejectionReason === rejectReason, '3b. Rejection reason recorded on disruption');
  assert(postRejectStudent.status === originalStatus, '3c. Original student status preserved after rejection');
  assert(postRejectStudent.busId === originalBusId, '3d. Original student bus assignment preserved');
  assert(postRejectStudent.routeId === originalRouteId, '3e. Original student route assignment preserved');
  assert(postRejectStudent.cancellationPending === undefined, '3f. cancellationPending flag cleared on rejection');
  assert(postRejectBus.currentLoad === initialLoad, '3g. Bus load unchanged after rejection');

  // Verify rejection audit event
  const rejectAudit = store.state.auditEvents.find(e =>
    e.action === 'RECOMMENDATION_REJECTED' && e.disruptionId === disruption.id
  );
  assert(rejectAudit != null, '3h. RECOMMENDATION_REJECTED audit event created');
  assert(rejectAudit.rejectionReason === rejectReason, '3i. Audit event records exact rejection reason');
  assert(rejectAudit.finalState != null, '3j. Audit event records preserved operational state');
}

// ============================================================================
// TEST 4: Cancellation Modified Workflow
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1005') || store.state.students[2];
  const bus = store.state.buses.find(b => b.id === student.busId);
  const initialLoad = bus.currentLoad;

  store.cancelStudent(student.id);
  const disruption = store.state.disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);

  // Dispatcher recalculates with modified constraints
  store.openConstraintCustomizer(disruption.id);
  const { recalculatedResult } = store.recalculateModifiedConstraints(disruption.id, {
    maxAllowedDelay: 8,
    minRequiredSeats: 2
  });

  // Verify no auto-approval before dispatcher clicks apply
  assert(disruption.status === 'unresolved', '4a. Disruption remains unresolved during constraint customization');
  assert(student.status !== 'absent_cancelled', '4b. Student not cancelled during modification review');

  // Dispatcher approves modified plan
  store.acceptModifiedPlan(disruption.id);

  const postModStudent = store.state.students.find(s => s.id === student.id);
  assert(disruption.status === 'accepted', '4c. Disruption status accepted after modified plan applied');
  assert(postModStudent.status === 'absent_cancelled', '4d. Student marked absent after modified plan applied');
  assert(bus.currentLoad === initialLoad - 1, '4e. Bus load decremented according to modified plan');

  const modAudit = store.state.auditEvents.find(e => e.action === 'MODIFY_PLAN' || e.action === 'RECOMMENDATION_MODIFIED');
  assert(modAudit != null, '4f. Modification recorded in audit trail');
}

// ============================================================================
// TEST 5: Vehicle Breakdown Approval Consistency
// ============================================================================
{
  const store = new AppStore();
  const breakdownDisruption = store.state.disruptions.find(d => d.id === 'DIS-2026-001') || store.state.disruptions[0];

  assert(breakdownDisruption.type === 'breakdown', '5a. Initial breakdown disruption identified');
  const brokenBusId = breakdownDisruption.busId;
  const replacementBusId = breakdownDisruption.aiRecommendation.recommendedBusId;

  // Dispatcher approves replacement bus dispatch
  store.acceptAIPlan(breakdownDisruption.id);

  const brokenBus = store.state.buses.find(b => b.id === brokenBusId);
  const repBus = store.state.buses.find(b => b.id === replacementBusId);

  assert(breakdownDisruption.status === 'accepted', '5b. Breakdown disruption marked accepted');
  assert(brokenBus.status === 'breakdown', '5c. Broken bus status updated to breakdown');
  assert(repBus.status === 'in_transit', '5d. Replacement bus dispatched in_transit');

  const audit = store.state.auditEvents.find(e =>
    e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === breakdownDisruption.id
  );
  assert(audit != null, '5e. Audit log created for breakdown acceptance');
  assert(audit.actionType === 'VEHICLE_BREAKDOWN_APPROVED', '5f. Action type records VEHICLE_BREAKDOWN_APPROVED');
  assert(audit.originalState != null, '5g. Original state captured in breakdown audit');
  assert(audit.finalState != null, '5h. Final state captured in breakdown audit');
  assert(audit.recommendationId != null, '5i. Recommendation ID recorded in breakdown audit');
}

// ============================================================================
// TEST 6: Urgent Student Addition Approval Consistency
// ============================================================================
{
  const store = new AppStore();
  const targetBus = store.state.buses.find(b => b.status === 'in_transit' || b.status === 'in_depot') || store.state.buses[0];
  const targetRoute = store.state.routes.find(r => r.id === targetBus.routeId) || store.state.routes[0];
  const studentId = 'STU-URGENT-HITL';
  const initialLoad = targetBus.currentLoad;
  const initialStopsCount = targetRoute.stops.length;

  store.state.students.unshift({
    id: studentId,
    name: 'HITL Urgent Student',
    status: 'urgent_added',
    busId: 'UNASSIGNED',
    routeId: 'UNASSIGNED',
    stopName: 'HITL Test Stop',
    schoolId: 'SCH-01',
    specialNeeds: 'None',
    pickupCoords: [37.77, -122.42]
  });

  const disruptionId = 'DIS-URGENT-HITL-01';
  store.state.disruptions.unshift({
    id: disruptionId,
    _createdAtMs: Date.now() - 3000,
    type: 'urgent_add',
    title: 'Urgent Student Addition: HITL Test',
    studentId: studentId,
    status: 'unresolved',
    aiRecommendationAvailable: true,
    aiRecommendation: {
      planId: 'REPLAN-URG-001',
      recommendedBusId: targetBus.id,
      recommendedRouteId: targetRoute.id,
      greedyInsertionPosition: 2,
      urgentStopName: 'HITL Test Stop',
      urgentStopCoords: [37.77, -122.42],
      urgentStudentId: studentId,
      additionalDelayMins: 2.0
    }
  });

  // Dispatcher approves urgent addition
  store.acceptAIPlan(disruptionId);

  const student = store.state.students.find(s => s.id === studentId);
  assert(student.busId === targetBus.id, '6a. Student assigned to recommended bus post-approval');
  assert(targetBus.currentLoad === initialLoad + 1, '6b. Bus load incremented post-approval');
  assert(targetRoute.stops.length === initialStopsCount + 1, '6c. New stop inserted into route post-approval');

  const audit = store.state.auditEvents.find(e =>
    e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === disruptionId
  );
  assert(audit != null, '6d. Audit event recorded for urgent addition');
  assert(audit.actionType === 'URGENT_ADD_APPROVED', '6e. Audit actionType records URGENT_ADD_APPROVED');
  assert(audit.originalState != null, '6f. Audit originalState recorded');
  assert(audit.proposedState != null, '6g. Audit proposedState recorded');
  assert(audit.finalState != null, '6h. Audit finalState recorded');
  assert(audit.recommendationId === 'REPLAN-URG-001', '6i. Audit recommendationId recorded');
}

// ============================================================================
// TEST 7: State Does Not Change Unexpectedly Before Approval (Boundary Check)
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1006') || store.state.students[3];
  const bus = store.state.buses.find(b => b.id === student.busId);
  const route = store.state.routes.find(r => r.id === student.routeId);

  const busLoadBefore = bus ? bus.currentLoad : 0;
  const stopsBefore = route ? [...route.stops] : [];

  // Ingest cancellation event
  store.cancelStudent(student.id);

  // Assert absolutely NO mutation to active operational route or bus load
  assert(bus.currentLoad === busLoadBefore, '7a. Bus currentLoad completely unchanged before approval');
  assert(route.stops.length === stopsBefore.length, '7b. Route stops count completely unchanged before approval');
  assert(route.stops.every((st, idx) => st.studentsCount === stopsBefore[idx].studentsCount),
    '7c. Route stop studentCounts completely unchanged before approval');
  assert(student.status !== 'absent_cancelled', '7d. Student status is NOT absent_cancelled before approval');
}

// ============================================================================
// TEST 8: Audit Trail Completeness (All 8 Required Schema Attributes)
// ============================================================================
{
  const store = new AppStore();
  const student = store.state.students.find(s => s.id === 'STU-1007') || store.state.students[4];

  store.cancelStudent(student.id);
  const disruption = store.state.disruptions.find(d => d.type === 'student_cancel' && d.studentId === student.id);
  store.acceptAIPlan(disruption.id);

  const audit = store.state.auditEvents.find(e =>
    e.action === 'RECOMMENDATION_ACCEPTED' && e.disruptionId === disruption.id
  );

  assert(audit != null, '8a. Audit record exists for accepted plan');
  assert(audit.disruptionId === disruption.id, '8b. Audit schema has disruptionId', audit?.disruptionId);
  assert(audit.actionType != null && audit.actionType.length > 0, '8c. Audit schema has actionType', audit?.actionType);
  assert(audit.originalState != null, '8d. Audit schema has originalState');
  assert(audit.proposedState != null, '8e. Audit schema has proposedState');
  assert(audit.finalState != null, '8f. Audit schema has finalState');
  assert(audit.userRole === 'Dispatcher' || audit.userRole === 'Operations Manager', '8g. Audit schema has dispatcher role', audit?.userRole);
  assert(audit.timestamp != null && !isNaN(Date.parse(audit.timestamp)), '8h. Audit schema has valid ISO timestamp', audit?.timestamp);
  assert(audit.recommendationId != null && audit.recommendationId.length > 0, '8i. Audit schema has recommendationId', audit?.recommendationId);
}

console.log('\n------------------------------------------------------------------------');
console.log(`Cancellation Approval Workflow Tests: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%).`);
console.log('------------------------------------------------------------------------\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('ALL CANCELLATION APPROVAL & HITL CONSISTENCY TESTS PASSED SUCCESSFULLY.');
}
