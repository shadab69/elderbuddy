// ============================================================================
// seed-sync.test.js — the JSON fallback snapshot must never drift from data.js
//
// backend/data/data.js (INITIAL_*) is the canonical seed: the MongoDB seeder
// and the frontend bundle read it. backend/data/*.json is the snapshot that
// backend/utils/jsonFallback.js serves when MongoDB is down. These tests
// fail if the two diverge; regenerate the snapshot with:
//   node scripts/sync-seed-json.js
// ============================================================================

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../backend/data');

// Inert stand-ins, mirroring backend/utils/jsonFallback.js, so eval() of a
// data.js array literal cannot fail on an SVG template reference.
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

function parseJsArray(varName) {
  const fileContent = fs.readFileSync(path.join(DATA_DIR, 'data.js'), 'utf8');
  const startMatch = fileContent.match(new RegExp(`const\\s+${varName}\\s*=\\s*\\[`));
  assert.ok(startMatch, `data.js should declare ${varName}`);
  const startIndex = startMatch.index + startMatch[0].length - 1;
  let depth = 0;
  let endIndex = -1;
  for (let i = startIndex; i < fileContent.length; i++) {
    if (fileContent[i] === '[') depth++;
    else if (fileContent[i] === ']') {
      depth--;
      if (depth === 0) { endIndex = i; break; }
    }
  }
  assert.notEqual(endIndex, -1, `could not find end of ${varName} in data.js`);
  return eval(fileContent.substring(startIndex, endIndex + 1));
}

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));
}

const COLLECTIONS = [
  { label: 'products', varName: 'INITIAL_PRODUCTS', file: 'products.json' },
  { label: 'categories', varName: 'INITIAL_CATEGORIES', file: 'categories.json' },
  { label: 'units', varName: 'INITIAL_UNITS', file: 'units.json' },
  { label: 'banners', varName: 'INITIAL_BANNERS', file: 'banners.json' }
];

describe('seed sync: backend/data/*.json matches data.js INITIAL_*', () => {
  for (const { label, varName, file } of COLLECTIONS) {
    const fromJs = parseJsArray(varName);
    const fromJson = readJson(file);

    it(`${label}: same entry count in ${file} and ${varName}`, () => {
      assert.equal(fromJson.length, fromJs.length,
        `${file} has ${fromJson.length} entries, ${varName} has ${fromJs.length} — run: node scripts/sync-seed-json.js`);
    });

    it(`${label}: same id set in both sources`, () => {
      const jsIds = new Set(fromJs.map((e) => String(e.id)));
      const jsonIds = new Set(fromJson.map((e) => String(e.id)));
      assert.deepEqual(jsonIds, jsIds,
        `${file} ids differ from ${varName} ids — run: node scripts/sync-seed-json.js`);
    });

    it(`${label}: entries are identical field-for-field`, () => {
      assert.deepEqual(fromJson, JSON.parse(JSON.stringify(fromJs)),
        `${file} content differs from ${varName} — run: node scripts/sync-seed-json.js`);
    });
  }
});
