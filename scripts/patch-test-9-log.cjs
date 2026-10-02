const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /    \/\/ Log\r?\n    this\.state\.metrics\.recentAuditLogs\.unshift\(\{/;
const repl = `    // Log
    const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? 0;
    this.state.auditEvents.push({
      action: 'RECOMMENDATION_ACCEPTED',
      disruptionId,
      selectedPlan: { appliedInsertionPosition: pos }
    });
    this.state.metrics.recentAuditLogs.unshift({`;

code = code.replace(regex, repl);
fs.writeFileSync('src/state/store.js', code);
console.log("Patched acceptAIPlan log");
