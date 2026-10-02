const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /\} else \{\s+\/\/ Test environment behaviour[\s\S]*?syncedCount\+\+;\s+\}\);\s+\}/;

const repl = `} else {
      // Test environment behaviour
      if (options && options.simulateFailure) {
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
      }
    }`;

if (regex.test(code)) {
  code = code.replace(regex, repl);
  fs.writeFileSync('src/state/store.js', code);
  console.log("Patched successfully!");
} else {
  console.log("Regex failed to match!");
}
