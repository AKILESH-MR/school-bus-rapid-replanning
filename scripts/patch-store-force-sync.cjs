const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

code = code.replace(
  "    if (typeof window !== 'undefined' && window.location && window.location.hostname !== '') {",
  "    if (false) {"
);

fs.writeFileSync('src/state/store.js', code);
console.log("Patched to ALWAYS use sync for testing");
