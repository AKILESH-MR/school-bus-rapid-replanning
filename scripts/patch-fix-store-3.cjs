const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const pos = disruption.aiRecommendation?.insertionPosition') && i < 1000) {
    // found it in handleVehicleBreakdown! (which is < line 1000)
    // we want to remove this line and the next 4 lines
    lines.splice(i, 5);
    break;
  }
}
fs.writeFileSync('src/state/store.js', lines.join('\\n'));
console.log("Patched correctly with array splice");
