const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /const changeItem = \{[\s\S]*?payload\s*\};/;
const repl = `const changeItem = {
      id: \`SYNC-\${Date.now()}-\${Math.floor(Math.random() * 1000)}\`,
      actionId: \`SYNC-\${Date.now()}-\${Math.floor(Math.random() * 1000)}\`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: this.state.currentUser ? this.state.currentUser.name : 'Dispatcher',
      actionType,
      description,
      payload,
      status: 'PENDING'
    };`;

code = code.replace(regex, repl);
fs.writeFileSync('src/state/store.js', code);
console.log("Patched queueOfflineChange!");
