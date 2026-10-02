const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /if\s*\(typeof process === 'undefined' \|\| process\.env\.NODE_ENV !== 'test'\)\s*\{/;
if (regex.test(code)) {
  code = code.replace(regex, 'if (typeof global.window !== "undefined" && global.window.location && global.window.location.hostname !== "") {');
  fs.writeFileSync('src/state/store.js', code);
  console.log("Patched successfully!");
} else {
  console.log("Regex did not match!");
}
