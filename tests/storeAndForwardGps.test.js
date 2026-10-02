/**
 * Comprehensive Unit Test Suite for Network Resilience, Store-and-Forward & GPS Fallback
 */
import { AppStore } from '../src/state/store.js';

console.log('========================================================================');
console.log('  STORE-AND-FORWARD & GPS FALLBACK: HARDENED UNIT TEST SUITE');
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

// Mock localStorage for Node environment
if (typeof global.window === 'undefined') {
  global.window = { addEventListener: () => {} };
}
if (!global.window.localStorage) {
  let storeMap = {};
  global.window.localStorage = {
    getItem: (key) => storeMap[key] || null,
    setItem: (key, val) => { storeMap[key] = String(val); },
    removeItem: (key) => { delete storeMap[key]; },
    clear: () => { storeMap = {}; }
  };
}

function createFreshStore() {
  global.window.localStorage.clear();
  return new AppStore();
}

// ============================================================================
// 1. ONLINE ACTION PROCESSED NORMALLY
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('online');

  const initialLogsCount = testStore.getState().metrics.recentAuditLogs.length;

  // Test dispatchAction online execution
  const dispatched = testStore.dispatchAction({
    actionId: 'ACT-ONLINE-DISPATCH-01',
    actionType: 'BREAKDOWN_DECLARATION',
    userId: 'USR-DISPATCHER-01',
    role: 'dispatcher',
    payload: { busId: 'BUS-04', reason: 'Engine temperature stall' }
  });

  const logs = testStore.getState().metrics.recentAuditLogs;
  const queueCount = testStore.getPendingQueueCount();

  const isOk = dispatched.status === 'EXECUTED' &&
               dispatched.error === null &&
               queueCount === 0 &&
               logs.length > initialLogsCount;

  assert(isOk, '1. Online action: processed normally with immediate execution, audit log, and zero queue pollution');
}

// ============================================================================
// 2. NETWORK INTERRUPTION: DISCONNECT DURING ACTION & SAVED LOCALLY
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline'); // Network disconnect occurs

  // Perform operational action while offline via dispatchAction / queueAction
  const action = testStore.dispatchAction({
    actionId: 'ACT-NET-INT-001',
    actionType: 'CANCEL_STUDENT',
    userId: 'USR-DISPATCHER-01',
    role: 'dispatcher',
    payload: { studentId: 'STU-1001', reason: 'Sick absence' }
  });

  const pending = testStore.getPendingActions();
  const queuedItem = pending.find(a => a.actionId === 'ACT-NET-INT-001');

  // Verify action saved locally and not lost
  const isSavedLocally = queuedItem !== undefined &&
                         queuedItem.status === 'PENDING' &&
                         queuedItem.retryCount === 0 &&
                         queuedItem.error === null;

  assert(isSavedLocally, '2. Network interruption: action preserved locally in store-and-forward queue during disconnect');
}

// ============================================================================
// 3. QUEUED ACTION SCHEMA: VERIFY ALL 9 REQUIRED ATTRIBUTES
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  const action = testStore.queueAction({
    actionId: 'ACT-SCHEMA-TEST',
    actionType: 'ADD_STUDENT_EVALUATION',
    userId: 'USR-DISPATCHER-02',
    role: 'dispatcher',
    payload: { studentName: 'Test Student', schoolId: 'SCH-01' }
  });

  const hasAllFields = action.actionId !== undefined &&
                       action.timestamp !== undefined &&
                       action.userId !== undefined &&
                       action.role !== undefined &&
                       action['userId/role'] !== undefined &&
                       action.actionType !== undefined &&
                       action.payload !== undefined &&
                       action.status !== undefined &&
                       action.retryCount !== undefined &&
                       action.lastAttempt !== undefined &&
                       action.error !== undefined;

  assert(hasAllFields, '3. Queued action schema: contains all 9 required attributes (actionId, timestamp, userId, role, actionType, payload, status, retryCount, lastAttempt, error)');
}

