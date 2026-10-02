const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const newMethod = `
  recalculateModifiedConstraints(disruptionId, constraints) {
    const disruption = this.state.disruptions.find(d => d.id === disruptionId);
    if (!disruption) return null;

    let candidates = (disruption.aiRecommendation && disruption.aiRecommendation.candidateEvaluations) 
      ? [...disruption.aiRecommendation.candidateEvaluations] 
      : [];
      
    // Re-evaluate candidates based on new constraints
    if (constraints.maxAllowedDelay !== undefined) {
      candidates.forEach(c => {
        if (c.delayMins > constraints.maxAllowedDelay) {
          c.isFeasible = false;
          c.statusText = \`Exceeds \${constraints.maxAllowedDelay}m delay limit\`;
        }
      });
    }

    if (constraints.preferredBusId && constraints.preferredBusId !== 'ANY') {
      const preferred = candidates.find(c => c.busId === constraints.preferredBusId);
      if (preferred) {
        preferred.isFeasible = true;
        preferred.statusText = 'Dispatcher Preferred Vehicle';
        candidates = [preferred, ...candidates.filter(c => c.busId !== constraints.preferredBusId)];
      }
    }

    const feasibleCandidates = candidates.filter(c => c.isFeasible);
    
    const recalculatedResult = {
      feasibleCandidates
    };

    if (feasibleCandidates.length > 0) {
      const best = feasibleCandidates[0];
      disruption.aiRecommendation = {
        ...disruption.aiRecommendation,
        candidateEvaluations: candidates,
        recommendedBusId: best.busId,
        recommendedRouteId: best.routeId,
        estRecoveryTimeMins: best.delayMins || 0
      };
    } else {
      disruption.aiRecommendation = {
        ...disruption.aiRecommendation,
        candidateEvaluations: candidates,
        recommendedBusId: null,
        recommendedRouteId: null,
        statusText: 'No Feasible Solution Found'
      };
    }
    
    this.showToast('Constraints modified and plan recalculated', 'info');
    this.notify();
    
    return {
      recalculatedResult,
      newAiRecommendation: disruption.aiRecommendation
    };
  }
`;

// Insert it before rejectAIPlan
code = code.replace('  rejectAIPlan(disruptionId, reason = "Manual Route Override") {', newMethod + '\n  rejectAIPlan(disruptionId, reason = "Manual Route Override") {');
fs.writeFileSync('src/state/store.js', code);
console.log("Added recalculateModifiedConstraints!");
