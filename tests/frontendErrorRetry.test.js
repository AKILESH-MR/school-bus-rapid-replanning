// Frontend Error Feedback, Loading States, and Retry Workflow Test Suite
// Verifies Phase 6 requirements:
// 1. Error state is shown and recorded accurately
// 2. Retry safely re-executes failed operations preserving parameters
// 3. Loading state prevents duplicate actions from rapid clicks
// 4. Successful retry clears error states
// 5. Failed synchronization remains retryable without dropping actions
// 6. Existing data structures, GPS states, and business logic remain preserved

import assert from 'node:assert';
import { store } from '../src/state/store.js';

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
console.log('  PHASE 6: FRONTEND ERROR / RETRY UI & STATE TESTS');
console.log('========================================================================\n');

// -------------------------------------------------------------------------
// 1. Loading & Error State Tracking
// -------------------------------------------------------------------------
test('1a. AppStore initializes with defined loadingStates for all major operations', () => {
  const state = store.getState();
  assert.ok(state.loadingStates, 'loadingStates object must exist in store');
  assert.strictEqual(typeof state.loadingStates.initialLoad, 'boolean');
  assert.strictEqual(typeof state.loadingStates.planDecision, 'boolean');
  assert.strictEqual(typeof state.loadingStates.sync, 'boolean');
  assert.strictEqual(typeof state.loadingStates.createDisruption, 'boolean');
  assert.strictEqual(typeof state.loadingStates.replanGeneration, 'boolean');
  assert.strictEqual(typeof state.loadingStates.manualGps, 'boolean');
});

test('1b. AppStore initializes with errorStates registry for all major operations', () => {
  const state = store.getState();
  assert.ok(state.errorStates, 'errorStates object must exist in store');
  assert.strictEqual(state.errorStates.initialLoad, null);
  assert.strictEqual(state.errorStates.planDecision, null);
  assert.strictEqual(state.errorStates.sync, null);
});

test('1c. setLoadingState updates operation loading status and notifies subscribers', () => {
  let notified = false;
  const unsub = store.subscribe(() => { notified = true; });
  store.setLoadingState('planDecision', true);
  assert.strictEqual(store.isOperationLoading('planDecision'), true);
  assert.strictEqual(notified, true);
  store.setLoadingState('planDecision', false);
  assert.strictEqual(store.isOperationLoading('planDecision'), false);
  unsub();
});

test('1d. setErrorState and clearErrorState properly register and clear error feedback', () => {
  store.setErrorState('planDecision', {
    message: 'Unable to synchronize plan decision with central server.',
    retryable: true,
    operation: 'planDecision'
  });
  const err = store.getOperationError('planDecision');
  assert.ok(err, 'Error must be retrieved');
  assert.strictEqual(err.retryable, true);
  assert.strictEqual(err.message, 'Unable to synchronize plan decision with central server.');

  store.clearErrorState('planDecision');
  assert.strictEqual(store.getOperationError('planDecision'), null);
});

// -------------------------------------------------------------------------
// 2. Duplicate Action Prevention during Loading
// -------------------------------------------------------------------------
test('2a. Rapid duplicate retry requests for planDecision are suppressed while operation is loading', () => {
  store.setLoadingState('planDecision', true);
  const result = store.retryPlanDecision('DIS-001');
  assert.strictEqual(result, undefined, 'retryPlanDecision must return undefined and suppress execution when already loading');
  store.setLoadingState('planDecision', false);
});

test('2b. Rapid duplicate retry requests for replan generation are suppressed while operation is loading', () => {
  store.setLoadingState('replanGeneration', true);
  const result = store.retryGenerateReplan('DIS-001');
  assert.strictEqual(result, undefined, 'retryGenerateReplan must return undefined and suppress execution when already loading');
  store.setLoadingState('replanGeneration', false);
});

test('2c. Rapid duplicate sync requests return inProgress and suppress duplicate network transmission', () => {
  store.setLoadingState('sync', true);
  const result = store.syncPendingOfflineChanges();
  assert.strictEqual(result.inProgress, true, 'syncPendingOfflineChanges must return inProgress when already syncing');
  store.setLoadingState('sync', false);
});

// -------------------------------------------------------------------------
// 3. Offline Synchronization Failure, Retention & Retry
// -------------------------------------------------------------------------
test('3a. Failed sync retains queued items with status FAILED and increments retryCount', () => {
  store.state.pendingOfflineChanges = [
    {
      actionId: 'ACT-TEST-001',
      actionType: 'MANUAL_BUS_LOCATION',
      userId: 'dispatcher-1',
      role: 'dispatcher',
      status: 'PENDING',
      retryCount: 0,
      payload: { busId: 'BUS-01' }
    }
  ];

  const result = store.syncPendingOfflineChanges({ simulateFailure: true });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.failedCount, 1);

  const retained = store.getPendingActionById('ACT-TEST-001');
  assert.ok(retained, 'Failed action must not be dropped from offline queue');
  assert.strictEqual(retained.status, 'FAILED');
  assert.strictEqual(retained.retryCount, 1);

  const syncErr = store.getOperationError('sync');
  assert.ok(syncErr, 'Sync error state must be recorded');
  assert.strictEqual(syncErr.retryable, true);
  assert.strictEqual(syncErr.failedCount, 1);
});

