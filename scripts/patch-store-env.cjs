const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

code = code.replace(
  "    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {",
  "    if (typeof window !== 'undefined' && window.location && window.location.hostname !== '') {"
);

fs.writeFileSync('src/state/store.js', code);
console.log("Patched test environment check!");
