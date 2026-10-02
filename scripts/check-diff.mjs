import fs from 'fs';

const edits = JSON.parse(fs.readFileSync('store_only_edits.json', 'utf8'));
let code = fs.readFileSync('src/state/store.js', 'utf8')
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map(l => l.trimEnd())
  .join('\n');

for (let i = 0; i < edits.length; i++) {
  const e = edits[i];
  console.log(`Testing step ${e.step} (${i+1}/${edits.length}) ${e.name}`);
  if (e.step === 172) {
    const constructorEnd = code.indexOf('  }\n\n  loadPendingOfflineChanges() {');
    if (constructorEnd === -1) {
      console.error('Could not find constructor end in step 172');
      process.exit(1);
    }
    const repl = e.args.ReplacementContent.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
    code = repl + '\n\n' + code.substring(constructorEnd + 5);
    continue;
  }

  if (e.name === 'replace_file_content') {
    let target = e.args.TargetContent.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
    let repl = e.args.ReplacementContent.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
    if (!code.includes(target)) {
      console.error('Target not found for step', e.step);
      process.exit(1);
    }
    code = code.replace(target, repl);
  } else if (e.name === 'multi_replace_file_content') {
    for (let c = 0; c < e.args.ReplacementChunks.length; c++) {
      const chunk = e.args.ReplacementChunks[c];
      let target = chunk.TargetContent.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
      let repl = chunk.ReplacementContent.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
      if (!code.includes(target)) {
        if (e.step === 385 && c === 0) {
          console.warn('Skipping step 385 chunk 0 as queueAction is replaced in step 1171');
          continue;
        }
        console.error('Chunk target not found for step', e.step, 'chunk', c);
        process.exit(1);
      }
      code = code.replace(target, repl);
    }
  }
}

fs.writeFileSync('src/state/store.js', code);
console.log('ALL EDITS APPLIED CLEANLY!');