// ============================================================================
// 4. MULTIPLE PENDING ACTIONS QUEUED & VISIBLE QUEUE STATE
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({ actionId: 'ACT-M-01', actionType: 'CANCEL_STUDENT', payload: { id: 'S1' } });
  testStore.queueAction({ actionId: 'ACT-M-02', actionType: 'ADD_STUDENT', payload: { id: 'S2' } });
  testStore.queueAction({ actionId: 'ACT-M-03', actionType: 'BREAKDOWN_DECLARATION', payload: { busId: 'BUS-03' } });

  const queueCount = testStore.getPendingQueueCount();
  const pendingActions = testStore.getPendingActions();
  const item2 = testStore.getPendingActionById('ACT-M-02');

  const isVisible = queueCount === 3 &&
                    pendingActions.length === 3 &&
                    item2 !== null &&
                    item2.actionId === 'ACT-M-02' &&
                    pendingActions[0].actionId === 'ACT-M-01' &&
                    pendingActions[2].actionId === 'ACT-M-03';

  assert(isVisible, '4. Multiple pending actions: queue maintains FIFO order and fully visible/accessible queue state');
}

// ============================================================================
// 5. DUPLICATE ACTION PREVENTION & IDEMPOTENCY HARDENING
// ============================================================================

// 5A. Same-session duplicate submission
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('online');

  const initialLogCount = testStore.getState().metrics.recentAuditLogs.length;

  // 1. Online same-session duplicate
  const firstOnline = testStore.dispatchAction({
    actionId: 'ACT-SAME-ON-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1001' }
  });
  const dupOnline = testStore.dispatchAction({
    actionId: 'ACT-SAME-ON-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1001' }
  });

  const onlineLogs = testStore.getState().metrics.recentAuditLogs;
  const onlineLogCount = onlineLogs.filter(l => l.event && l.event.includes('ACT-SAME-ON-01')).length;
  const isOnlineDupSuppressed = firstOnline.status === 'EXECUTED' &&
                                dupOnline.isDuplicate === true &&
                                dupOnline.suppressed === true &&
                                onlineLogCount === 1;

  // 2. Offline same-session duplicate
  testStore.setNetworkStatus('offline');
  const firstOffline = testStore.queueAction({
    actionId: 'ACT-SAME-OFF-01',
    actionType: 'BREAKDOWN_DECLARATION',
    payload: { busId: 'BUS-04' }
  });
  const dupOffline = testStore.queueAction({
    actionId: 'ACT-SAME-OFF-01',
    actionType: 'BREAKDOWN_DECLARATION',
    payload: { busId: 'BUS-04' }
  });

  const offlineMatches = testStore.getPendingActions().filter(a => a.actionId === 'ACT-SAME-OFF-01');
  const isOfflineDupSuppressed = offlineMatches.length === 1 && dupOffline.actionId === firstOffline.actionId;

  // 3. Cross-mode duplicate (pending offline action attempted via dispatchAction before network recovery)
  const crossDup = testStore.dispatchAction({
    actionId: 'ACT-SAME-OFF-01',
    actionType: 'BREAKDOWN_DECLARATION',
    payload: { busId: 'BUS-04' }
  });
  const isCrossDupSuppressed = crossDup.actionId === 'ACT-SAME-OFF-01' && testStore.getPendingQueueCount() === 1;

  // 4. After network recovery, attempting to re-dispatch the synced action is suppressed
  testStore.setNetworkStatus('online');
  const postSyncDup = testStore.dispatchAction({
    actionId: 'ACT-SAME-OFF-01',
    actionType: 'BREAKDOWN_DECLARATION',
    payload: { busId: 'BUS-04' }
  });
  const isPostSyncDupSuppressed = postSyncDup.isDuplicate === true && postSyncDup.status === 'ALREADY_SYNCED';

  assert(isOnlineDupSuppressed && isOfflineDupSuppressed && isCrossDupSuppressed && isPostSyncDupSuppressed,
    '5A. Same-session duplicate: suppressed in online, offline, and cross-mode without duplicate logs or queue pollution');
}

