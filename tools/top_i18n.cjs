const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const inFile = path.join(root, 'i18n_candidates.json');
const outFile = path.join(root, 'i18n_top100.json');

if (!fs.existsSync(inFile)) {
  console.error('i18n_candidates.json not found. Run tools/extract_strings.js first.');
  process.exit(1);
}

const raw = fs.readFileSync(inFile, 'utf8');
let arr;
try {
  arr = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse JSON:', e);
  process.exit(1);
}

const sorted = arr
  .map((it) => ({ text: it.text, files: it.files || [], count: (it.files || []).length }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

const top = sorted.slice(0, 100).map((it) => ({ text: it.text, count: it.count, sampleFiles: it.files.slice(0, 5) }));

fs.writeFileSync(outFile, JSON.stringify(top, null, 2), 'utf8');
console.log('Wrote top', top.length, 'entries to', outFile);
