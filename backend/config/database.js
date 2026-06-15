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

        const Designer = mongoose.model('Designer');
        const designerCount = await Designer.countDocuments();
        if (designerCount === 0) {
            console.log('[Database seeder] Seeding designers...');
            const seedDesigners = [
                {
                    id: 'ananya-sharma',
                    name: 'Ananya Sharma',
                    avatarText: 'AS',
                    avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                    firm: 'Principal Designer, Studio Luxe',
                    experience: '10+ Years',
                    rating: '4.9',
                    reviewsCount: 86,
                    completedProjects: 124,
                    specialties: ['Luxury Living Rooms', 'Space Optimization', 'Modern Minimalist'],
                    bio: 'Ananya is an award-winning principal designer specializing in elegant residential transformations. She combines space planning and modern minimalist aesthetics to create gorgeous environments.',
                    fullBio: 'Ananya Sharma founded Studio Luxe in 2016. Since then, she has successfully designed over 120 residential spaces in Pan India, Bangalore, and Mumbai. Her design philosophy revolves around clean lines, neutral color palettes, and maximizing natural lighting. She works closely with clients to understand their lifestyles and incorporate personalized custom elements into every corner.',
                    projects: [
                        {
                            title: 'Modern Minimalist Living Room',
                            location: 'Jubilee Hills, Pan India',
                            year: '2025',
                            desc: 'A complete redesign of a 500 sq ft living room featuring custom walnut paneling, velvet seating, and built-in smart ambient lighting.',
                            images: ['assets/interior_portfolio1.png', 'assets/interior_portfolio7.png']
                        },
                        {
                            title: 'Sleek Executive Home Study',
                            location: 'Gachibowli, Pan India',
                            year: '2024',
                            desc: 'An ergonomic and cozy home office built with high-quality oakwood storage shelves, task lighting, and customized noise isolation walls.',
                            images: ['assets/interior_portfolio4.png', 'assets/interior_portfolio8.png']
                        }
                    ]
                },
                {
                    id: 'karan-malhotra',
                    name: 'Karan Malhotra',
                    avatarText: 'KM',
                    avatarBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                    firm: 'Kitchen & Modular Specialist, Malhotra & Co.',
                    experience: '8+ Years',
                    rating: '4.8',
                    reviewsCount: 112,
                    completedProjects: 210,
                    specialties: ['Contemporary Kitchens', 'Smart Storage', 'Modular Wardrobes'],
                    bio: 'Karan Malhotra is a modular specialist focusing on space-saving kitchen layouts, functional hardware, and sleek wardrobe designs.',
                    fullBio: 'Karan is a modular design expert. Over the last 8 years, he has designed and executed over 200 high-end contemporary kitchens and wardrobes. He believes in maximizing efficiency and storage through state-of-the-art pull-out trays, corner carousels, and premium hardware. His projects stand out for their ergonomics and durable premium finishes.',
                    projects: [
                        {
                            title: 'Premium Matte Black Modular Kitchen',
                            location: 'Banjara Hills, Pan India',
                            year: '2025',
                            desc: 'A high-end contemporary kitchen featuring sleek matte black anti-scratch cabinets, premium white marble countertops, and gold plumbing fixtures.',
                            images: ['assets/interior_portfolio2.png', 'assets/interior_portfolio9.png']
                        },
                        {
                            title: 'Luxury Marble Master Bathroom Suite',
                            location: 'Kondapur, Pan India',
                            year: '2024',
                            desc: 'A premium master bathroom remodel featuring a freestanding porcelain tub, gold plumbing fixtures, floating wash vanity, and soft mood lighting.',
                            images: ['assets/interior_portfolio5.png', 'assets/interior_portfolio10.png']
                        }
                    ]
                },
                {
                    id: 'priya-nair',
                    name: 'Priya Nair',
                    avatarText: 'PN',
                    avatarBg: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    firm: 'Founder, GreenSpace Interiors',
                    experience: '12+ Years',
                    rating: '5.0',
                    reviewsCount: 94,
                    completedProjects: 88,
                    specialties: ['Eco-Friendly Homes', 'Luxury Bedrooms', 'Ambient Lighting'],
                    bio: 'Priya Nair is an industry veteran focused on sustainable interior architecture, energy-efficient lighting, and biophilic designs.',
                    fullBio: 'Priya founded GreenSpace Interiors with a vision to merge luxury and sustainability. She uses organic, non-toxic paints, reclaimed timber, and energy-efficient automation to create healthy, eco-friendly homes. She has a deep understanding of ambient lighting and uses biophilic elements like vertical gardens to create highly calming, therapeutic indoor environments.',
                    projects: [
                        {
                            title: 'Cozy Luxury Master Bedroom',
                            location: 'Begumpet, Pan India',
                            year: '2025',
                            desc: 'A tranquil master bedroom design showcasing custom organic fabric upholstery, warm beige backlighting, and solid reclaimed wood headboard.',
                            images: ['assets/interior_portfolio3.png', 'assets/interior_portfolio11.png']
                        },
                        {
                            title: 'Biophilic Sky Villa Balcony Lounge',
                            location: 'Hitec City, Pan India',
                            year: '2024',
                            desc: 'A sky villa balcony converted into a lush green lounge featuring vertical plant walls, comfortable weather-resistant seating, and warm overhead Edison bulbs.',
                            images: ['assets/interior_portfolio6.png', 'assets/interior_portfolio12.png']
                        }
                    ]
                }
            ];
            await Designer.insertMany(seedDesigners);
            console.log(`[Database seeder] Successfully seeded ${seedDesigners.length} designers.`);
        }
    } catch (e) {
        console.error('[Database seeder] Error seeding database:', e.message);
    }
}

module.exports = connectDB;
