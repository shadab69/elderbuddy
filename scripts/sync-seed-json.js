// ============================================================================
// sync-seed-json.js — regenerate backend/data/*.json from backend/data/data.js
//
// WHY: data.js (INITIAL_PRODUCTS / INITIAL_CATEGORIES / INITIAL_UNITS /
// INITIAL_BANNERS) is the canonical seed — the MongoDB seeder and the
// frontend bundle both read it. The JSON files in backend/data/ are a
// snapshot consumed by backend/utils/jsonFallback.js when MongoDB is down.
// If the snapshot is not refreshed, the fallback silently serves a stale,
// smaller catalogue.
//
// WHEN TO RUN: after ANY change to the INITIAL_* catalogue arrays in
// backend/data/data.js. The test tests/seed-sync.test.js fails if the two
// sources drift apart again.
//
// USAGE: node scripts/sync-seed-json.js
// ============================================================================

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../backend/data');
const DATA_JS = path.join(DATA_DIR, 'data.js');

// Same extraction approach as backend/utils/jsonFallback.js: locate the
// array literal in data.js and eval just that literal. Inert SVG template
// stand-ins are provided so an array entry referencing them cannot fail.
const SVG_TEMPLATES = {
  steel: () => '',
  cement: () => '',
  bricks: () => '',
  tiles: () => '',
  plumbing: () => '',
  electrical: () => '',
  paints: () => '',
  hardware: () => ''
};

function parseJsArray(fileContent, varName) {
  const startRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`);
  const startMatch = fileContent.match(startRegex);
  if (!startMatch) throw new Error(`${varName} not found in data.js`);
  const startIndex = startMatch.index + startMatch[0].length - 1; // index of '['
  let depth = 0;
  let endIndex = -1;
  for (let i = startIndex; i < fileContent.length; i++) {
    if (fileContent[i] === '[') depth++;
    else if (fileContent[i] === ']') {
      depth--;
      if (depth === 0) { endIndex = i; break; }
    }
  }
  if (endIndex === -1) throw new Error(`Could not find end of ${varName} in data.js`);
  return eval(fileContent.substring(startIndex, endIndex + 1));
}

const COLLECTIONS = [
  { varName: 'INITIAL_PRODUCTS', file: 'products.json' },
  { varName: 'INITIAL_CATEGORIES', file: 'categories.json' },
  { varName: 'INITIAL_UNITS', file: 'units.json' },
  { varName: 'INITIAL_BANNERS', file: 'banners.json' }
];

function main() {
  const fileContent = fs.readFileSync(DATA_JS, 'utf8');
  for (const { varName, file } of COLLECTIONS) {
    const entries = parseJsArray(fileContent, varName);
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error(`${varName} parsed to an empty/non-array value — refusing to write ${file}`);
    }
    // Round-trip through JSON so only serializable data is written and any
    // non-serializable value fails loudly here instead of in the fallback.
    const serialized = JSON.stringify(entries, null, 2) + '\n';
    const roundTripped = JSON.parse(serialized);
    if (roundTripped.length !== entries.length) {
      throw new Error(`${varName}: entry count changed during serialization — refusing to write ${file}`);
    }
    fs.writeFileSync(path.join(DATA_DIR, file), serialized);
    console.log(`${file}: ${entries.length} entries synced from ${varName}`);
  }
  console.log('Seed JSON sync complete.');
}

main();