// 5B. Reload persistence across page refresh / browser restart
{
  const store1 = createFreshStore();
  store1.setNetworkStatus('online');

  // Online action executed and recorded in localStorage syncedActionIds
  store1.dispatchAction({
    actionId: 'ACT-PERSIST-SYNCED',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1002' }
  });

  // Offline action queued in localStorage pendingOfflineChanges
  store1.setNetworkStatus('offline');
  store1.queueAction({
    actionId: 'ACT-PERSIST-PENDING',
    actionType: 'ADD_STUDENT_EVALUATION',
    payload: { studentName: 'Test Student' }
  });

  // Simulate page refresh / browser restart: instantiate new AppStore WITHOUT clearing localStorage
  const store2 = new AppStore();

  const isSyncedLoaded = store2.isActionSynced('ACT-PERSIST-SYNCED');
  const pendingLoaded = store2.getPendingActionById('ACT-PERSIST-PENDING');

  // Attempt duplicate submission of previously synced action in new store
  const dupSyncedAttempt = store2.dispatchAction({
    actionId: 'ACT-PERSIST-SYNCED',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1002' }
  });

  // Attempt duplicate queueing of previously pending action in new store
  const dupPendingAttempt = store2.queueAction({
    actionId: 'ACT-PERSIST-PENDING',
    actionType: 'ADD_STUDENT_EVALUATION',
    payload: { studentName: 'Test Student' }
  });

  const matchingPending = store2.getPendingActions().filter(a => a.actionId === 'ACT-PERSIST-PENDING');

  const isPersistenceVerified = isSyncedLoaded === true &&
                                pendingLoaded !== null &&
                                dupSyncedAttempt.isDuplicate === true &&
                                dupSyncedAttempt.suppressed === true &&
                                matchingPending.length === 1;

  assert(isPersistenceVerified,
    '5B. Reload persistence: idempotency keys survive page reload/browser restart; re-submissions suppressed');
}

// 5C. Retry duplicate prevention
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({
    actionId: 'ACT-RETRY-DUP-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1003' }
  });

  // Sync fails while offline -> marks item as FAILED
  testStore.syncPendingOfflineChanges();
  const queueBeforeRetry = testStore.getPendingQueueCount();
  const itemBeforeRetry = testStore.getPendingActionById('ACT-RETRY-DUP-01');
  const wasFailedBeforeRetry = itemBeforeRetry && itemBeforeRetry.status === 'FAILED';

  // Retry failed action
  testStore.retryAction('ACT-RETRY-DUP-01');
  const queueAfterRetry = testStore.getPendingQueueCount();

  // Network recovers and sync succeeds
  testStore.setNetworkStatus('online');

  const finalQueue = testStore.getPendingQueueCount();
  const isSyncedNow = testStore.isActionSynced('ACT-RETRY-DUP-01');

  // Attempting to re-dispatch the retried/synced action is suppressed
  const reDispatchAttempt = testStore.dispatchAction({
    actionId: 'ACT-RETRY-DUP-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1003' }
  });

  const isRetryDuplicateSafe = queueBeforeRetry === 1 &&
                               wasFailedBeforeRetry === true &&
                               queueAfterRetry === 1 &&
                               finalQueue === 0 &&
                               isSyncedNow === true &&
                               reDispatchAttempt.isDuplicate === true;

  assert(isRetryDuplicateSafe,
    '5C. Retry duplicate: retrying a failed action does not create a second action, and synced result prevents re-dispatch');
}

// 5D. Network recovery duplicate prevention
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({
    actionId: 'ACT-NET-DUP-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1004' }
  });
  testStore.queueAction({
    actionId: 'ACT-NET-DUP-02',
    actionType: 'ADD_STUDENT_EVALUATION',
    payload: { studentName: 'Student 2' }
  });

  // Network recovers -> auto sync flushes queue
  testStore.setNetworkStatus('online');
  const queueAfterFirstRecovery = testStore.getPendingQueueCount();
  const logsCountAfterFirstRecovery = testStore.getState().metrics.recentAuditLogs.length;

  // Simulate network dropping and recovering again
  testStore.setNetworkStatus('offline');
  testStore.setNetworkStatus('online');

  const queueAfterSecondRecovery = testStore.getPendingQueueCount();
  const logsCountAfterSecondRecovery = testStore.getState().metrics.recentAuditLogs.length;

  // Re-submitting synced action is rejected
  const dupRes = testStore.dispatchAction({
    actionId: 'ACT-NET-DUP-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1004' }
  });

  const isNetworkRecoverySafe = queueAfterFirstRecovery === 0 &&
                                queueAfterSecondRecovery === 0 &&
                                logsCountAfterSecondRecovery === logsCountAfterFirstRecovery &&
                                dupRes.isDuplicate === true &&
                                testStore.isActionSynced('ACT-NET-DUP-01') &&
                                testStore.isActionSynced('ACT-NET-DUP-02');

  assert(isNetworkRecoverySafe,
    '5D. Network recovery duplicate: recovery does not duplicate previously synced actions or generate duplicate audit logs');
}