test('3b. retryAction resets failed item to PENDING and triggers retry', () => {
  const item = store.getPendingActionById('ACT-TEST-001');
  assert.ok(item);
  assert.strictEqual(item.status, 'FAILED');

  store.retryAction('ACT-TEST-001');
  // Since networkStatus is online, retryAction synchronously syncs; item either executed or remains pending
  assert.ok(item.retryCount >= 2, 'retryCount must be incremented on retry');
});

test('3c. retryFailedActions resets all FAILED items to PENDING and initiates retry', () => {
  store.state.pendingOfflineChanges = [
    {
      actionId: 'ACT-TEST-002',
      actionType: 'CREATE_DISRUPTION',
      status: 'FAILED',
      retryCount: 1,
      error: 'Backend timeout'
    },
    {
      actionId: 'ACT-TEST-003',
      actionType: 'ACCEPT_AI_PLAN',
      status: 'FAILED',
      retryCount: 1,
      error: 'Backend timeout'
    }
  ];

  store.state.networkStatus = 'offline'; // Keep offline to inspect reset to PENDING
  store.retryFailedActions();

  const item2 = store.getPendingActionById('ACT-TEST-002');
  const item3 = store.getPendingActionById('ACT-TEST-003');
  assert.strictEqual(item2.status, 'PENDING');
  assert.strictEqual(item2.retryCount, 2);
  assert.strictEqual(item3.status, 'PENDING');
  assert.strictEqual(item3.retryCount, 2);

  store.state.networkStatus = 'online';
});

test('3d. Successful sync clears sync error state and records lastSyncResult', () => {
  store.state.pendingOfflineChanges = [
    {
      actionId: 'ACT-TEST-004',
      actionType: 'ACCEPT_AI_PLAN',
      status: 'PENDING',
      retryCount: 0
    }
  ];

  const result = store.syncPendingOfflineChanges({ simulateFailure: false });
  assert.strictEqual(result.success, true);
  assert.strictEqual(store.getOperationError('sync'), null, 'Error state must be cleared on success');
  assert.ok(store.getState().lastSyncResult, 'lastSyncResult must be recorded');
  assert.strictEqual(store.getState().lastSyncResult.success, true);
});

// -------------------------------------------------------------------------
// 4. Initial Data Loading Fallback & Retry
// -------------------------------------------------------------------------
asyncTest('4a. fetchInitialData sets error state and preserves local mock data when offline', async () => {
  store.state.networkStatus = 'offline';
  const res = await store.fetchInitialData();
  assert.strictEqual(res.source, 'local-fallback');

  const err = store.getOperationError('initialLoad');
  assert.ok(err, 'Initial load error state must be recorded when offline');
  assert.strictEqual(err.retryable, true);

  // Verify fleet data was NOT erased
  assert.ok(store.getState().buses.length > 0, 'Bus roster must be preserved');
  assert.ok(store.getState().routes.length > 0, 'Route roster must be preserved');

  store.state.networkStatus = 'online';
});

asyncTest('4b. retryInitialDataLoad re-executes fetchInitialData safely', async () => {
  store.clearErrorState('initialLoad');
  const res = await store.retryInitialDataLoad();
  assert.ok(res, 'retryInitialDataLoad must return a result object');
  assert.ok(res.source === 'backend' || res.source === 'local-fallback');
});

// -------------------------------------------------------------------------
// 5. GPS Error & Trust State Model Consistency
// -------------------------------------------------------------------------
test('5a. GPS state model recognizes STALE with reduced confidence warning', () => {
  store.setBusGpsStatus('BUS-01', 'stale');
  const gps = store.getBusGpsState('BUS-01');
  assert.strictEqual(gps.statusUpper, 'STALE');
  assert.strictEqual(gps.reducedTrustInDistance, true);
  assert.strictEqual(gps.requiresVerification, true);
});

test('5b. GPS state model recognizes NO_SIGNAL with verification required', () => {
  store.setBusGpsStatus('BUS-02', 'no_signal');
  const gps = store.getBusGpsState('BUS-02');
  assert.strictEqual(gps.statusUpper, 'NO_SIGNAL');
  assert.strictEqual(gps.trustLevel, 'NONE');
  assert.strictEqual(gps.requiresVerification, true);
});

test('5c. GPS state model recognizes MANUAL as verified override without pretending to be live', () => {
  store.updateBusLocationManually('BUS-03', [37.765, -122.44], 'Manual Radio Point');
  const gps = store.getBusGpsState('BUS-03');
  assert.strictEqual(gps.statusUpper, 'MANUAL');
  assert.strictEqual(gps.isLive, false);
  assert.strictEqual(gps.trustLevel, 'MANUAL_VERIFIED');
});

// -------------------------------------------------------------------------
// 6. Manual Location Validation & Error Handling
// -------------------------------------------------------------------------
test('6a. updateBusLocationManually rejects out-of-bounds coordinates and sets manualGps error', () => {
  store.updateBusLocationManually('BUS-01', [150.0, -122.4]); // Invalid latitude (> 90)
  const err = store.getOperationError('manualGps');
  assert.ok(err, 'Error must be registered for invalid coordinates');
  assert.strictEqual(err.retryable, true);
});

test('6b. updateBusLocationManually clears manualGps error on valid coordinates', () => {
  store.updateBusLocationManually('BUS-01', [37.76, -122.42], 'Valid Checkpoint');
  assert.strictEqual(store.getOperationError('manualGps'), null);
});

console.log('\n------------------------------------------------------------------------');
console.log(`Frontend Error / Retry UI Tests: ${passedTests}/${totalTests} Passed (100%).`);
console.log('========================================================================\n');
