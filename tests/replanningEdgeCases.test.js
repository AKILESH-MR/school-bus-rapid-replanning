// Node Test Runner for Replanning Edge & Failure Test Cases
import { runReplanningEdgeCaseTests } from '../src/utils/replanningEdgeCaseTests.js';

console.log('========================================================================');
console.log('  DISTRICT TRANSPORT RAPID REPLANNING: EDGE & FAILURE TEST SUITE');
console.log('========================================================================\n');

const results = runReplanningEdgeCaseTests();

console.log(`Executed ${results.totalTests} Scenarios in ${results.totalExecutionTimeMs.toFixed(2)} ms:\n`);

results.testResults.forEach((t, i) => {
  const badge = t.passed ? '✅ [PASS]' : '❌ [FAIL]';
  const formatTime = (ms) => (ms / 1000).toFixed(1) + 's';
  const baselineSec = t.baselineTimeMs / 1000;
  const e2eSec = t.e2eRecoveryTimeMs / 1000;
  const improvement = (((baselineSec - e2eSec) / baselineSec) * 100).toFixed(1);
  
  console.log(`${i + 1}. ${badge} ${t.scenario}`);
  console.log(`   Baseline: ${formatTime(t.baselineTimeMs)} (Simulated Workflow) | SLA Target: ${formatTime(t.targetTimeMs)}`);
  console.log(`   E2E Recovery Time: ${formatTime(t.e2eRecoveryTimeMs)} (${improvement}% reduction vs simulated baseline)`);
  console.log(`   Engine Computation Time: ${t.engineTimeMs.toFixed(2)}ms (Secondary Metric)`);
  console.log(`   Valid Plan: ${t.passed ? 'Yes' : 'No'} | Manual Intervention: ${t.manualIntervention ? 'Yes' : 'No'}`);
  if (t.failureReason) {
    console.log(`   Failure  : ${t.failureReason}`);
  }
  console.log('');
});

console.log('------------------------------------------------------------------------');
console.log(`Summary: ${results.passedCount}/${results.totalTests} Passed (${((results.passedCount / results.totalTests) * 100).toFixed(0)}%). Failed: ${results.failedCount}`);
console.log('------------------------------------------------------------------------\n');

if (!results.allPassed) {
  console.error('CRITICAL: Some edge case tests failed!');
  process.exit(1);
} else {
  console.log('ALL 9 REPLANNING EDGE & FAILURE TEST CASES PASSED SUCCESSFULLY.');
}
