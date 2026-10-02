const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

async function run() {
  const fileStream = fs.createReadStream('C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\00b168b2-9f0f-4cac-8551-63948554eeea\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream });
  let allEdits = [];
  for await (const line of rl) {
    const e = JSON.parse(line);
    if (e.tool_calls) {
      for (const tc of e.tool_calls) {
        const tf = tc.args?.TargetFile || '';
        if (tc.name.includes('replace_file_content') && tf.toLowerCase().includes('store.js')) {
          allEdits.push(tc);
        }
      }
    }
  }
  console.log('Total store edits in 00b1 with case/slash insensitive:', allEdits.length);

  let content = execSync('git show HEAD:src/state/store.js', { encoding: 'utf8' });

  for (let i = 0; i < allEdits.length; i++) {
    const edit = allEdits[i];
    console.log('Applying edit', i, edit.name, edit.args?.Instruction?.slice(0, 50));
    if (edit.name === 'default_api:replace_file_content' || edit.name === 'replace_file_content') {
      const { TargetContent, ReplacementContent } = edit.args;
      if (!content.includes(TargetContent)) {
        console.error('FAILED to find TargetContent for edit', i);
        console.error('Target was:', TargetContent.slice(0, 100));
        process.exit(1);
      }
      content = content.replace(TargetContent, ReplacementContent);
    } else if (edit.name === 'default_api:multi_replace_file_content' || edit.name === 'multi_replace_file_content') {
      for (let c = 0; c < edit.args.ReplacementChunks.length; c++) {
        const chunk = edit.args.ReplacementChunks[c];
        if (!content.includes(chunk.TargetContent)) {
          console.error('FAILED to find chunk TargetContent for edit', i, 'chunk', c);
          console.error('Target chunk was:', chunk.TargetContent.slice(0, 100));
          process.exit(1);
        }
        content = content.replace(chunk.TargetContent, chunk.ReplacementContent);
      }
    }
  }

  console.log('SUCCESS! Reconstructed complete store.js! Length:', content.length);
  fs.writeFileSync('src/state/store.js', content, 'utf8');
}

run();
