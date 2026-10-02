const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

code = code.replace(
  "    bus.isManualLocation = true;",
  "    bus.isManualLocation = true;\n    bus._lastGpsSyncTimeMs = Date.now();"
);

code = code.replace(
  "      status: 'MANUAL_GPS_OVERRIDE'\r\n    });",
  "      status: 'MANUAL_GPS_OVERRIDE',\n      details: { busId }\n    });"
);

code = code.replace(
  "      status: 'MANUAL_GPS_OVERRIDE'\n    });",
  "      status: 'MANUAL_GPS_OVERRIDE',\n      details: { busId }\n    });"
);

fs.writeFileSync('src/state/store.js', code);
console.log("Patched!");
