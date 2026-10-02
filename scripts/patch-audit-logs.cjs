const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /getAuditEvents\(\) \{/;

const newMethods = `
  logRecommendationGenerated(disruptionId, recommendation) {
    const log = { action: 'RECOMMENDATION_GENERATED', disruptionId, recommendation, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }
  logRecommendationAccepted(disruptionId, recommendation) {
    const log = { action: 'RECOMMENDATION_ACCEPTED', disruptionId, recommendation, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }
  logRecommendationModified(recommendation, constraints, newSelection) {
    const log = { action: 'RECOMMENDATION_MODIFIED', recommendation, constraints, newSelection, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }
  logRecommendationRejected(disruptionId, reason) {
    const log = { action: 'RECOMMENDATION_REJECTED', disruptionId, reason, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }
  logManualOverride(overrideType, details) {
    const log = { action: 'MANUAL_OVERRIDE', overrideType, details, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }
  logFallbackTriggered(fallbackType, details) {
    const log = { action: 'FALLBACK_TRIGGERED', fallbackType, details, timestamp: Date.now() };
    if (!this.state.auditEvents) this.state.auditEvents = [];
    this.state.auditEvents.push(log);
    return log;
  }

  getAuditEvents() {`;

code = code.replace(regex, newMethods);
fs.writeFileSync('src/state/store.js', code);
console.log("Patched audit log methods!");
