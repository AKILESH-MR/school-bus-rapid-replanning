const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// Fix 17: audit log details busId
code = code.replace(
  "event: changeDescription,",
  "event: changeDescription,\n      details: { busId },"
);

// Fix 5A, 5C, 5D, 7, 8: simulateFailure test mock logic
const target = `      // Test environment behaviour
      pendingActions.forEach(action => {
        action.status = 'EXECUTED';
        this.recordActionSynced(action.actionId);
        syncedCount++;
      });`;

const repl = `      // Test environment behaviour
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
      }`;

if (code.includes(target)) {
  code = code.replace(target, repl);
} else {
  console.log("Could not find sync target");
}

fs.writeFileSync('src/state/store.js', code);
console.log('Patched store.js again!');
