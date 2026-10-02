// Node Test Runner for Replanning Evaluation & Baseline Benchmarking
import assert from 'assert';
import { runEvaluation } from '../src/utils/evaluation.js';

console.log('==============================================================================================================');
console.log('  DISTRICT TRANSPORT RAPID REPLANNING: BENCHMARKING & EVALUATION MODULE');
console.log('  (Simulated Manual Baseline vs Rapid Replanning Engine)');
console.log('==============================================================================================================\n');

// 1. Run evaluation benchmark suite
const evalData = runEvaluation({ deterministic: true });
const results = evalData.results;
const metrics = evalData.metrics;

console.log(`BENCHMARK SUMMARY TABLE:`);
console.log(`---------------------------------------------------------------------------------------------------------------------------------------`);
console.log(`Scenario                          | Scenario ID | Disruption Type      | Simulated Baseline | Engine Time | Review | E2E Time | Target | Violations | Status`);
console.log(`---------------------------------------------------------------------------------------------------------------------------------------`);

results.forEach((t) => {
  const nameStr = t.scenarioName.padEnd(33, ' ');
  const idStr = t.scenarioId.padEnd(11, ' ');
  const typeStr = t.disruptionType.padEnd(20, ' ');
  const baselineStr = `${t.baselineTimeSeconds.toFixed(1)}s`.padStart(18, ' ');
  const engineStr = `${t.engineTimeMs.toFixed(2)}ms`.padStart(11, ' ');
  const reviewStr = `${t.dispatcherReviewSeconds.toFixed(1)}s`.padStart(6, ' ');
  const e2eStr = `${t.e2eRecoverySeconds.toFixed(1)}s`.padStart(8, ' ');
  const targetStr = `${t.targetSeconds}s`.padStart(6, ' ');
  const violStr = `${t.constraintViolations}`.padStart(10, ' ');
  const statusStr = t.planStatus;

  console.log(`${nameStr} | ${idStr} | ${typeStr} | ${baselineStr} | ${engineStr} | ${reviewStr} | ${e2eStr} | ${targetStr} | ${violStr} | ${statusStr}`);
});

console.log(`---------------------------------------------------------------------------------------------------------------------------------------\n`);

console.log('--------------------------------------------------------------------------------------------------------------');
console.log(`QUANTIFIABLE EVALUATION METRICS SUMMARY:`);
console.log('--------------------------------------------------------------------------------------------------------------');
console.log(`- 1. Simulated Manual Baseline Avg : ${metrics.avgBaselineRecoverySeconds.toFixed(1)}s (Median: ${metrics.medianBaselineRecoverySeconds.toFixed(1)}s, Min: ${metrics.minBaselineRecoverySeconds.toFixed(1)}s, Max: ${metrics.maxBaselineRecoverySeconds.toFixed(1)}s)`);
console.log(`- 2. Engine Computation Time Avg   : ${metrics.avgEngineTimeMs.toFixed(2)} ms (Median: ${metrics.medianEngineTimeMs.toFixed(2)}ms, Min: ${metrics.minEngineTimeMs.toFixed(2)}ms, Max: ${metrics.maxEngineTimeMs.toFixed(2)}ms)`);
console.log(`- 3. Dispatcher Review Time Range  : 15.0s - 180.0s`);
console.log(`- 4. End-to-End Recovery Time Avg  : ${metrics.avgE2eRecoverySeconds.toFixed(1)}s (Median: ${metrics.medianE2eRecoverySeconds.toFixed(1)}s, Min: ${metrics.minE2eRecoverySeconds.toFixed(1)}s, Max: ${metrics.maxE2eRecoverySeconds.toFixed(1)}s)`);
console.log(`- 5. Target SLA (<= 480 seconds)   : ${metrics.scenariosMeetingTarget} / ${metrics.totalScenarios} scenarios meeting target (${metrics.targetMetPercentage}%)`);
console.log(`- 6. Scenario Handling Success Rate: ${metrics.scenarioHandlingSuccessRate}% (9/9 scenarios handled correctly)`);
console.log(`- 7. Automated Feasible Plan Rate  : ${metrics.automatedFeasiblePlanRate}% (8/9 feasible plans generated)`);
console.log(`- 8. Correct Manual Escalation Rate: ${metrics.correctManualEscalationRate}% (1/1 no-feasible scenario escalated)`);
console.log(`- 9. Constraint Violation Count    : ${metrics.totalConstraintViolations} violations across all 9 scenarios`);
console.log('--------------------------------------------------------------------------------------------------------------\n');

