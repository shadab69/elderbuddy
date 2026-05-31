const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../js/data.js');
if (!fs.existsSync(jsPath)) {
    console.error(`Error: js/data.js not found at ${jsPath}`);
    process.exit(1);
}

const fileContent = fs.readFileSync(jsPath, 'utf8');

// Define mock SVG_TEMPLATES so that eval doesn't fail on reference
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
    const startRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`);
    const startMatch = fileContent.match(startRegex);
    if (!startMatch) {
        console.warn(`Could not find ${varName}`);
        return [];
    }
    const startIndex = startMatch.index + startMatch[0].length - 1;
    let depth = 0;
    let endIndex = -1;
    for (let i = startIndex; i < fileContent.length; i++) {
        if (fileContent[i] === '[') depth++;
        else if (fileContent[i] === ']') {
            depth--;
            if (depth === 0) {
                endIndex = i;
                break;
            }
        }
    }
    if (endIndex !== -1) {
        // Evaluate in a context where SVG_TEMPLATES is defined
        return eval(fileContent.substring(startIndex, endIndex + 1));
    }
    return [];
}

const products = parseJsArray('INITIAL_PRODUCTS');
const categories = parseJsArray('INITIAL_CATEGORIES');
const units = parseJsArray('INITIAL_UNITS');
const banners = parseJsArray('INITIAL_BANNERS');

console.log(`Loaded ${products.length} products`);
console.log(`Loaded ${categories.length} categories`);
console.log(`Loaded ${units.length} units`);
console.log(`Loaded ${banners.length} banners`);

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(dataDir, 'units.json'), JSON.stringify(units, null, 2));
fs.writeFileSync(path.join(dataDir, 'banners.json'), JSON.stringify(banners, null, 2));
console.log('Seeding completed successfully!');
