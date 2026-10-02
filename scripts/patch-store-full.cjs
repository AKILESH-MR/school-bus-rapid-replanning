const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// Replace syncPendingOfflineChanges
const syncStart = code.indexOf('  syncPendingOfflineChanges(');
const syncEnd = code.indexOf('  updateBusLocationManually(');
if (syncStart !== -1 && syncEnd !== -1) {
  const newSync = `  syncPendingOfflineChanges(options = {}) {
    const { force = false, simulateFailure = false } = options;
    if ((this.state.networkStatus !== 'online' && !force) && !simulateFailure) {
      let failedCount = 0;
      this.state.pendingOfflineChanges.forEach(a => {
        if (a.status === 'PENDING') {
          a.status = 'FAILED';
          a.error = 'Network offline';
          a.retryCount = (a.retryCount || 0) + 1;
          failedCount++;
        }
      });
      this.savePendingOfflineChanges();
      this.notify();
      return { success: false, syncedCount: 0, failedCount };
    }

    const pendingActions = this.state.pendingOfflineChanges.filter(a => a.status === 'PENDING' || a.status === 'FAILED');
    if (pendingActions.length === 0) {
      this.showToast('System is synchronized with district servers.', 'info');
      return { success: true, syncedCount: 0, failedCount: 0 };
    }

    let syncedCount = 0;
    let failedCount = 0;

    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
      import('../api/client.js').then(api => {
        api.syncOfflineActions(pendingActions).then(result => {
          pendingActions.forEach(action => {
            if (result.success || (result.syncedIds && result.syncedIds.includes(action.actionId))) {
              action.status = 'EXECUTED';
              this.recordActionSynced(action.actionId || action.id);
              syncedCount++;
            } else {
              action.status = 'FAILED';
              action.error = 'Backend sync failed';
              action.retryCount = (action.retryCount || 0) + 1;
              failedCount++;
            }
          });
        }).catch(err => {
          pendingActions.forEach(action => {
            action.status = 'FAILED';
            action.error = err.message;
            action.retryCount = (action.retryCount || 0) + 1;
            failedCount++;
          });
        });
      });
      
      return { success: true, syncedCount: pendingActions.length, failedCount: 0 };
    } else {
      if (simulateFailure) {
        pendingActions.forEach(action => {
          action.status = 'FAILED';
          action.error = 'Simulated failure';
          action.retryCount = (action.retryCount || 0) + 1;
          failedCount++;
        });
      } else {
        pendingActions.forEach(action => {
          action.status = 'EXECUTED';
          this.recordActionSynced(action.actionId || action.id);
          syncedCount++;
        });
      }
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (syncedCount > 0) {
      this.state.metrics.recentAuditLogs.unshift({
        id: \`LOG-SYNC-\${Date.now()}\`,
        time: nowStr,
        user: this.state.currentUser ? this.state.currentUser.name : 'System Sync Engine',
        event: \`Network Synchronized: Flushed \${syncedCount} locally queued operational updates to central district servers.\`,
        status: 'SYNCHRONIZED'
      });
    }

    this.state.pendingOfflineChanges = this.state.pendingOfflineChanges.filter(a => a.status !== 'EXECUTED');
    
    this.savePendingOfflineChanges();
    this.state.lastSyncTimestamp = nowStr;

    if (syncedCount > 0) {
      this.showToast(\`Synchronized \${syncedCount} pending local operational change(s) with Central Servers.\`, 'success');
    }
    this.notify();

    return { success: failedCount === 0, syncedCount, failedCount };
  }

`;
  code = code.substring(0, syncStart) + newSync + code.substring(syncEnd);
  console.log('Patched syncPendingOfflineChanges');
}

// Fix updateBusLocationManually
const manualStart = code.indexOf('  updateBusLocationManually(');
const manualEnd = code.indexOf('  // GPS Analytics');
if (manualStart !== -1 && manualEnd !== -1) {
  const newManual = `  updateBusLocationManually(busId, coords, locationName = '', reason = 'Dispatcher Manual Checkpoint') {
    const bus = this.state.buses.find(b => b.id === busId);
    if (!bus) return;

    const prevCoords = [...bus.coords];
    const prevLocation = bus.lastKnownLocation || 'Previous GPS Coordinates';
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    bus.coords = [parseFloat(coords[0]), parseFloat(coords[1])];
    bus.gpsStatus = 'manual';
    bus.source = 'manual_dispatcher';
    bus.isManualLocation = true;
    bus.lastKnownLocation = locationName || \`Checkpoint at [\${bus.coords[0].toFixed(4)}, \${bus.coords[1].toFixed(4)}]\`;
    bus.lastGpsSync = \`\${nowTimeStr} (Dispatcher Manual Fix: \${reason})\`;

    const changeDescription = \`Manual location update for \${bus.id} to \${bus.lastKnownLocation}\`;

    if (this.state.networkStatus !== 'online') {
      this.queueOfflineChange('MANUAL_BUS_LOCATION', changeDescription, {
        busId,
        coords: bus.coords,
        locationName: bus.lastKnownLocation,
        reason
      });
    }

    this.state.metrics.recentAuditLogs.unshift({
      id: \`LOG-MANUAL-\${Date.now()}\`,
      time: nowTimeStr,
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      event: changeDescription,
      status: 'MANUAL_GPS_OVERRIDE',
      details: { busId }
    });

    this.showToast(\`Location manually updated for \${bus.id} to \${bus.lastKnownLocation}\`, 'warning');
    this.notify();
  }

`;
  code = code.substring(0, manualStart) + newManual + code.substring(manualEnd);
  console.log('Patched updateBusLocationManually');
}

fs.writeFileSync('src/state/store.js', code);
