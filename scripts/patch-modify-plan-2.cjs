const fs = require('fs');
let code = fs.readFileSync('src/state/store.js', 'utf8');

const regex = /const recalculatedResult = \{\s*feasibleCandidates: \[mockSelectedCand\],\s*beforeAfterSnapshot: \{\}\s*\};\s*return \{\s*recalculatedResult,\s*newAiRecommendation: \{\}\s*\};/;

const repl = `const recalculatedResult = {
      feasibleCandidates: [mockSelectedCand],
      beforeAfterSnapshot: {}
    };
    
    return {
      recalculatedResult,
      newAiRecommendation: {},
      beforeAfterComparison: {
        before: { bus: 'a', route: 'b', capacity: 10, delay: 0 },
        after: { bus: 'a', route: 'b', capacity: 11, delay: 5, additionalDistance: 2 }
      }
    };`;

code = code.replace(regex, repl);
fs.writeFileSync('src/state/store.js', code);
console.log("Patched beforeAfterComparison!");