// 5E. Legitimate distinct actions
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('online');

  const action1 = testStore.dispatchAction({
    actionId: 'ACT-DISTINCT-01',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1005' }
  });
  const action2 = testStore.dispatchAction({
    actionId: 'ACT-DISTINCT-02',
    actionType: 'CANCEL_STUDENT',
    payload: { studentId: 'STU-1006' }
  });
  const action3 = testStore.dispatchAction({
    actionType: 'MANUAL_OVERRIDE',
    payload: { busId: 'BUS-05' }
  });

  const isAllDistinctProcessed = action1.status === 'EXECUTED' && !action1.isDuplicate &&
                                 action2.status === 'EXECUTED' && !action2.isDuplicate &&
                                 action3.status === 'EXECUTED' && !action3.isDuplicate &&
                                 action1.actionId !== action2.actionId &&
                                 action2.actionId !== action3.actionId &&
                                 testStore.isActionSynced('ACT-DISTINCT-01') &&
                                 testStore.isActionSynced('ACT-DISTINCT-02') &&
                                 testStore.isActionSynced(action3.actionId);

  assert(isAllDistinctProcessed,
    '5E. Legitimate distinct actions: distinct action IDs and newly generated action IDs execute normally without false suppression');
}

// ============================================================================
// 6. SYNC FAILURE: ZERO ACTION LOSS & PROPER ERROR RECORDING
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({ actionId: 'ACT-FAIL-01', actionType: 'CANCEL_STUDENT', payload: { id: 'STU-99' } });

  // Attempt sync while network is offline
  const offlineSyncRes = testStore.syncPendingOfflineChanges();

  const itemAfterFailedSync = testStore.getPendingActionById('ACT-FAIL-01');
  const queueLength = testStore.getPendingQueueCount();

  // Verify: Not lost, status FAILED, retryCount incremented, error recorded
  const isCorrectlyHandled = offlineSyncRes.success === false &&
                             offlineSyncRes.failedCount === 1 &&
                             offlineSyncRes.syncedCount === 0 &&
                             queueLength === 1 &&
                             itemAfterFailedSync.status === 'FAILED' &&
                             itemAfterFailedSync.retryCount === 1 &&
                             itemAfterFailedSync.error !== null;

  assert(isCorrectlyHandled, '6. Sync failure: action is not lost, status set to FAILED, error recorded, and retry count incremented');
}

// ============================================================================
// 7. RETRY MECHANISM: RETRY INDIVIDUAL & BATCH FAILED ACTIONS
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({ actionId: 'ACT-RETRY-01', actionType: 'CANCEL_STUDENT', payload: { id: 'STU-88' } });
  testStore.queueAction({ actionId: 'ACT-RETRY-02', actionType: 'ADD_STUDENT', payload: { id: 'STU-89' } });

  // Attempt sync while offline -> marks FAILED
  testStore.syncPendingOfflineChanges();
  const failedItem1 = testStore.getPendingActionById('ACT-RETRY-01');
  const wasFailed = failedItem1.status === 'FAILED';

  // Network recovers
  testStore.setNetworkStatus('online');

  // Trigger individual retry for ACT-RETRY-01
  testStore.retryAction('ACT-RETRY-01');
  const afterFirstRetryCount = testStore.getPendingQueueCount();

  // Trigger batch retry for remaining
  testStore.retryFailedActions();
  const finalQueueCount = testStore.getPendingQueueCount();

  const isOk = wasFailed && finalQueueCount === 0;
  assert(isOk, '7. Retry: failed actions can be retried individually or in batch, successfully synchronizing upon recovery');
}

// ============================================================================
// 8. NETWORK RECOVERY: AUTOMATIC SYNCHRONIZATION
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({ actionId: 'ACT-REC-01', actionType: 'CANCEL_STUDENT', payload: { id: 'STU-01' } });
  testStore.queueAction({ actionId: 'ACT-REC-02', actionType: 'ADD_STUDENT', payload: { id: 'STU-02' } });

  const initialPending = testStore.getPendingQueueCount();

  // Transitioning to 'online' automatically calls syncPendingOfflineChanges()
  testStore.setNetworkStatus('online');

  const finalPending = testStore.getPendingQueueCount();
  const isSynchronized = initialPending === 2 && finalPending === 0 && testStore.getState().networkStatus === 'online';

  assert(isSynchronized, '8. Network recovery: setNetworkStatus(online) automatically synchronizes pending queue');
}

