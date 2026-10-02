const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// Fix 1: bus.source = 'manual_dispatcher'
code = code.replace(
  "bus.gpsStatus = 'manual';",
  "bus.gpsStatus = 'manual';\n    bus.source = 'manual_dispatcher';"
);

// Fix 2: Add simulateFailure check inside syncPendingOfflineChanges
code = code.replace(
  /\/\/ Test environment behaviour\s+pendingActions\.forEach\(action => \{\s+action\.status = 'EXECUTED';\s+this\.recordActionSynced\(action\.actionId\);\s+syncedCount\+\+;\s+\}\);/g,
  `// Test environment behaviour
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
          this.recordActionSynced(action.actionId);
          syncedCount++;
        });
      }`
);

fs.writeFileSync('src/state/store.js', code);
console.log('Patched store.js!');
