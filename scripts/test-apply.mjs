import fs from 'fs';

const edits = JSON.parse(fs.readFileSync('store_only_edits.json', 'utf8'));
let code = fs.readFileSync('src/state/store.js', 'utf8').replace(/\r\n/g, '\n');

// If missing replanningEngine, insert it
if (!code.includes("from '../utils/replanningEngine.js'")) {
  code = code.replace(
    "import { BUSES, ROUTES, STUDENTS, DISRUPTIONS, OPERATIONS_METRICS, DRIVERS, SCHOOLS, DEPOT } from '../data/mockData.js';",
    "import { BUSES, ROUTES, STUDENTS, DISRUPTIONS, OPERATIONS_METRICS, DRIVERS, SCHOOLS, DEPOT } from '../data/mockData.js';\nimport { replanningEngine } from '../utils/replanningEngine.js';"
  );
}

for (let i = 0; i < edits.length; i++) {
  const e = edits[i];
  console.log('Processing step', e.step, e.name);
  if (e.name === 'replace_file_content') {
    let target = e.args.TargetContent.replace(/\r\n/g, '\n');
    let repl = e.args.ReplacementContent.replace(/\r\n/g, '\n');
    if (!code.includes(target)) {
      console.error('TargetContent not found for step', e.step);
      // Let's print first 3 lines of target
      console.error('Target starts with:', target.slice(0, 100));
      process.exit(1);
    }
    code = code.replace(target, repl);
  } else if (e.name === 'multi_replace_file_content') {
    for (let c = 0; c < e.args.ReplacementChunks.length; c++) {
      const chunk = e.args.ReplacementChunks[c];
      let target = chunk.TargetContent.replace(/\r\n/g, '\n');
      let repl = chunk.ReplacementContent.replace(/\r\n/g, '\n');
      if (!code.includes(target)) {
        console.error('Chunk TargetContent not found for step', e.step, 'chunk', c);
        console.error('Chunk target starts with:', target.slice(0, 100));
        process.exit(1);
      }
      code = code.replace(target, repl);
    }
  }
}
fs.writeFileSync('src/state/store.js', code);
console.log('ALL EDITS APPLIED CLEANLY!');