// ============================================================================
// 9. NO FALSE SYNC: STATE & LOGS NEVER REPORT UNSYNCED ACTIONS AS SYNCED
// ============================================================================
{
  const testStore = createFreshStore();
  testStore.setNetworkStatus('offline');

  testStore.queueAction({ actionId: 'ACT-UNSYNC-01', actionType: 'DISPUTE_LOG', payload: { note: 'Unsynced note' } });

  // Simulate sync attempt that fails
  const syncRes = testStore.syncPendingOfflineChanges({ simulateFailure: true });
  const logs = testStore.getState().metrics.recentAuditLogs;
  const item = testStore.getPendingActionById('ACT-UNSYNC-01');

  // Must not have a [SYNCED] log for this action, status must not be SYNCED, syncedCount must be 0
  const hasFalseSyncLog = logs.some(l => l.event && l.event.includes('ACT-UNSYNC-01') && l.event.includes('[SYNCED]'));
  const isNotFalselySynced = syncRes.syncedCount === 0 &&
                             !hasFalseSyncLog &&
                             item.status !== 'SYNCED' &&
                             testStore.getPendingQueueCount() === 1;

  assert(isNotFalselySynced, '9. State integrity: UI/state never falsely reports an unsynced action as synced');
}

// ============================================================================
// 10. LIVE GPS: DISPLAYED AS LIVE ONLY WHEN FRESH (< 60s)
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-01';

  testStore.setBusGpsStatus(busId, 'LIVE');
  const gpsState = testStore.getBusGpsState(busId);
  const bus = testStore.getState().buses.find(b => b.id === busId);

  const isLiveValid = gpsState.statusUpper === 'LIVE' &&
                      gpsState.isLive === true &&
                      gpsState.ageSeconds <= 60 &&
                      gpsState.source === 'live_gps' &&
                      gpsState.warning === null &&
                      gpsState.trustLevel === 'HIGH';

  assert(isLiveValid, '10. LIVE GPS: displayed as live only when data is fresh (< 60s) with high trust');
}

// ============================================================================
// 11. LAST_KNOWN GPS: NEVER DISPLAYED AS LIVE & AGE VISIBLE
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-02';

  testStore.setBusGpsStatus(busId, 'LAST_KNOWN');
  const gpsState = testStore.getBusGpsState(busId);

  const isLastKnownValid = gpsState.statusUpper === 'LAST_KNOWN' &&
                           gpsState.isLive === false &&
                           gpsState.isLastKnown === true &&
                           gpsState.ageSeconds > 60 &&
                           gpsState.reducedTrustInDistance === true &&
                           gpsState.source === 'last_known';

  assert(isLastKnownValid, '11. LAST_KNOWN GPS: never displayed as LIVE, identifies last-known source and displays data age');
}

// ============================================================================
// 12. STALE GPS: NEVER DISPLAYED AS LIVE & REDUCED DISTANCE TRUST
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-03';

  testStore.setBusGpsStatus(busId, 'STALE');
  const gpsState = testStore.getBusGpsState(busId);

  const isStaleValid = gpsState.statusUpper === 'STALE' &&
                       gpsState.isLive === false &&
                       gpsState.isStale === true &&
                       gpsState.ageSeconds > 120 &&
                       gpsState.trustLevel === 'LOW' &&
                       gpsState.reducedTrustInDistance === true &&
                       gpsState.requiresVerification === true;

  assert(isStaleValid, '12. STALE GPS: never displayed as LIVE, triggers low trust level and reduced trust in distance');
}

// ============================================================================
// 13. NO_SIGNAL: USES LAST-KNOWN LOCATION ONLY & DISPLAYS EXPLICIT WARNING
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-04';
  const lastKnownStop = 'Cole & Haight St Waypoint (Last Fix)';

  testStore.setBusGpsStatus(busId, 'NO_SIGNAL', lastKnownStop);
  const gpsState = testStore.getBusGpsState(busId);
  const bus = testStore.getState().buses.find(b => b.id === busId);

  const isNoSignalValid = gpsState.statusUpper === 'NO_SIGNAL' &&
                          gpsState.isLive === false &&
                          gpsState.isNoSignal === true &&
                          gpsState.trustLevel === 'NONE' &&
                          gpsState.warning !== null &&
                          gpsState.requiresVerification === true &&
                          bus.lastKnownLocation === lastKnownStop;

  assert(isNoSignalValid, '13. NO_SIGNAL: clearly shows NO_SIGNAL, uses last-known location only, and displays warning');
}

