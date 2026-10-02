const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// 1. Fix getBusGpsState age mock
code = code.replace(/bus\.gpsStatus === 'live' \? 10 : 300/, "bus.gpsStatus.toLowerCase() === 'live' ? 10 : 300");

// 2. Fix queueAction duplicate return
code = code.replace(/console\.warn\(\`Duplicate action suppressed \(already synced\): \$\{actionId\}\`\);\n      return \{ status: 'ALREADY_SYNCED' \};/, 
  "console.warn(`Duplicate action suppressed (already synced): ${actionId}`);\n      return { isDuplicate: true, suppressed: true, status: 'ALREADY_SYNCED', actionId };");

code = code.replace(/console\.warn\(\`Duplicate action suppressed \(already pending\): \$\{actionId\}\`\);\n      return existing;/,
  "console.warn(`Duplicate action suppressed (already pending): ${actionId}`);\n      return { ...existing, isDuplicate: true, suppressed: true, actionId };");

// 3. Fix dispatchAction duplicate return
code = code.replace(/console\.warn\(\`Duplicate action suppressed: \$\{actionId\}\`\);\n      return \{ status: 'ALREADY_SYNCED' \};/,
  "console.warn(`Duplicate action suppressed: ${actionId}`);\n      return { isDuplicate: true, suppressed: true, status: 'ALREADY_SYNCED', actionId };");

code = code.replace(/console\.warn\(\`Duplicate action suppressed \(already pending\): \$\{actionId\}\`\);\n      return existing;/,
  "console.warn(`Duplicate action suppressed (already pending): ${actionId}`);\n      return { ...existing, isDuplicate: true, suppressed: true, actionId };");

// 4. Add missing retryFailedActions and fix retryAction
const retryMethods = `
  retryAction(actionId) {
    const action = this.getPendingActionById(actionId);
    if (!action) return;
    action.status = 'PENDING';
    action.retryCount = (action.retryCount || 0) + 1;
    action.lastAttempt = new Date().toISOString();
    this.savePendingOfflineChanges();
    if (this.state.networkStatus === 'online') this.syncPendingOfflineChanges();
  }

  retryFailedActions() {
    let anyRetried = false;
    this.state.pendingOfflineChanges.forEach(a => {
      if (a.status === 'FAILED') {
        a.status = 'PENDING';
        a.retryCount = (a.retryCount || 0) + 1;
        a.lastAttempt = new Date().toISOString();
        anyRetried = true;
      }
    });
    if (anyRetried) {
      this.savePendingOfflineChanges();
      if (this.state.networkStatus === 'online') this.syncPendingOfflineChanges();
    }
  }
`;
code = code.replace(/  retryAction\(actionId\) \{[\s\S]*?  \}/, retryMethods);

// 5. Fix updateBusLocationManually to include details: { busId }
code = code.replace(/status: 'MANUAL_GPS_OVERRIDE'\n    \}\);/, "status: 'MANUAL_GPS_OVERRIDE',\n      details: { busId }\n    });");

// 6. Support simulateFailure in syncPendingOfflineChanges
code = code.replace(/const \{ force = false \} = options;/, "const { force = false, simulateFailure = false } = options;");
code = code.replace(/if \(this\.state\.networkStatus !== 'online' && !force\) \{/, "if ((this.state.networkStatus !== 'online' && !force) || simulateFailure) {");

fs.writeFileSync('src/state/store.js', code);
console.log('Applied multiple fixes to store.js!');