// ============================================================================
// RIGOROUS UNIT ASSERTIONS FOR TECHNICAL CONSISTENCY & REPRODUCIBILITY
// ============================================================================

console.log('Executing Evaluation Unit Assertions...');

// Assertion 1: Verify all 9 scenarios are recorded
assert.strictEqual(results.length, 9, 'Evaluation must contain exactly 9 operational scenarios');
assert.strictEqual(metrics.totalScenarios, 9, 'Metrics totalScenarios must equal 9');

// Assertion 2: Verify each required scenario has the exact 10 required schema attributes
const requiredFields = [
  'scenarioId',
  'disruptionType',
  'baselineTimeSeconds',
  'engineTimeMs',
  'dispatcherReviewSeconds',
  'e2eRecoverySeconds',
  'targetSeconds',
  'targetMet',
  'planStatus',
  'constraintViolations'
];

const expectedScenarios = [
  { id: 'TEST-01', disruptionType: 'Student Cancellation', isFeasible: true },
  { id: 'TEST-02', disruptionType: 'Urgent Student Addition', isFeasible: true },
  { id: 'TEST-03', disruptionType: 'Vehicle Breakdown', isFeasible: true },
  { id: 'TEST-04', disruptionType: 'Driver Unavailable', isFeasible: true },
  { id: 'TEST-05', disruptionType: 'Capacity Constraint', isFeasible: true },
  { id: 'TEST-06', disruptionType: 'GPS Unavailable', isFeasible: true },
  { id: 'TEST-07', disruptionType: 'Network Unavailable', isFeasible: true },
  { id: 'TEST-08', disruptionType: 'Multiple Disruptions', isFeasible: true },
  { id: 'TEST-09', disruptionType: 'No Feasible Solution', isFeasible: false }
];

expectedScenarios.forEach((exp) => {
  const scenario = results.find(r => r.scenarioId === exp.id);
  assert.ok(scenario, `Scenario with ID ${exp.id} must exist in evaluation results`);

  // Verify all 10 required schema fields exist
  requiredFields.forEach((field) => {
    assert.ok(scenario[field] !== undefined, `Scenario ${exp.id} must contain field '${field}'`);
  });

  // Verify disruption type matches
  assert.strictEqual(scenario.disruptionType, exp.disruptionType, `Scenario ${exp.id} disruptionType must match`);

  // Verify baseline is explicitly labeled as simulated
  assert.strictEqual(scenario.isSimulatedBaseline, true, `Scenario ${exp.id} must flag isSimulatedBaseline as true`);
  assert.strictEqual(scenario.baselineLabel, 'Simulated Manual Baseline', `Scenario ${exp.id} baseline must be labeled "Simulated Manual Baseline"`);

  // Verify E2E recovery formula: e2eRecoverySeconds = (engineTimeMs / 1000) + dispatcherReviewSeconds
  const expectedE2e = parseFloat(((scenario.engineTimeMs / 1000) + scenario.dispatcherReviewSeconds).toFixed(2));
  assert.strictEqual(scenario.e2eRecoverySeconds, expectedE2e, `Scenario ${exp.id} E2E recovery must strictly match formula`);

  // Verify target adherence (<= 480 seconds)
  assert.strictEqual(scenario.targetSeconds, 480, `Scenario ${exp.id} targetSeconds must be 480`);
  assert.strictEqual(scenario.targetMet, true, `Scenario ${exp.id} must meet target SLA (<= 480s)`);
  assert.ok(scenario.e2eRecoverySeconds <= 480, `Scenario ${exp.id} E2E time (${scenario.e2eRecoverySeconds}s) must be <= 480s`);

  // Verify zero constraint violations
  assert.strictEqual(scenario.constraintViolations, 0, `Scenario ${exp.id} must have 0 constraint violations`);

  // Verify plan status
  if (exp.isFeasible) {
    assert.strictEqual(scenario.planStatus, 'FEASIBLE_PLAN', `Scenario ${exp.id} planStatus must be FEASIBLE_PLAN`);
  } else {
    assert.strictEqual(scenario.planStatus, 'NO_FEASIBLE_SOLUTION_ESCALATED', `Scenario ${exp.id} planStatus must be NO_FEASIBLE_SOLUTION_ESCALATED`);
  }
});

