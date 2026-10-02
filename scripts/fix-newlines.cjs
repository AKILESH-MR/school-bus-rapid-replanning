const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

code = code.replace(/\\n\\n  \/\/ GPS Failure & Manual Location Update/g, '\n\n  // GPS Failure & Manual Location Update');
code = code.replace(/\\n  queueOfflineChange/g, '\n  queueOfflineChange');

fs.writeFileSync('src/state/store.js', code);
console.log('Fixed literal newlines!');
