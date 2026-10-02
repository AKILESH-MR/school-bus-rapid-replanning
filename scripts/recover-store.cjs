const fs = require('fs');
const readline = require('readline');

async function extractStoreJs() {
  const fileStream = fs.createReadStream('C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\08ac3555-bda2-47ce-8915-3583fb5d5814\\.system_generated\\logs\\transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastCode = null;

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'default_api:write_to_file') {
            const args = call.args;
            if (args && args.TargetFile && args.TargetFile.endsWith('src/state/store.js') && args.CodeContent) {
              lastCode = args.CodeContent;
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (lastCode) {
    fs.writeFileSync('d:\\project\\raale project1\\src\\state\\store.js', lastCode);
    console.log('Successfully recovered store.js from transcript!');
  } else {
    console.log('Could not find store.js in transcript.');
  }
}

extractStoreJs();
