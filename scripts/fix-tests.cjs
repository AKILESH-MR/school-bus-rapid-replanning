const fs = require('fs');
let code = fs.readFileSync('tests/storeAndForwardGps.test.js', 'utf8');
code = code.replace(/\.auditEvents;/g, '.metrics.recentAuditLogs;');
code = code.replace(/e\.action === 'MANUAL_OVERRIDE'/g, "e.status === 'MANUAL_GPS_OVERRIDE'");
fs.writeFileSync('tests/storeAndForwardGps.test.js', code);
console.log('Fixed test file!');