// Assertion 3: Verify strict metric separation (Engine time ms vs E2E time seconds)
results.forEach((r) => {
  assert.ok(r.engineTimeMs < 100, `Engine computation time (${r.engineTimeMs}ms) must be in milliseconds (<100ms)`);
  assert.ok(r.e2eRecoverySeconds >= 10, `E2E recovery time (${r.e2eRecoverySeconds}s) must be in seconds (>=10s)`);
});

// Assertion 4: Verify aggregated statistical metrics
// E2E Recovery Statistics
assert.strictEqual(metrics.avgE2eRecoverySeconds, 43.89, 'Average E2E Recovery Time must be 43.89s');
assert.strictEqual(metrics.medianE2eRecoverySeconds, 25.01, 'Median E2E Recovery Time must be 25.01s');
assert.strictEqual(metrics.maxE2eRecoverySeconds, 180.0, 'Maximum E2E Recovery Time must be 180.0s');
assert.strictEqual(metrics.minE2eRecoverySeconds, 15.0, 'Minimum E2E Recovery Time must be 15.0s');

// Engine Computation Time Statistics
assert.strictEqual(metrics.avgEngineTimeMs, 2.06, 'Average Engine Computation Time must be 2.06ms');
assert.strictEqual(metrics.medianEngineTimeMs, 1.84, 'Median Engine Computation Time must be 1.84ms');
assert.strictEqual(metrics.maxEngineTimeMs, 5.13, 'Maximum Engine Computation Time must be 5.13ms');
assert.strictEqual(metrics.minEngineTimeMs, 0.65, 'Minimum Engine Computation Time must be 0.65ms');

// Simulated Manual Baseline Statistics
assert.strictEqual(metrics.avgBaselineRecoverySeconds, 741.7, 'Average Baseline Recovery Time must be 741.7s');
assert.strictEqual(metrics.medianBaselineRecoverySeconds, 495.0, 'Median Baseline Recovery Time must be 495.0s');
assert.strictEqual(metrics.maxBaselineRecoverySeconds, 1635.0, 'Maximum Baseline Recovery Time must be 1635.0s');
assert.strictEqual(metrics.minBaselineRecoverySeconds, 495.0, 'Minimum Baseline Recovery Time must be 495.0s');

// Target SLA Adherence
assert.strictEqual(metrics.numberMeetingTarget, 9, 'All 9 scenarios must meet SLA target');
assert.strictEqual(metrics.scenariosMeetingTarget, 9, 'All 9 scenarios must meet SLA target');
assert.strictEqual(metrics.targetMetPercentage, 100.0, 'Target Met Percentage must be 100.0%');

// Evaluation Rates (Crucial distinct rates)
assert.strictEqual(metrics.scenarioHandlingSuccessRate, 100.0, 'Scenario Handling Success Rate must be 100.0%');
assert.strictEqual(metrics.automatedFeasiblePlanRate, 88.9, 'Automated Feasible Plan Rate must be 88.9% (8/9)');
assert.strictEqual(metrics.correctManualEscalationRate, 100.0, 'Correct Manual Escalation Rate must be 100.0% (1/1)');

// Constraint Violations
assert.strictEqual(metrics.constraintViolationCount, 0, 'Constraint Violation Count must be 0');
assert.strictEqual(metrics.totalConstraintViolations, 0, 'Total Constraint Violations must be 0');

// Assertion 5: Deterministic reproducibility
const evalRun2 = runEvaluation({ deterministic: true });
assert.deepStrictEqual(evalRun2.metrics, metrics, 'Repeated evaluation runs with deterministic: true must produce identical metrics');
assert.strictEqual(evalRun2.results.length, results.length, 'Repeated runs must have same scenario count');

console.log('✅ ALL EVALUATION BENCHMARK ASSERTIONS PASSED (100% SUCCESS).\n');
console.log('==============================================================================================================');
