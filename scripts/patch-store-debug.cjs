const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /\} else \{\s+if \(simulateFailure\) \{[\s\S]*?syncedCount\+\+;\s+\}\);\s+\}/;

const repl = `} else {
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
          console.log("SYNCING", action.actionId || action.id);
          this.recordActionSynced(action.actionId || action.id);
          syncedCount++;
        });
      }
    }`;

if (regex.test(code)) {
  code = code.replace(regex, repl);
  fs.writeFileSync('src/state/store.js', code);
  console.log("Added console log to store!");
} else {
  console.log("Regex failed to match! " + (code.includes('if (simulateFailure)') ? "Found simulateFailure" : "Did not find simulateFailure"));
}
