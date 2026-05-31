const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/builderpro';

// Define mock SVG_TEMPLATES so that eval doesn't fail on reference during seeder parse
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

// Seeder extraction utility
function parseJsArray(varName) {
    try {
        const jsPath = path.join(__dirname, '../../js/data.js');
        if (!fs.existsSync(jsPath)) {
            console.warn(`[Seeder] js/data.js not found at ${jsPath}`);
            return null;
        }
        const fileContent = fs.readFileSync(jsPath, 'utf8');
        
        const startRegex = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`);
        const startMatch = fileContent.match(startRegex);
        if (!startMatch) {
            console.warn(`[Seeder] Could not find variable declaration for ${varName}`);
            return null;
        }
        
        const startIndex = startMatch.index + startMatch[0].length - 1; // index of '['
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
            const jsArrayStr = fileContent.substring(startIndex, endIndex + 1);
            return eval(jsArrayStr);
        }
    } catch (error) {
        console.error(`[Seeder] Failed to parse ${varName}`, error);
    }
    return null;
}

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`[Database] MongoDB Connected Successfully!`);
        
        // Run database seeding checks
        await seedDatabase();
    } catch (err) {
        console.error(`[Database] Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

// Dynamic database seeder
async function seedDatabase() {
    try {
        const Product = mongoose.model('Product');
        const Category = mongoose.model('Category');
        const Unit = mongoose.model('Unit');
        const Banner = mongoose.model('Banner');
        const Guide = mongoose.model('Guide');

        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('[Database seeder] Seeding products...');
            const seedProducts = parseJsArray('INITIAL_PRODUCTS') || [];
            if (seedProducts.length > 0) {
                await Product.insertMany(seedProducts);
                console.log(`[Database seeder] Successfully seeded ${seedProducts.length} products.`);
            }
        }

        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('[Database seeder] Seeding categories...');
            const seedCats = parseJsArray('INITIAL_CATEGORIES') || [];
            if (seedCats.length > 0) {
                await Category.insertMany(seedCats);
                console.log(`[Database seeder] Successfully seeded ${seedCats.length} categories.`);
            }
        }

        const unitCount = await Unit.countDocuments();
        if (unitCount === 0) {
            console.log('[Database seeder] Seeding units...');
            const seedUnits = parseJsArray('INITIAL_UNITS') || [];
            if (seedUnits.length > 0) {
                await Unit.insertMany(seedUnits);
                console.log(`[Database seeder] Successfully seeded ${seedUnits.length} units.`);
            }
        }

        const bannerCount = await Banner.countDocuments();
        if (bannerCount === 0) {
            console.log('[Database seeder] Seeding banners...');
            const seedBanners = parseJsArray('INITIAL_BANNERS') || [];
            if (seedBanners.length > 0) {
                await Banner.insertMany(seedBanners);
                console.log(`[Database seeder] Successfully seeded ${seedBanners.length} banners.`);
            }
        }

        const guideCount = await Guide.countDocuments();
        if (guideCount === 0) {
            console.log('[Database seeder] Seeding guides...');
            const seedGuides = parseJsArray('INITIAL_GUIDE_POSTS') || [];
            if (seedGuides.length > 0) {
                await Guide.insertMany(seedGuides);
                console.log(`[Database seeder] Successfully seeded ${seedGuides.length} guides.`);
            }
        }
    } catch (e) {
        console.error('[Database seeder] Error seeding database:', e.message);
    }
}

module.exports = connectDB;
