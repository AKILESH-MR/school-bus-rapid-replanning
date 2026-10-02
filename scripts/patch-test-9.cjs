const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// 1. Initialize auditEvents in constructor
const ctorRegex = /buses: JSON\.parse\(JSON\.stringify\(BUSES\)\),/;
code = code.replace(ctorRegex, 'auditEvents: [],\n      buses: JSON.parse(JSON.stringify(BUSES)),');

// 2. Patch acceptAIPlan to log to auditEvents and use insertionPosition
const acceptRegex = /route\.stops\.splice\(Math\.max\(0, route\.stops\.length - 1\), 0, newStop\);/;
const acceptRepl = `
        const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? Math.max(0, route.stops.length - 1);
        route.stops.splice(pos, 0, newStop);
`;
code = code.replace(acceptRegex, acceptRepl);

// 3. Log RECOMMENDATION_ACCEPTED in acceptAIPlan
const logRegex = /this\.state\.metrics\.recentAuditLogs\.unshift\(\{/;
const logRepl = `
    const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? 0;
    this.state.auditEvents.push({
      action: 'RECOMMENDATION_ACCEPTED',
      disruptionId,
      selectedPlan: { appliedInsertionPosition: pos }
    });
    this.state.metrics.recentAuditLogs.unshift({
`;
code = code.replace(logRegex, logRepl);

fs.writeFileSync('src/state/store.js', code);
console.log("Patched test 9!");
