const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const inFile = path.join(root, 'i18n_top100.json');
const outFile = path.join(root, 'i18n_top100_clean.json');

if (!fs.existsSync(inFile)) {
  console.error('i18n_top100.json not found. Run tools/top_i18n.cjs first.');
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

function isTranslatable(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  // Remove obvious JSX/comment tokens or template strings
  const hasCodeTokens = /[\{\}\$`<>\\\=\/\*]|\/\*|=>/.test(trimmed);
  if (hasCodeTokens) return false;

  // Exclude JSX comments like {/* ... */}
  if (trimmed.startsWith('{/*') || trimmed.startsWith('/*') || trimmed.endsWith('*/}')) return false;

  // Exclude template placeholders
  if (trimmed.includes('${') || trimmed.includes('{item') || trimmed.includes('{children') || trimmed.includes('{title') || /\{.+\}/.test(trimmed)) return false;

  // Exclude long Tailwind/class strings: many hyphens and spaces
  const hyphenCount = (trimmed.match(/-/g) || []).length;
  if (hyphenCount > 6 && trimmed.length > 40) return false;

  // Exclude strings that are mostly classes: many short tokens with hyphens/numbers
  const tokens = trimmed.split(/\s+/);
  const classLikeTokens = tokens.filter(t => /^[a-z0-9\-_:]+$/.test(t));
  if (classLikeTokens.length >= tokens.length && tokens.length > 1) return false;

  // Keep only entries that contain at least one letter (including accented letters)
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmed)) return false;

  // Exclude sequences that are just punctuation or closing braces like '))}'
  if (/^[\)\]\}\s\-\>\<\=\*\.,\/]+$/.test(trimmed)) return false;

  // Otherwise consider translatable
  return true;
}

const filtered = arr.filter(it => isTranslatable(it.text)).map(it => ({ text: it.text, count: it.count, sampleFiles: it.sampleFiles }));

fs.writeFileSync(outFile, JSON.stringify(filtered, null, 2), 'utf8');
console.log('Wrote', filtered.length, 'clean entries to', outFile);
