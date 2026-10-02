const fs = require('fs');
const readline = require('readline');

async function extractLostMethods() {
  const fileStream = fs.createReadStream('C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\08ac3555-bda2-47ce-8915-3583fb5d5814\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let output = '';

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'default_api:multi_replace_file_content' || call.name === 'default_api:replace_file_content') {
            const args = call.args;
            if (args && args.TargetFile && args.TargetFile.endsWith('src/state/store.js')) {
              let chunks = args.ReplacementChunks || [args];
              for (const chunk of chunks) {
                if (chunk.ReplacementContent && chunk.ReplacementContent.includes('dispatchAction')) {
                  output += "\\n\\n--- FOUND CHUNK ---\\n" + chunk.ReplacementContent;
                }
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  fs.writeFileSync('d:\\project\\raale project1\\scripts\\extracted-methods.txt', output);
  console.log('Done extracting.');
}

extractLostMethods();
