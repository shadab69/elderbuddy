const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// JSON fallback for catalogue reads.
//
// When MongoDB is not connected (fresh clone, local dev without a database,
// or a transient outage), catalogue GET endpoints serve the same seed data
// that the database seeder uses, straight from backend/data/, instead of
// failing with a 500 / buffering timeout. When MongoDB IS connected the
// controllers query Mongoose exactly as before and this module is unused.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(__dirname, '../data');

// backend/data/data.js arrays reference SVG template helpers for some
// entries; provide inert stand-ins so eval() of the arrays cannot fail,
// mirroring the approach used by the database seeder in config/database.js.
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
  try {
    const jsPath = path.join(DATA_DIR, 'data.js');
    if (!fs.existsSync(jsPath)) return null;
    const fileContent = fs.readFileSync(jsPath, 'utf8');
    const startRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`);
    const startMatch = fileContent.match(startRegex);
    if (!startMatch) return null;
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
    if (endIndex !== -1) {
      const jsArrayStr = fileContent.substring(startIndex, endIndex + 1);
      return eval(jsArrayStr);
    }
  } catch (error) {
    console.error(`[JsonFallback] Failed to parse ${varName} from data.js:`, error.message);
  }
  return null;
}

function readJsonFile(fileName) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error(`[JsonFallback] Failed to read ${fileName}:`, error.message);
  }
  return [];
}

// Which seed source backs each catalogue collection.
const SOURCES = {
  products: () => readJsonFile('products.json'),
  categories: () => readJsonFile('categories.json'),
  banners: () => readJsonFile('banners.json'),
  units: () => readJsonFile('units.json'),
  builders: () => parseJsArray('INITIAL_BUILDERS') || [],
  guides: () => parseJsArray('INITIAL_GUIDE_POSTS') || []
};

const cache = {};

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function getFallbackCollection(name) {
  if (!SOURCES[name]) return [];
  if (!cache[name]) cache[name] = SOURCES[name]();
  return cache[name];
}

function findFallbackById(name, id) {
  return (
    getFallbackCollection(name).find(
      (item) => item.id === id || (item._id && String(item._id) === String(id))
    ) || null
  );
}

module.exports = { isDbConnected, getFallbackCollection, findFallbackById };
