import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, '..', 'src');
const outFile = path.join(__dirname, '..', 'i18n_candidates.json');

const jsLike = ['.ts', '.tsx', '.js', '.jsx', '.json'];

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      if (jsLike.includes(path.extname(full))) results.push(full);
    }
  });
  return results;
}

function extractFromFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const found = new Set();

  // 1) JSX text between > ... <
  const jsxRegex = />\s*([^<>\n]{2,}?)\s*</g;
  let m;
  while ((m = jsxRegex.exec(text))) {
    const s = m[1].trim();
    if (s && s.length > 1) found.add(s);
  }

  // 2) string literals between single/double/backtick quotes
  const strRegex = /(['"`])((?:\\.|[^\\])*?)\1/g;
  while ((m = strRegex.exec(text))) {
    const s = m[2].trim();
    if (s.length >= 2 && /[a-zA-ZÀ-ÿ]/.test(s)) {
      // skip import paths and code-like strings (heuristic)
      if (/^[./\w-]+$/.test(s)) continue;
      found.add(s);
    }
  }

  return Array.from(found).map((s) => ({ file, text: s }));
}

const files = walk(SRC);
const all = [];
files.forEach((f) => {
  try {
    const ex = extractFromFile(f);
    ex.forEach((e) => all.push(e));
  } catch (e) {
    // ignore
  }
});

// dedupe by text
const map = new Map();
for (const item of all) {
  if (!map.has(item.text)) map.set(item.text, []);
  map.get(item.text).push(item.file);
}

const output = Array.from(map.entries()).map(([text, files]) => ({ text, files }));
fs.writeFileSync(outFile, JSON.stringify(output, null, 2), 'utf8');
console.log('Wrote', output.length, 'candidates to', outFile);
