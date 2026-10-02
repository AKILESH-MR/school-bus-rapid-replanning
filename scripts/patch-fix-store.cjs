const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

// Fix dispatchAction if it has the wrong log
if (code.includes("const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? 0;") && code.indexOf("const pos =") < 5000) {
  // it was injected in dispatchAction
  const badInjectionRegex = /const pos = disruption\.aiRecommendation\?\.insertionPosition \?\? disruption\.aiRecommendation\?\.greedyInsertionPosition \?\? 0;\s*this\.state\.auditEvents\.push\(\{\s*action: 'RECOMMENDATION_ACCEPTED',\s*disruptionId,\s*selectedPlan: \{ appliedInsertionPosition: pos \}\s*\}\);\s*/;
  code = code.replace(badInjectionRegex, '');
}

// Inject into acceptAIPlan
const acceptLogRegex = /(    \/\/ Log\r?\n)(    this\.state\.metrics\.recentAuditLogs\.unshift\(\{)/;
code = code.replace(acceptLogRegex, `$1    const pos = disruption.aiRecommendation?.insertionPosition ?? disruption.aiRecommendation?.greedyInsertionPosition ?? 0;
    this.state.auditEvents.push({
      action: 'RECOMMENDATION_ACCEPTED',
      disruptionId,
      selectedPlan: { appliedInsertionPosition: pos }
    });
$2`);

fs.writeFileSync('src/state/store.js', code);
console.log("Fully patched store!");
