const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /before: \{ bus: 'a', route: 'b', capacity: 10, delay: 0 \}/;
const repl = `before: { bus: 'a', route: 'b', capacity: 10, delay: 1 }`;

code = code.replace(regex, repl);
fs.writeFileSync('src/state/store.js', code);
console.log("Patched zero delay issue!");
