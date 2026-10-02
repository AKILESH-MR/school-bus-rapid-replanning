const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// Fix handleVehicleBreakdown (lines 934-939)
const badInjectRegex = /    const pos = disruption\.aiRecommendation\?\.insertionPosition \?\? disruption\.aiRecommendation\?\.greedyInsertionPosition \?\? 0;\r?\n    this\.state\.auditEvents\.push\(\{\r?\n      action: 'RECOMMENDATION_ACCEPTED',\r?\n      disruptionId,\r?\n      selectedPlan: \{ appliedInsertionPosition: pos \}\r?\n    \}\);\r?\n/;
code = code.replace(badInjectRegex, '');

// Now we need to carefully inject into acceptAIPlan ONLY
// acceptAIPlan starts around line 1475.
// Let's find "acceptAIPlan(disruptionId) {" and replace from there to the end of the method
// Actually, it's easier to find the specific log inside acceptAIPlan:
// "Accepted AI Replanning Plan ${disruption.aiRecommendation?.planId}"
const acceptAILogRegex = /    \/\/ Log\r?\n    this\.state\.metrics\.recentAuditLogs\.unshift\(\{\r?\n      id: `LOG-\$\{Math\.floor\(600 \+ Math\.random\(\) \* 300\)\}`,/;
code = code.replace(acceptAILogRegex, `    // Log
    const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? 0;
    this.state.auditEvents.push({
      action: 'RECOMMENDATION_ACCEPTED',
      disruptionId,
      selectedPlan: { appliedInsertionPosition: pos }
    });
    this.state.metrics.recentAuditLogs.unshift({
      id: \`LOG-\${Math.floor(600 + Math.random() * 300)}\`,`);

fs.writeFileSync('src/state/store.js', code);
console.log("Patched correctly");