// ============================================================================
// 14. MANUAL LOCATION: CLEARLY IDENTIFIES SOURCE AS MANUAL
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-05';
  const newCoords = [37.7725, -122.4310];
  const checkpointName = 'Civic Center Checkpoint (Radio Confirmed)';

  testStore.updateBusLocationManually(busId, newCoords, checkpointName, 'Driver VHF radio check-in');
  const gpsState = testStore.getBusGpsState(busId);
  const bus = testStore.getState().buses.find(b => b.id === busId);

  const isManualValid = gpsState.statusUpper === 'MANUAL' &&
                        gpsState.isLive === false &&
                        gpsState.isManual === true &&
                        gpsState.source === 'manual_dispatcher' &&
                        bus.source === 'manual_dispatcher' &&
                        bus.isManualLocation === true &&
                        bus.coords[0] === newCoords[0] &&
                        bus.coords[1] === newCoords[1] &&
                        bus.lastKnownLocation === checkpointName;

  assert(isManualValid, '14. MANUAL location: clearly identifies source as MANUAL / manual_dispatcher and updates coordinates');
}

// ============================================================================
// 15. GPS AGE CALCULATION & COMPLETE 5-FIELD TELEMATICS STORAGE
// ============================================================================
{
  const testStore = createFreshStore();
  const bus = testStore.getState().buses[0];

  // Set mock sync timestamp 95 seconds ago
  bus._lastGpsSyncTimeMs = Date.now() - 95000;
  bus.gpsStatus = 'live';

  const gpsState = testStore.getBusGpsState(bus.id);

  const isAgeValid = gpsState.ageSeconds >= 94 &&
                     gpsState.ageSeconds <= 96 &&
                     // Since 95s > 60s, live status is automatically degraded to LAST_KNOWN!
                     gpsState.isLive === false &&
                     gpsState.statusUpper === 'LAST_KNOWN' &&
                     typeof gpsState.latitude === 'number' &&
                     typeof gpsState.longitude === 'number' &&
                     typeof gpsState.source === 'string' &&
                     typeof gpsState.lastUpdated === 'string' &&
                     typeof gpsState.ageSeconds === 'number';

  assert(isAgeValid, '15. GPS age calculation: accurately calculates ageSeconds and stores all 5 required fields');
}

// ============================================================================
// 16. STALE GPS WARNING & DISPATCHER VERIFICATION ENFORCEMENT
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-03';

  testStore.setBusGpsStatus(busId, 'STALE');
  const gpsState = testStore.getBusGpsState(busId);

  const isWarningValid = gpsState.warning !== null &&
                         gpsState.warning.includes('stale') &&
                         gpsState.requiresVerification === true &&
                         gpsState.reducedTrustInDistance === true;

  assert(isWarningValid, '16. Stale GPS warning: displays warning alert and requires dispatcher verification');
}

// ============================================================================
// 17. MANUAL LOCATION FALLBACK WORKFLOW
// ============================================================================
{
  const testStore = createFreshStore();
  const busId = 'BUS-02';

  // Step 1: Bus loses signal
  testStore.setBusGpsStatus(busId, 'NO_SIGNAL', 'Market & 6th St (Signal Lost)');
  const beforeState = testStore.getBusGpsState(busId);

  // Step 2: Dispatcher performs manual location fallback
  testStore.updateBusLocationManually(busId, [37.7780, -122.4170], 'Civic Center Checkpoint (Manual Fallback)');
  const afterState = testStore.getBusGpsState(busId);
  const auditLogs = testStore.getState().metrics.recentAuditLogs;

  const isFallbackSuccess = beforeState.isNoSignal === true &&
                            afterState.isManual === true &&
                            afterState.source === 'manual_dispatcher' &&
                            afterState.ageSeconds === 0 &&
                            auditLogs.some(e => e.status === 'MANUAL_GPS_OVERRIDE' && e.details?.busId === busId);

  assert(isFallbackSuccess, '17. Manual location fallback: dispatcher override successfully recovers position and logs audit event');
}

console.log('------------------------------------------------------------------------');
console.log(`Store-and-Forward & GPS Tests Summary: ${passedTests}/${totalTests} Passed (${((passedTests / totalTests) * 100).toFixed(0)}%).`);
console.log('------------------------------------------------------------------------\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  console.log('ALL 17 STORE-AND-FORWARD & GPS HARDENED TESTS PASSED (100% SUCCESS).');
}
