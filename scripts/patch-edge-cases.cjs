const fs = require('fs');
let code = fs.readFileSync('src/utils/replanningEdgeCaseTests.js', 'utf8');

code = code.replace(
  "const passed = isOffline && isQueued && isOnline && isQueueFlushed;",
  "const passed = isOffline && isQueued && isOnline && isQueueFlushed; if (!passed) console.log('DEBUG TEST 7:', { isOffline, isQueued, isOnline, isQueueFlushed, pending: testStore.getState().pendingOfflineChanges });"
);

fs.writeFileSync('src/utils/replanningEdgeCaseTests.js', code);
console.log("Patched replanning test!");
