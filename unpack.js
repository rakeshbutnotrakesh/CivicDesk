/**
 * CivicDesk Repository Unpacker
 * Usage: node unpack.js [jsonFilePath]
 * Default file: civicdesk-repository.json
 */
const fs = require('fs');
const path = require('path');

const targetJson = process.argv[2] || path.join(__dirname, 'civicdesk-repository.json');

if (!fs.existsSync(targetJson)) {
  console.error(`Error: File ${targetJson} does not exist.`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetJson, 'utf8'));
const files = data.files || {};

console.log(`Unpacking ${Object.keys(files).length} files from ${path.basename(targetJson)}...`);

for (const [filePath, content] of Object.entries(files)) {
  const destPath = path.join(__dirname, filePath);
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(destPath, content, 'utf8');
  console.log(`  ✓ ${filePath}`);
}

console.log('\nAll files unpacked successfully!');
console.log('Next steps:');
console.log('  1. npm install');
console.log('  2. npm run dev');
console.log('  3. Open http://localhost:3000 in your browser\n');
