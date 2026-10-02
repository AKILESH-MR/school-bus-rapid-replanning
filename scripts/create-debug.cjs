const fs = require('fs');
let code = fs.readFileSync('tests/storeAndForwardGps.test.js', 'utf8');

code = code.replace(/assert\(isOnlineDupSuppressed && isOfflineDupSuppressed && isCrossDupSuppressed && isPostSyncDupSuppressed,/, "console.log('5A results:', { isOnlineDupSuppressed, isOfflineDupSuppressed, isCrossDupSuppressed, isPostSyncDupSuppressed });\n  $&");

fs.writeFileSync('tests/storeAndForwardGps-debug.test.js', code);
console.log('Created debug test!');
