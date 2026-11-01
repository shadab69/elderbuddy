// Data-integrity tests for the Elder-O-Buddy seed catalogue.
//
// The catalogue has two seed sources that must each be internally
// consistent:
//   1. backend/data/*.json  — served by backend/utils/jsonFallback.js
//      whenever MongoDB is not connected.
//   2. backend/data/data.js — INITIAL_* arrays used by the database
//      seeder (backend/config/database.js) and bundled with the frontend.
//
// The data.js arrays are extracted with the same bracket-matching +
// eval technique the seeder and the JSON fallback use in production
// (with inert SVG-template stand-ins), so the tests validate the exact
// data those code paths consume.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'backend', 'data');

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf8'));
}

// Mirrors parseJsArray() in backend/config/database.js.
const SVG_TEMPLATES = {
  steel: () => '', cement: () => '', bricks: () => '', tiles: () => '',
  plumbing: () => '', electrical: () => '', paints: () => '', hardware: () => ''
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

function checkCatalogue(label, { products, categories, units, banners }, expected) {
  describe(label, () => {
    it('has the expected seed counts', () => {
      assert.equal(products.length, expected.products, 'product count');
      assert.equal(categories.length, expected.categories, 'category count');
      assert.equal(units.length, expected.units, 'unit count');
      assert.equal(banners.length, expected.banners, 'banner count');
    });

    it('categories and units all have an id and a name', () => {
      for (const c of categories) {
        assert.ok(c.id, 'category missing id');
        assert.ok(c.name, `category ${c.id} missing name`);
      }
      for (const u of units) {
        assert.ok(u.id, 'unit missing id');
        assert.ok(u.name, `unit ${u.id} missing name`);
      }
    });

    it('has no duplicate product ids', () => {
      const ids = products.map((p) => p.id);
      assert.equal(new Set(ids).size, ids.length, 'duplicate product ids found');
    });

    it('every product has id, name, a positive price and a category', () => {
      for (const p of products) {
        assert.ok(p.id, 'product missing id');
        assert.ok(typeof p.name === 'string' && p.name.length > 0, `product ${p.id} missing name`);
        assert.ok(typeof p.price === 'number' && p.price > 0, `product ${p.id} has invalid price: ${p.price}`);
        assert.ok(p.category, `product ${p.id} missing category`);
      }
    });

    it("every product's category exists in the category list", () => {
      const catIds = new Set(categories.map((c) => c.id));
      for (const p of products) {
        assert.ok(catIds.has(p.category), `product ${p.id} references unknown category '${p.category}'`);
      }
    });

    it("every product's subcategory belongs to its category", () => {
      for (const p of products) {
        if (!p.subcategory) continue;
        const cat = categories.find((c) => c.id === p.category);
        const subs = (cat && cat.subcategories) || [];
        assert.ok(
          subs.some((s) => s.id === p.subcategory),
          `product ${p.id} references subcategory '${p.subcategory}' which is not under category '${p.category}'`
        );
      }
    });

    it("every product's unit exists in the units list", () => {
      const unitIds = new Set(units.map((u) => u.id));
      for (const p of products) {
        assert.ok(p.unit, `product ${p.id} missing unit`);
        assert.ok(unitIds.has(p.unit), `product ${p.id} references unknown unit '${p.unit}'`);
      }
    });
  });
}

checkCatalogue('JSON fallback seed files (backend/data/*.json)', {
  products: readJson('products.json'),
  categories: readJson('categories.json'),
  units: readJson('units.json'),
  banners: readJson('banners.json')
}, { products: 48, categories: 9, units: 16, banners: 3 });

checkCatalogue('data.js seed arrays (INITIAL_*)', {
  products: parseJsArray('INITIAL_PRODUCTS'),
  categories: parseJsArray('INITIAL_CATEGORIES'),
  units: parseJsArray('INITIAL_UNITS'),
  banners: parseJsArray('INITIAL_BANNERS')
}, { products: 71, categories: 13, units: 18, banners: 3 });
