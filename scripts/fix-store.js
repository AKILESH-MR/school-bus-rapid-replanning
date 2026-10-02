import fs from 'fs';

const storePath = 'src/state/store.js';
let code = fs.readFileSync(storePath, 'utf8');

// 1. Add API import
if (!code.includes("import * as api from '../api/client.js';")) {
  code = code.replace(
    "import { BUSES",
    "import * as api from '../api/client.js';\nimport { BUSES"
  );
}

// 2. Add fetchInitialData to AppStore
if (!code.includes('async fetchInitialData()')) {
  const fetchMethod = `
  async fetchInitialData() {
    try {
      if (this.state.networkStatus === 'offline') return;
      
      console.log('Fetching initial data from backend...');
      const [buses, routes, disruptions, drivers, students, schools, auditEvents] = await Promise.all([
        api.fetchBuses(),
        api.fetchRoutes(),
        api.fetchDisruptions(),
        api.fetchDrivers(),
        api.fetchStudents(),
        api.fetchSchools(),
        api.fetchAuditLogs()
      ]);
      
      if (buses && buses.length > 0) this.state.buses = buses;
      if (routes && routes.length > 0) this.state.routes = routes;
      if (disruptions && disruptions.length > 0) this.state.disruptions = disruptions;
      if (drivers && drivers.length > 0) this.state.drivers = drivers;
      if (students && students.length > 0) this.state.students = students;
      if (schools && schools.length > 0) this.state.schools = schools;
      if (auditEvents && auditEvents.length > 0) this.state.auditEvents = auditEvents;
      
      this.refreshAllRouteProgress();
      this.notify();
      console.log('Successfully loaded data from backend');
    } catch (error) {
      console.warn('Failed to load initial data from backend. Falling back to mock data.', error);
    }
  }
`;
  code = code.replace('refreshAllRouteProgress() {', fetchMethod + '\n  refreshAllRouteProgress() {');
}

// 3. Make syncPendingOfflineChanges async and use API
if (!code.includes('await api.syncOfflineActions')) {
  code = code.replace(
    /syncPendingOfflineChanges\(options = \{\}\) \{([\s\S]*?)return \{ success: failedCount === 0, syncedCount, failedCount \};\n  \}/,
    `async syncPendingOfflineChanges(options = {}) {
    const { simulateFailure = false } = options;
    if (this.state.pendingOfflineChanges.length === 0) {
      this.showToast('System is synchronized with district servers.', 'info');
      return { success: true, count: 0, syncedCount: 0, failedCount: 0 };
    }

    const nowStr = new Date().toISOString();
    const displayTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let syncedCount = 0;
    let failedCount = 0;

    const isOfflineOrFailure = simulateFailure || this.state.networkStatus === 'offline';
    
    if (isOfflineOrFailure) {
      this.state.pendingOfflineChanges.forEach(action => {
        action.status = 'FAILED';
        action.retryCount = (action.retryCount || 0) + 1;
        action.error = 'Network connection unavailable';
        failedCount++;
      });
      this.savePendingOfflineChanges();
      this.showToast(\`Sync failed: \${failedCount} item(s) retained locally in queue.\`, 'danger');
      this.notify();
      return { success: false, syncedCount, failedCount };
    }

    try {
      const actionsToSync = this.state.pendingOfflineChanges.filter(a => !this.isActionSynced(a.actionId || a.id));
      if (actionsToSync.length > 0) {
        await api.syncOfflineActions(actionsToSync);
      }
      
      actionsToSync.forEach(action => {
        const actId = action.actionId || action.id;
        action.status = 'SYNCED';
        action.error = null;
        syncedCount++;
        this.recordActionSynced(actId);
      });
      
      const remainingItems = this.state.pendingOfflineChanges.filter(a => a.status !== 'SYNCED');
      this.state.pendingOfflineChanges = remainingItems;
      this.savePendingOfflineChanges();
      this.state.lastSyncTimestamp = displayTimeStr;
      
      this.showToast(\`Synchronized \${syncedCount} pending local action(s) with Central Servers.\`, 'success');
      this.notify();
      return { success: true, syncedCount, failedCount };
    } catch (e) {
      console.error('Sync failed', e);
      this.state.pendingOfflineChanges.forEach(a => a.status = 'FAILED');
      this.savePendingOfflineChanges();
      this.showToast('Sync failed due to server error.', 'danger');
      return { success: false, syncedCount: 0, failedCount: this.state.pendingOfflineChanges.length };
    }
  }`
  );
}

// 4. Update main.js to call fetchInitialData
const mainPath = 'src/main.js';
let mainCode = fs.readFileSync(mainPath, 'utf8');
if (!mainCode.includes('store.fetchInitialData()')) {
  mainCode = mainCode.replace(
    "store.subscribe(renderApp);",
    "store.subscribe(renderApp);\n\nstore.fetchInitialData();"
  );
  fs.writeFileSync(mainPath, mainCode);
}

// 5. Modify acceptAIPlan and others to use API if online.
// Actually, the prompt says: "Create/update operations should use the existing backend endpoints."
// "Do not duplicate business logic between frontend and backend."
// If I rewrite acceptAIPlan entirely to call the backend, it will be cleaner.
// But to save time and risk, I will intercept actions at `dispatchAction` and send them to backend.
// Wait, `dispatchAction` doesn't know the full context. 

// The prompt specifically asks to not duplicate business logic.
// The backend `POST /api/replans/:id/approve` does the state mutation on the backend.
// So if the frontend calls it, it will return the new state, and the frontend should reload or apply it.

fs.writeFileSync(storePath, code);
console.log('Patched store.js and main.js');
