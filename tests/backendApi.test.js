/**
 * Test Suite for Local Backend REST API
 * Verifies all 10 endpoints, HTTP status codes, error responses, and idempotency
 */
import { createServer } from '../server/server.js';
import { LocalDatabase } from '../server/db.js';

console.log('========================================================================');
console.log('  LOCAL BACKEND REST API: UNIT & INTEGRATION TEST SUITE');
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

async function runTests() {
  // Use in-memory SQLite database for clean test isolation
  const db = new LocalDatabase(':memory:');
  const app = createServer({ db });

  // Listen on random port (0 lets OS assign free port)
  const addr = await app.listen(0);
  const port = addr.port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // -------------------------------------------------------------------------
    // 1. Health Check Endpoint: GET /api/health
    // -------------------------------------------------------------------------
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert(healthRes.status === 200, '1a. GET /api/health returns HTTP 200');
    const healthData = await healthRes.json();
    assert(healthData.status === 'ok' && healthData.database === 'sqlite-local', '1b. GET /api/health payload has expected status and db info');

    // -------------------------------------------------------------------------
    // 2. GET /api/buses
    // -------------------------------------------------------------------------
    const busesRes = await fetch(`${baseUrl}/api/buses`);
    assert(busesRes.status === 200, '2a. GET /api/buses returns HTTP 200');
    const buses = await busesRes.json();
    assert(Array.isArray(buses) && buses.length >= 8, '2b. GET /api/buses returns array with initial fleet vehicles');
    assert(buses[0].id && buses[0].capacity, '2c. Bus entity has valid schema (id, capacity)');

    // -------------------------------------------------------------------------
    // 3. GET /api/routes
    // -------------------------------------------------------------------------
    const routesRes = await fetch(`${baseUrl}/api/routes`);
    assert(routesRes.status === 200, '3a. GET /api/routes returns HTTP 200');
    const routes = await routesRes.json();
    assert(Array.isArray(routes) && routes.length >= 4, '3b. GET /api/routes returns array with active routes');
    assert(routes[0].id && Array.isArray(routes[0].stops), '3c. Route entity has stops array');

    // -------------------------------------------------------------------------
    // 4. GET /api/disruptions
    // -------------------------------------------------------------------------
    const disruptionsRes = await fetch(`${baseUrl}/api/disruptions`);
    assert(disruptionsRes.status === 200, '4a. GET /api/disruptions returns HTTP 200');
    const disruptions = await disruptionsRes.json();
    assert(Array.isArray(disruptions) && disruptions.length >= 4, '4b. GET /api/disruptions returns initial disruptions');

    // -------------------------------------------------------------------------
    // 5. POST /api/disruptions
    // -------------------------------------------------------------------------
    // 5a. Validation error on missing title / type
    const invalidDisruptionRes = await fetch(`${baseUrl}/api/disruptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Missing title and type' })
    });
    assert(invalidDisruptionRes.status === 400, '5a. POST /api/disruptions returns HTTP 400 when missing required fields');

    // 5b. Valid creation
    const newDisruptionPayload = {
      type: 'urgent_add',
      title: 'Urgent Student Addition - Test Student',
      studentName: 'Test Student',
      location: 'Park Presidio Blvd & Geary',
      coords: [37.7812, -122.4715],
      severity: 'warning'
    };
    const createDisruptionRes = await fetch(`${baseUrl}/api/disruptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDisruptionPayload)
    });
    assert(createDisruptionRes.status === 201, '5b. POST /api/disruptions returns HTTP 201 on success');
    const createdDisruption = await createDisruptionRes.json();
    assert(createdDisruption.id && createdDisruption.id.startsWith('DIS-'), '5c. Created disruption returns valid generated ID');
    assert(createdDisruption.title === newDisruptionPayload.title, '5d. Created disruption matches submitted title');

    // -------------------------------------------------------------------------
    // 6. POST /api/replans
    // -------------------------------------------------------------------------
    // 6a. Validation error on missing context
    const invalidReplanRes = await fetch(`${baseUrl}/api/replans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(invalidReplanRes.status === 400, '6a. POST /api/replans returns HTTP 400 when disruption context is missing');

    // 6b. Valid replanning evaluation for urgent student addition
    const replanPayload = {
      disruptionId: createdDisruption.id,
      type: 'urgent_add',
      studentStop: {
        name: 'Urgent Test Stop',
        coords: [37.779, -122.425],
        specialNeeds: 'None'
      },
      destinationSchoolId: 'SCH-01',
      requiredSeats: 1
    };
    const replanRes = await fetch(`${baseUrl}/api/replans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replanPayload)
    });
    assert(replanRes.status === 200, '6b. POST /api/replans returns HTTP 200 for valid replan generation');
    const replanData = await replanRes.json();
    assert(replanData.success && replanData.planId, '6c. Replan returns planId');
    assert(replanData.replan && replanData.replan.recommendedBusId, '6d. Replan provides recommendedBusId');
    assert(replanData.replan.insertionPosition !== undefined, '6e. Replan provides exact greedy insertion position');

    const generatedPlanId = replanData.planId;

    // -------------------------------------------------------------------------
    // 7. POST /api/replans/:id/modify
    // -------------------------------------------------------------------------
    // 7a. Modify with preferred bus and custom delay
    const modifyRes = await fetch(`${baseUrl}/api/replans/${generatedPlanId}/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        constraints: {
          maxAllowedDelay: 20,
          minRequiredSeats: 2,
          preferredBusId: 'BUS-02',
          driverPreference: 'ANY'
        }
      })
    });
    assert(modifyRes.status === 200, '7a. POST /api/replans/:id/modify returns HTTP 200 on constraint customization');
    const modifyData = await modifyRes.json();
    assert(modifyData.success && modifyData.recalculatedRecommendation, '7b. Modify returns recalculatedRecommendation');
    assert(modifyData.beforeAfterComparison, '7c. Modify returns beforeAfterComparison structure');

    // 7b. Modify on non-existent replan returns 404
    const modify404Res = await fetch(`${baseUrl}/api/replans/NON_EXISTENT_PLAN/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ constraints: {} })
    });
    assert(modify404Res.status === 404, '7d. POST /api/replans/:id/modify returns HTTP 404 for invalid ID');

    // -------------------------------------------------------------------------
    // 8. POST /api/replans/:id/reject
    // -------------------------------------------------------------------------
    // 8a. Rejection without mandatory reason returns 400
    const rejectNoReasonRes = await fetch(`${baseUrl}/api/replans/${generatedPlanId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: '' })
    });
    assert(rejectNoReasonRes.status === 400, '8a. POST /api/replans/:id/reject returns HTTP 400 when reason is empty');

    // 8b. Rejection with valid reason
    const rejectRes = await fetch(`${baseUrl}/api/replans/${generatedPlanId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Overcrowding concern on selected corridor' })
    });
    assert(rejectRes.status === 200, '8b. POST /api/replans/:id/reject returns HTTP 200 when reason is provided');
    const rejectData = await rejectRes.json();
    assert(rejectData.success && rejectData.reason === 'Overcrowding concern on selected corridor', '8c. Rejection confirms recorded reason');

    // -------------------------------------------------------------------------
    // 9. POST /api/replans/:id/approve
    // -------------------------------------------------------------------------
    // Generate a fresh replan to approve
    const freshReplanRes = await fetch(`${baseUrl}/api/replans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replanPayload)
    });
    const freshReplanData = await freshReplanRes.json();
    const freshPlanId = freshReplanData.planId;

    const approveRes = await fetch(`${baseUrl}/api/replans/${freshPlanId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userRole: 'Dispatcher', actionType: 'URGENT_ADD_APPROVED' })
    });
    assert(approveRes.status === 200, '9a. POST /api/replans/:id/approve returns HTTP 200 on approval');
    const approveData = await approveRes.json();
    assert(approveData.success && approveData.finalState, '9b. Approval commits state and returns finalState');

    // -------------------------------------------------------------------------
    // 10. POST /api/sync & Idempotency Testing
    // -------------------------------------------------------------------------
    const testActionId = `ACT-SYNC-${Date.now()}`;
    const syncAction = {
      actionId: testActionId,
      actionType: 'MANUAL_BUS_LOCATION',
      userId: 'dispatcher-1',
      role: 'dispatcher',
      timestamp: new Date().toISOString(),
      payload: {
        busId: 'BUS-01',
        coords: [37.775, -122.418],
        locationName: 'Civic Center Checkpoint'
      }
    };

    // First sync attempt -> should succeed as newly synced
    const syncRes1 = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions: [syncAction] })
    });
    assert(syncRes1.status === 200, '10a. POST /api/sync returns HTTP 200');
    const syncData1 = await syncRes1.json();
    assert(syncData1.syncedCount === 1 && syncData1.duplicateCount === 0, '10b. First sync executes action and reports syncedCount = 1');
    assert(syncData1.results[0].status === 'SYNCED' && !syncData1.results[0].duplicate, '10c. First sync result marks duplicate = false');

    // Second sync attempt with SAME actionId -> IDEMPOTENCY MUST PREVENT DUPLICATE EXECUTION!
    const syncRes2 = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions: [syncAction] })
    });
    assert(syncRes2.status === 200, '10d. POST /api/sync returns HTTP 200 on duplicate retry');
    const syncData2 = await syncRes2.json();
    assert(syncData2.syncedCount === 0 && syncData2.duplicateCount === 1, '10e. Idempotency test: duplicateCount = 1, syncedCount = 0');
    assert(syncData2.results[0].status === 'ALREADY_SYNCED' && syncData2.results[0].duplicate === true, '10f. Idempotency test: result status is ALREADY_SYNCED');

    // -------------------------------------------------------------------------
    // 11. GET /api/audit
    // -------------------------------------------------------------------------
    const auditRes = await fetch(`${baseUrl}/api/audit`);
    assert(auditRes.status === 200, '11a. GET /api/audit returns HTTP 200');
    const auditLogs = await auditRes.json();
    assert(Array.isArray(auditLogs) && auditLogs.length > 0, '11b. GET /api/audit returns non-empty array of audit logs');
    const hasReplanAudit = auditLogs.some(l => l.action === 'RECOMMENDATION_ACCEPTED' || l.action === 'RECOMMENDATION_REJECTED');
    assert(hasReplanAudit, '11c. Audit log contains recorded replan approval/rejection lifecycle events');

    // -------------------------------------------------------------------------
    // 12. 404 Unknown Endpoint
    // -------------------------------------------------------------------------
    const notFoundRes = await fetch(`${baseUrl}/api/non_existent_route`);
    assert(notFoundRes.status === 404, '12a. Unknown endpoint returns HTTP 404');
    const notFoundData = await notFoundRes.json();
    assert(notFoundData.error && notFoundData.statusCode === 404, '12b. 404 response contains error message and status code');

  } finally {
    await app.close();
  }

  console.log('\n------------------------------------------------------------------------');
  console.log(`Backend API Tests Summary: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%).`);
  console.log('========================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed with unhandled error:', err);
  process.exit(1);
});
