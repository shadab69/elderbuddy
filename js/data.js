// ==========================================================================
// DATA LAYER: Categories, Products & LocalStorage Handlers
// ==========================================================================

const INITIAL_CATEGORIES = [
    { id: 'cement', name: 'Cement & Concrete', icon: 'boxes', desc: 'OPC & PPC Cements, Ready Mix Concrete' },
    { id: 'steel', name: 'TMT Steel Bars', icon: 'anvil', desc: 'Reinforcement bars for columns & slabs' },
    { id: 'bricks', name: 'Bricks & Blocks', icon: 'layers', desc: 'Red clay bricks, fly ash & AAC blocks' },
    { id: 'tiles', name: 'Tiles & Flooring', icon: 'grid', desc: 'Ceramic, vitrified tiles & natural stones' },
    { id: 'plumbing', name: 'Plumbing & Pipes', icon: 'droplet', desc: 'CPVC, PVC pipes & bathroom fittings' },
    { id: 'electrical', name: 'Electricals & Wires', icon: 'zap', desc: 'FRLS wires, modular switches & lights' },
    { id: 'paints', name: 'Paints & Finishes', icon: 'paint-bucket', desc: 'Interior, exterior paints & primers' },
    { id: 'hardware', name: 'Hardware & Fixtures', icon: 'wrench', desc: 'Locks, hinges, screws & steel fixtures' }
];

const INITIAL_BANNERS = [
    {
        id: 'b1',
        imageSrc: 'assets/banner1.png',
        link: '#/products',
        styleType: 'cover',
        position: 'center',
        bgColor: '#ffffff'
    },
    {
        id: 'b2',
        imageSrc: 'assets/promo_bricks.png',
        link: '#/products',
        styleType: 'cover',
        position: 'center',
        bgColor: '#ffffff'
    },
    {
        id: 'b3',
        imageSrc: 'assets/new_hero_banner.jpg',
        link: '#/products',
        styleType: 'dual',
        position: 'center',
        bgColor: '#1a0933'
    }
];

// Programmatic SVG helper to generate high-quality building material SVGs inline
const SVG_TEMPLATES = {
    cement: (color = '#64748b') => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <rect x="25" y="15" width="50" height="70" rx="6" fill="${color}" stroke="#334155" stroke-width="2"/>
            <path d="M25 35h50M25 65h50" stroke="#334155" stroke-width="2" stroke-dasharray="3 3"/>
            <rect x="35" y="42" width="30" height="16" fill="#f8fafc" stroke="#334155" stroke-width="1"/>
            <text x="50" y="53" font-family="'Outfit', sans-serif" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">CEMENT</text>
            <circle cx="50" cy="25" r="4" fill="#f97316"/>
            <text x="50" y="78" font-family="sans-serif" font-size="5" fill="#f8fafc" text-anchor="middle">50 KG NET</text>
        </svg>
    `,
    steel: () => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- TMT bars -->
            <rect x="20" y="15" width="8" height="70" rx="2" fill="#475569"/>
            <path d="M20 20l8 4M20 30l8 4M20 40l8 4M20 50l8 4M20 60l8 4M20 70l8 4M20 80l8 4" stroke="#334155" stroke-width="1.5"/>
            
            <rect x="46" y="15" width="8" height="70" rx="2" fill="#64748b"/>
            <path d="M46 20l8 4M46 30l8 4M46 40l8 4M46 50l8 4M46 60l8 4M46 70l8 4M46 80l8 4" stroke="#334155" stroke-width="1.5"/>

            <rect x="72" y="15" width="8" height="70" rx="2" fill="#334155"/>
            <path d="M72 20l8 4M72 30l8 4M72 40l8 4M72 50l8 4M72 60l8 4M72 70l8 4M72 80l8 4" stroke="#1e293b" stroke-width="1.5"/>
            
            <path d="M12 40h76M12 60h76" stroke="#f97316" stroke-width="3"/>
        </svg>
    `,
    bricks: () => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- Brick pile -->
            <rect x="15" y="60" width="40" height="20" rx="2" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.5"/>
            <circle cx="25" cy="70" r="2.5" fill="#7f1d1d"/>
            <circle cx="35" cy="70" r="2.5" fill="#7f1d1d"/>
            <circle cx="45" cy="70" r="2.5" fill="#7f1d1d"/>
            
            <rect x="45" y="45" width="40" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" stroke-width="1.5"/>
            <circle cx="55" cy="55" r="2.5" fill="#b91c1c"/>
            <circle cx="65" cy="55" r="2.5" fill="#b91c1c"/>
            <circle cx="75" cy="55" r="2.5" fill="#b91c1c"/>
            
            <rect x="25" y="30" width="40" height="20" rx="2" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
            <circle cx="35" cy="40" r="2.5" fill="#991b1b"/>
            <circle cx="45" cy="40" r="2.5" fill="#991b1b"/>
            <circle cx="55" cy="40" r="2.5" fill="#991b1b"/>
        </svg>
    `,
    tiles: (color = '#38bdf8') => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- Floor tile grid -->
            <rect x="15" y="15" width="70" height="70" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
            <rect x="20" y="20" width="28" height="28" fill="${color}" opacity="0.8"/>
            <rect x="52" y="20" width="28" height="28" fill="${color}" opacity="0.6"/>
            <rect x="20" y="52" width="28" height="28" fill="${color}" opacity="0.5"/>
            <rect x="52" y="52" width="28" height="28" fill="${color}"/>
            <path d="M50 15v70M15 50h70" stroke="#cbd5e1" stroke-width="1.5"/>
        </svg>
    `,
    plumbing: () => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- PVC pipe joint -->
            <path d="M15 40h40v-25h16v25h14v16h-14v29h-16v-29h-40z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
            <path d="M55 40h16v16h-16z" fill="#60a5fa"/>
            <!-- Pipe texture lines -->
            <line x1="25" y1="43" x2="25" y2="53" stroke="#1d4ed8" stroke-width="2"/>
            <line x1="32" y1="43" x2="32" y2="53" stroke="#1d4ed8" stroke-width="2"/>
            <line x1="63" y1="22" x2="63" y2="30" stroke="#1d4ed8" stroke-width="2"/>
        </svg>
    `,
    electrical: () => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- Wire coil -->
            <circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" stroke-width="8"/>
            <circle cx="50" cy="50" r="22" fill="none" stroke="#eab308" stroke-width="6"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="#ef4444" stroke-width="5"/>
            <!-- Switch outline -->
            <rect x="40" y="35" width="20" height="30" rx="3" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
            <rect x="45" y="40" width="10" height="12" rx="1" fill="#cbd5e1"/>
            <circle cx="50" cy="58" r="2" fill="#ef4444"/>
        </svg>
    `,
    paints: (color = '#ec4899') => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- Paint bucket -->
            <path d="M25 35h50l-5 45a5 5 0 0 1-5 5H35a5 5 0 0 1-5-5z" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
            <path d="M30 45h40v15H30z" fill="${color}"/>
            <ellipse cx="50" cy="35" rx="25" ry="6" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
            <ellipse cx="50" cy="35" rx="20" ry="4" fill="${color}"/>
            <!-- Handle -->
            <path d="M22 37C22 15 78 15 78 37" fill="none" stroke="#475569" stroke-width="1.5"/>
        </svg>
    `,
    hardware: () => `
        <svg viewBox="0 0 100 100" class="svg-material" style="width:100%; height:100%;">
            <!-- Padlock & wrench -->
            <rect x="30" y="45" width="40" height="30" rx="4" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
            <path d="M38 45v-12a12 12 0 0 1 24 0v12" fill="none" stroke="#94a3b8" stroke-width="3"/>
            <circle cx="50" cy="56" r="3.5" fill="#475569"/>
            <path d="M50 59v8" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `
};

const INITIAL_PRODUCTS = [
    {
        id: 'hd7',
        name: "Greenstone's AAC Brick - 600mmX200mmX150mm (6\")",
        brand: 'Greenstone',
        category: 'bricks',
        price: 65,
        unit: 'Nos',
        description: 'Autoclaved Aerated Concrete bricks by Greenstone (6 Inch thickness) for robust masonry.',
        rating: 4.6,
        ratingCount: 52,
        specs: {
            'Size': '600x200x150mm',
            'Brand': 'Greenstone'
        },
        imageSrc: '<img src="assets/aac_brick.png" alt="Greenstone AAC Brick">'
    },
    {
        id: 'hd8',
        name: 'CCI PPC Cement',
        brand: 'CCI',
        category: 'cement',
        price: 295,
        originalPrice: 430,
        discountLabel: 'UPTO 31% OFF',
        unit: 'Bag',
        description: 'CCI Portland Pozzolana Cement (PPC), offering premium resistance to environmental factors.',
        rating: 4.5,
        ratingCount: 88,
        specs: {
            'Grade': 'PPC Grade',
            'Weight': '50 Kg',
            'Brand': 'Cement Corporation of India'
        },
        imageSrc: '<img src="assets/cci_cement.png" alt="CCI PPC Cement">'
    },
    {
        id: 'hd9',
        name: 'Finolex Pipes 1" PVC Long Bends',
        brand: 'Finolex Pipes',
        category: 'plumbing',
        price: 25.60,
        unit: 'Piece',
        description: 'Heavy duty PVC long bend fittings (1 inch diameter) for seamless irrigation and building flow systems.',
        rating: 4.4,
        ratingCount: 104,
        specs: {
            'Diameter': '1 Inch',
            'Material': 'PVC',
            'Brand': 'Finolex'
        },
        imageSrc: '<img src="assets/pvc_bend.png" alt="Finolex PVC Long Bend">'
    },
    {
        id: 'hd10',
        name: 'Magic Acrylic Wall Putty - 20 Ltr',
        brand: 'Shalimar Paints',
        category: 'paints',
        price: 1350,
        unit: 'Tin',
        description: 'Premium acrylic wall putty by Shalimar Paints, providing a smooth finish for wall coatings.',
        rating: 4.7,
        ratingCount: 65,
        specs: {
            'Volume': '20 Liters',
            'Finish': 'Super White',
            'Brand': 'Shalimar'
        },
        imageSrc: '<img src="assets/wall_putty.png" alt="Shalimar Wall Putty">'
    },
    {
        id: 'hd11',
        name: 'ACB Grey Fly Ash Cement Brick - 9in x 3in x 2in',
        brand: 'ACB Bricks',
        category: 'bricks',
        price: 9,
        unit: 'Piece',
        description: 'Fly ash concrete bricks by ACB Bricks, offering high durability and dimensional accuracy.',
        rating: 4.3,
        ratingCount: 154,
        specs: {
            'Size': '9x3x2 inches',
            'Material': 'Fly Ash Concrete',
            'Brand': 'ACB'
        },
        imageSrc: '<img src="assets/fly_ash_brick.png" alt="ACB Fly Ash Cement Brick">'
    },
    {
        id: 'hd12',
        name: 'Philips Master LED Bulb',
        brand: 'Philips',
        category: 'electrical',
        price: 112,
        unit: 'Piece',
        description: 'Philips Master LED bulb offering bright white illumination and power-saving operations.',
        rating: 4.8,
        ratingCount: 312,
        specs: {
            'Wattage': '9W',
            'Cap type': 'B22',
            'Brand': 'Philips'
        },
        imageSrc: '<img src="assets/led_bulb.png" alt="Philips Master LED Bulb">'
    },
    {
        id: 'hd1',
        name: "Greenstone's AAC Brick - 600mmX200mmX100mm (4\")",
        brand: 'Greenstone',
        category: 'bricks',
        price: 40,
        unit: 'Nos',
        description: 'High quality Autoclaved Aerated Concrete bricks by Greenstone. Durable, lightweight, and thermal insulating.',
        rating: 4.5,
        ratingCount: 38,
        specs: {
            'Size': '600x200x100mm',
            'Compressive Strength': '4 N/mm²',
            'Brand': 'Greenstone'
        },
        imageSrc: '<img src="assets/aac_brick.png" alt="Greenstone AAC Brick">'
    },
    {
        id: 'hd2',
        name: 'Aerobild - 600 x 200 x 230(9")',
        brand: 'Aerobild',
        category: 'bricks',
        price: 135,
        unit: 'Piece',
        description: 'Heavy-duty concrete blocks by Aerobild, ideal for external load-bearing wall construction.',
        rating: 4.6,
        ratingCount: 47,
        specs: {
            'Size': '600x200x230mm',
            'Type': 'Hollow Block',
            'Brand': 'Aerobild'
        },
        imageSrc: '<img src="assets/leo_aac_block.png" alt="Aerobild AAC Block">'
    },
    {
        id: 'hd3',
        name: 'Sugna TMT Fe-550 Grade - 16mm',
        brand: 'Sugna TMT',
        category: 'steel',
        price: 53800,
        originalPrice: 92115,
        discountLabel: 'UPTO 41% OFF',
        unit: 'Ton',
        description: 'High tensile Fe-550 grade TMT reinforcement steel bars by Sugna Steel, offering superior earthquake resistance.',
        rating: 4.8,
        ratingCount: 110,
        specs: {
            'Grade': 'Fe-550',
            'Diameter': '16mm',
            'Brand': 'Sugna Steel'
        },
        imageSrc: SVG_TEMPLATES.steel()
    },
    {
        id: 'hd4',
        name: 'Local Red Brick - 8-10 x 3.8 x 2.9',
        brand: 'Karnataka Red Brick',
        category: 'bricks',
        price: 14,
        unit: 'Piece',
        description: 'High quality standard red clay bricks sourced from trusted local kilns.',
        rating: 4.2,
        ratingCount: 220,
        specs: {
            'Size': '9" x 4" x 3"',
            'Class': 'Class I',
            'Brand': 'Local'
        },
        imageSrc: '<img src="assets/maharashtra_brick.png" alt="Local Red Brick">'
    },
    {
        id: 'hd5',
        name: 'CCI OPC Cement',
        brand: 'CCI',
        category: 'cement',
        price: 265,
        originalPrice: 450,
        discountLabel: 'UPTO 41% OFF',
        unit: 'Bag',
        description: 'CCI Ordinary Portland Cement (OPC) 53 Grade, offering fast setting and high ultimate strength.',
        rating: 4.7,
        ratingCount: 165,
        specs: {
            'Grade': 'OPC 53 Grade',
            'Weight': '50 Kg',
            'Brand': 'Cement Corporation of India'
        },
        imageSrc: '<img src="assets/cci_cement.png" alt="CCI OPC Cement">'
    },
    {
        id: 'hd6',
        name: 'Birla.A1 StrongCrete',
        brand: 'Birla A1',
        category: 'cement',
        price: 290,
        originalPrice: 470,
        discountLabel: 'UPTO 38% OFF',
        unit: 'Bag',
        description: 'Birla.A1 StrongCrete cement is specially engineered for concrete structures, offering water resistance and high durability.',
        rating: 4.9,
        ratingCount: 294,
        specs: {
            'Grade': 'PPC (Special)',
            'Weight': '50 Kg',
            'Brand': 'Birla'
        },
        imageSrc: '<img src="assets/raasi_cement.png" alt="Birla A1 StrongCrete">'
    },
    {
        id: 'p1',
        name: 'UltraTech OPC 53 Grade Cement',
        brand: 'UltraTech',
        category: 'cement',
        price: 430,
        unit: 'Bag',
        description: 'UltraTech OPC 53 is a high strength cement designed for core structural components like foundations, columns, beams, and slabs. Offers fast setting times and excellent compressive strength.',
        rating: 4.8,
        ratingCount: 154,
        specs: {
            'Grade': 'OPC 53',
            'Weight': '50 Kg',
            'Material': 'Ordinary Portland Cement',
            'Packaging': 'Paper/PP Bag',
            'Usage': 'Foundations, Beams, Pillars'
        },
        imageSrc: '<img src="assets/cci_cement.png" alt="UltraTech OPC 53 Grade Cement">'
    },
    {
        id: 'p2',
        name: 'ACC Gold Water Shield Cement',
        brand: 'ACC',
        category: 'cement',
        price: 455,
        unit: 'Bag',
        description: 'ACC Gold is a premium water-repellent cement formulated with active water-resisting agents. Protects your home from dampness and water ingress, suitable for brickwork and plastering.',
        rating: 4.7,
        ratingCount: 92,
        specs: {
            'Grade': 'PPC (Premium)',
            'Weight': '50 Kg',
            'Special Feature': 'Water Shield Formula',
            'Packaging': 'Laminated Bag',
            'Usage': 'Plastering, Brick Jointing, Damp-prone slabs'
        },
        imageSrc: '<img src="assets/raasi_cement.png" alt="ACC Gold Water Shield Cement">'
    },
    {
        id: 'p3',
        name: 'Birla Gold Premium PPC Cement',
        brand: 'Birla Gold',
        category: 'cement',
        price: 395,
        unit: 'Bag',
        description: 'Birla Gold PPC Cement is made by blending high quality clinker with active fly ash. Ideal for general concrete construction, masonry, and plastering with smoother finishes.',
        rating: 4.5,
        ratingCount: 78,
        specs: {
            'Grade': 'PPC',
            'Weight': '50 Kg',
            'Material': 'Portland Pozzolana Cement',
            'Packaging': 'HDPE Bag',
            'Usage': 'Masonry, Plastering, Brickwork'
        },
        imageSrc: '<img src="assets/cci_cement.png" alt="Birla Gold Premium PPC Cement">'
    },
    {
        id: 'p4',
        name: 'Tata Tiscon 550SD TMT Steel Bars',
        brand: 'Tata Tiscon',
        category: 'steel',
        price: 68500,
        unit: 'Ton',
        description: 'Tata Tiscon 550SD (Super Ductile) TMT steel bars are India\'s leading reinforcement steel. Built with superior earthquake resistance, high bendability, and premium bonding with concrete.',
        rating: 4.9,
        ratingCount: 210,
        specs: {
            'Grade': 'Fe 550D',
            'Sizes Available': '8mm, 10mm, 12mm, 16mm, 20mm',
            'Process': 'Thermo-Mechanically Treated (TMT)',
            'Standards': 'IS 1786 Certified',
            'Resistance': 'Earthquake & Corrosion resistant'
        },
        imageSrc: '<img src="assets/promo_steel.png" alt="Tata Tiscon TMT Steel Bars">'
    },
    {
        id: 'p5',
        name: 'JSW Neosteel Fe 550D TMT Bars',
        brand: 'JSW Steel',
        category: 'steel',
        price: 67200,
        unit: 'Ton',
        description: 'JSW Neosteel TMT bars are manufactured using clean steel with lowest impurity levels (Sulphur and Phosphorus). High strength, fatigue-resistant steel bars ideal for residential high-rises.',
        rating: 4.6,
        ratingCount: 118,
        specs: {
            'Grade': 'Fe 550D',
            'Process': 'TMT Tempcore Process',
            'Ductility': 'High Elongation',
            'Bonding': 'Superior Rib Pattern',
            'Usage': 'Multi-story frames, Bridge decks'
        },
        imageSrc: '<img src="assets/promo_steel.png" alt="JSW Neosteel TMT Bars">'
    },
    {
        id: 'p6',
        name: 'Premium Red Clay Bricks (Class I)',
        brand: 'Local Clay Kilns',
        category: 'bricks',
        price: 8,
        unit: 'Piece',
        description: 'Standard size class-I red clay bricks baked in modern kiln chambers. Offers uniform size, sharp edges, and excellent compressive strength, ideal for load-bearing walls.',
        rating: 4.3,
        ratingCount: 340,
        specs: {
            'Material': 'Baked Clay',
            'Dimensions': '9" x 4" x 3"',
            'Compressive Strength': '7.5 N/mm²',
            'Water Absorption': '< 15%',
            'Weight': 'approx 3.2 Kg'
        },
        imageSrc: '<img src="assets/maharashtra_brick.png" alt="Premium Red Clay Bricks">'
    },
    {
        id: 'p7',
        name: 'Autoclaved Aerated Concrete (AAC) Blocks',
        brand: 'Aerocon',
        category: 'bricks',
        price: 65,
        unit: 'Piece',
        description: 'Aerocon lightweight AAC Blocks are modern green building blocks that replace traditional clay bricks. Lightweight, thermal insulating, fire resistant, and reduces steel cost.',
        rating: 4.6,
        ratingCount: 89,
        specs: {
            'Material': 'Autoclaved Aerated Concrete',
            'Size': '600mm x 200mm x 150mm (6")',
            'Density': 'approx 650 kg/m³',
            'Thermal Conductivity': '0.16 W/mK',
            'Weight': 'approx 11 Kg'
        },
        imageSrc: '<img src="assets/aac_brick.png" alt="Autoclaved Aerated Concrete Blocks">'
    },
    {
        id: 'p8',
        name: 'Kajaria Pietra Vitrified Floor Tiles',
        brand: 'Kajaria',
        category: 'tiles',
        price: 62,
        unit: 'SqFt',
        description: 'High gloss vitrified floor tiles with marble grain finish. Double-charge technology ensures long-lasting polish, stain resistance, and high load capacity, perfect for living spaces.',
        rating: 4.7,
        ratingCount: 64,
        specs: {
            'Material': 'Double Charge Vitrified',
            'Size': '600mm x 600mm (2ft x 2ft)',
            'Finish': 'Polished Glazed (Marble Pattern)',
            'Thickness': '9.5 mm',
            'Box Contents': '4 Pieces (15.5 SqFt total)'
        },
        imageSrc: '<img src="assets/ceramic_tile.png" alt="Kajaria Pietra Vitrified Floor Tiles">'
    },
    {
        id: 'p9',
        name: 'Somany Wood-Grain Ceramic Wall Tiles',
        brand: 'Somany',
        category: 'tiles',
        price: 48,
        unit: 'SqFt',
        description: 'Matte-finish ceramic wall tiles with natural wood texture. Waterproof, easy to clean, and slip-proof, making it suitable for bathroom walls and kitchen splashbacks.',
        rating: 4.4,
        ratingCount: 42,
        specs: {
            'Material': 'Ceramic',
            'Size': '300mm x 600mm',
            'Finish': 'Matte / Textured',
            'Usage': 'Bathroom & Kitchen Walls',
            'Waterproofing': 'High resistance'
        },
        imageSrc: '<img src="assets/ceramic_tile.png" alt="Somany Wood-Grain Ceramic Wall Tiles">'
    },
    {
        id: 'p10',
        name: 'Astral CPVC Pro Pipes 1 Inch',
        brand: 'Astral',
        category: 'plumbing',
        price: 490,
        unit: 'Piece',
        description: 'Astral CPVC Pro pipes are engineered for hot and cold water plumbing distribution. Made from lead-free, non-toxic materials, holding pressure up to 28 kg/cm².',
        rating: 4.8,
        ratingCount: 95,
        specs: {
            'Material': 'CPVC Pro (Lead Free)',
            'Diameter': '1 Inch (25mm)',
            'Length': '3 Meters (approx 10ft)',
            'SDR Class': 'SDR 11',
            'Temperature Resistance': 'Up to 93°C'
        },
        imageSrc: '<img src="assets/pvc_bend.png" alt="Astral CPVC Pro Pipes 1 Inch">'
    },
    {
        id: 'p11',
        name: 'Havells LifeLine FRLS Wire 2.5 Sq mm',
        brand: 'Havells',
        category: 'electrical',
        price: 2450,
        unit: 'Coil',
        description: 'Havells LifeLine FRLS (Flame Retardant Low Smoke) copper wire. Rated for high electrical loads, ensures safety against short circuits, and has standard 90-meter coil length.',
        rating: 4.9,
        ratingCount: 142,
        specs: {
            'Conductor': '99.97% Pure Electrolytic Copper',
            'Gauge / Thickness': '2.5 Sq. mm',
            'Insulation': 'PVC (FRLS Spec)',
            'Length': '90 Meters Coil',
            'Current Rating': 'Up to 22 Amps'
        },
        imageSrc: '<img src="assets/led_bulb.png" alt="Havells LifeLine FRLS Wire 2.5 Sq mm">'
    },
    {
        id: 'p12',
        name: 'Asian Paints Apex Ultima Exterior Paint',
        brand: 'Asian Paints',
        category: 'paints',
        price: 4800,
        unit: 'Bucket',
        description: 'Apex Ultima is a premium water-based exterior wall finish featuring advanced anti-algal and dirt pickup resistance. Backed by a 7-year performance warranty.',
        rating: 4.8,
        ratingCount: 88,
        specs: {
            'Type': 'Exterior Emulsion',
            'Volume': '20 Liters',
            'Finish': 'Sheen',
            'Coverage': 'approx 55-60 sq.ft per liter (2 coats)',
            'Base': 'Water-based acrylic'
        },
        imageSrc: '<img src="assets/wall_putty.png" alt="Asian Paints Apex Ultima Exterior Paint">'
    },
    {
        id: 'tr1',
        name: "Greenstone's AAC Brick - 600mmx200mmx100mm (4\")",
        brand: 'Greenstone',
        category: 'bricks',
        price: 40,
        unit: 'Nos',
        description: 'High quality Autoclaved Aerated Concrete bricks by Greenstone (4 Inch thickness).',
        rating: 4.5,
        ratingCount: 38,
        specs: {
            'Size': '600x200x100mm',
            'Brand': 'Greenstone'
        },
        imageSrc: '<img src="assets/aac_brick.png" alt="Greenstone AAC Brick">'
    },
    {
        id: 'tr2',
        name: 'Raasi Gold PPC Cement',
        brand: 'Raasi Gold',
        category: 'cement',
        price: 460,
        unit: 'Bag',
        description: 'Premium PPC cement offering high durability for concrete and plaster applications.',
        rating: 4.6,
        ratingCount: 112,
        specs: {
            'Grade': 'PPC',
            'Weight': '50 Kg',
            'Brand': 'Raasi Gold'
        },
        imageSrc: '<img src="assets/raasi_cement.png" alt="Raasi Gold PPC Cement">'
    },
    {
        id: 'tr3',
        name: '3011 Ceramic Wall Tile - 100mm x 150mm',
        brand: 'Ceramic Tiles',
        category: 'tiles',
        price: 75,
        unit: 'Sft',
        description: 'Textured ceramic wall tiles suitable for kitchens and bathroom wall displays.',
        rating: 4.4,
        ratingCount: 48,
        specs: {
            'Size': '100x150mm',
            'Material': 'Ceramic',
            'Brand': 'Generic'
        },
        imageSrc: '<img src="assets/ceramic_tile.png" alt="Ceramic Wall Tile">'
    },
    {
        id: 'tr4',
        name: "Leo's AAC Blocks - 4\"",
        brand: 'Leo Mintech',
        category: 'bricks',
        price: 60,
        unit: 'Piece',
        description: 'Lightweight and durable 4-inch AAC blocks by Leo Mintech for fast-track wall construction.',
        rating: 4.5,
        ratingCount: 76,
        specs: {
            'Thickness': '4 Inch',
            'Brand': 'Leo Mintech'
        },
        imageSrc: '<img src="assets/leo_aac_block.png" alt="Leo AAC Blocks">'
    },
    {
        id: 'tr5',
        name: 'Maharashtra Red Brick - 9 x 4 x 3',
        brand: 'Maharashtra Red Brick',
        category: 'bricks',
        price: 15,
        unit: 'Piece',
        description: 'Robust red clay bricks sourced from Maharashtra regions, offering high structural load capacity.',
        rating: 4.3,
        ratingCount: 94,
        specs: {
            'Size': '9x4x3 inches',
            'Brand': 'Maharashtra Red Brick'
        },
        imageSrc: '<img src="assets/maharashtra_brick.png" alt="Maharashtra Red Brick">'
    },
    {
        id: 'tr6',
        name: 'Digital Smart Door Lock - VN G111',
        brand: 'Kshema Technos',
        category: 'hardware',
        price: 27998,
        unit: 'Piece',
        description: 'Premium keyless smart door lock featuring fingerprint scanner, digital keypad, and remote access.',
        rating: 4.8,
        ratingCount: 34,
        specs: {
            'Model': 'VN G111',
            'Finish': 'Gold & Black',
            'Brand': 'Kshema Technos'
        },
        imageSrc: '<img src="assets/digital_lock.png" alt="Digital Smart Door Lock">'
    }
];

// Helper Functions for LocalStorage Persistence
const DATA_KEYS = {
    PRODUCTS: 'builderpro_products',
    ORDERS: 'builderpro_orders',
    INQUIRIES: 'builderpro_inquiries',
    CATEGORIES: 'builderpro_categories',
    UNITS: 'builderpro_units',
    BANNERS: 'builderpro_banners',
    GUIDES: 'builderpro_guides',
    DESIGNERS: 'builderpro_designers'
};

const INITIAL_UNITS = [
    { id: 'Bag', name: 'Bag (Cement)' },
    { id: 'Ton', name: 'Ton (Steel/Sand)' },
    { id: 'Piece', name: 'Piece (Bricks/Blocks)' },
    { id: 'SqFt', name: 'SqFt (Tiles/Stones)' },
    { id: 'Coil', name: 'Coil (Electrical)' },
    { id: 'Bucket', name: 'Bucket (Paints)' },
    { id: 'Litre', name: 'Litre (Liquids)' },
    { id: 'Kg', name: 'Kg (Hardware/Nails)' }
];

const INITIAL_DESIGNERS = [
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

// Initialization helper
function initializeData() {
    const existing = localStorage.getItem(DATA_KEYS.PRODUCTS);
    if (!existing || !existing.includes("digital_lock.png") || !existing.includes("UltraTech OPC 53 Grade Cement")) {
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(DATA_KEYS.ORDERS)) {
        localStorage.setItem(DATA_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.INQUIRIES)) {
        localStorage.setItem(DATA_KEYS.INQUIRIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.CATEGORIES)) {
        localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(DATA_KEYS.UNITS)) {
        localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(INITIAL_UNITS));
    }
    if (!localStorage.getItem(DATA_KEYS.BANNERS)) {
        localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
    }
    if (!localStorage.getItem(DATA_KEYS.DESIGNERS)) {
        localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(INITIAL_DESIGNERS));
    }
}

// Product CRUD operations
function getProducts() {
    if (window.SERVER_PRODUCTS) {
        return window.SERVER_PRODUCTS.map(p => {
            if (!p.imageSrc || typeof p.imageSrc === 'string' && p.imageSrc.startsWith('<svg') === false && p.imageSrc.startsWith('<img') === false) {
                const cat = p.category || 'cement';
                p.imageSrc = SVG_TEMPLATES[cat] ? SVG_TEMPLATES[cat]() : SVG_TEMPLATES.cement();
            }
            return p;
        });
    }
    initializeData();
    const prods = JSON.parse(localStorage.getItem(DATA_KEYS.PRODUCTS)) || [];
    return prods.map(p => {
        if (!p.imageSrc || typeof p.imageSrc === 'string' && p.imageSrc.startsWith('<svg') === false && p.imageSrc.startsWith('<img') === false) {
            const cat = p.category || 'cement';
            p.imageSrc = SVG_TEMPLATES[cat] ? SVG_TEMPLATES[cat]() : SVG_TEMPLATES.cement();
        }
        return p;
    });
}

function saveProducts(products) {
    localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
}

function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === id);
}

async function addProduct(product) {
    try {
        const res = await axios.post('/api/products', product);
        const localProds = JSON.parse(localStorage.getItem(DATA_KEYS.PRODUCTS)) || [];
        localProds.unshift(res.data);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(localProds));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add product, updating localStorage fallback.', e);
        const products = getProducts();
        let imgHtml = product.imageSrc;
        if (imgHtml && imgHtml.trim() !== '') {
            imgHtml = imgHtml.trim();
            if (!imgHtml.startsWith('<svg') && !imgHtml.startsWith('<img')) {
                imgHtml = `<img src="${imgHtml}" alt="${product.name}">`;
            }
        } else {
            imgHtml = SVG_TEMPLATES[product.category] ? SVG_TEMPLATES[product.category]() : SVG_TEMPLATES.cement();
        }
        const newProduct = {
            ...product,
            id: 'p_' + Date.now(),
            rating: 5.0,
            ratingCount: 1,
            imageSrc: imgHtml
        };
        products.unshift(newProduct);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
        return newProduct;
    }
}

async function updateProduct(id, updatedProduct) {
    try {
        const res = await axios.put(`/api/products/${id}`, updatedProduct);
        const localProds = JSON.parse(localStorage.getItem(DATA_KEYS.PRODUCTS)) || [];
        const idx = localProds.findIndex(p => p.id === id);
        if (idx !== -1) {
            localProds[idx] = { ...localProds[idx], ...res.data };
            localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(localProds));
        }
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to update product, updating localStorage fallback.', e);
        const products = getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            const original = products[index];
            let imgHtml = updatedProduct.imageSrc;
            if (imgHtml && imgHtml.trim() !== '') {
                imgHtml = imgHtml.trim();
                if (!imgHtml.startsWith('<svg') && !imgHtml.startsWith('<img')) {
                    imgHtml = `<img src="${imgHtml}" alt="${updatedProduct.name}">`;
                }
            } else {
                imgHtml = original.imageSrc.startsWith('<img') ? original.imageSrc : (SVG_TEMPLATES[updatedProduct.category] ? SVG_TEMPLATES[updatedProduct.category]() : original.imageSrc);
            }
            products[index] = {
                ...original,
                ...updatedProduct,
                imageSrc: imgHtml
            };
            localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
            return products[index];
        }
        return null;
    }
}

async function deleteProduct(id) {
    try {
        const res = await axios.delete(`/api/products/${id}`);
        let localProds = JSON.parse(localStorage.getItem(DATA_KEYS.PRODUCTS)) || [];
        localProds = localProds.filter(p => p.id !== id);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(localProds));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete product, updating localStorage fallback.', e);
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
    }
}

// Category details & CRUD operations
function getCategories() {
    if (window.SERVER_CATEGORIES) {
        return window.SERVER_CATEGORIES;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.CATEGORIES)) || INITIAL_CATEGORIES;
}

function saveCategories(categories) {
    localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(categories));
}

async function addCategory(category) {
    try {
        const res = await axios.post('/api/categories', category);
        const localCats = JSON.parse(localStorage.getItem(DATA_KEYS.CATEGORIES)) || [];
        localCats.push(res.data);
        localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(localCats));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add category, updating localStorage fallback.', e);
        const categories = getCategories();
        const id = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        const newCat = {
            id: id,
            name: category.name,
            icon: category.icon || 'boxes',
            desc: category.desc || ''
        };
        if (!categories.find(c => c.id === id)) {
            categories.push(newCat);
            localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(categories));
            return newCat;
        }
        return null;
    }
}

async function deleteCategory(id) {
    try {
        const res = await axios.delete(`/api/categories/${id}`);
        let localCats = JSON.parse(localStorage.getItem(DATA_KEYS.CATEGORIES)) || [];
        localCats = localCats.filter(c => c.id !== id);
        localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(localCats));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete category, updating localStorage fallback.', e);
        let categories = getCategories();
        categories = categories.filter(c => c.id !== id);
        localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(categories));
    }
}

// Measurement Units CRUD operations
function getUnits() {
    if (window.SERVER_UNITS) {
        return window.SERVER_UNITS;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.UNITS)) || INITIAL_UNITS;
}

function saveUnits(units) {
    localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(units));
}

async function addUnit(unit) {
    try {
        const res = await axios.post('/api/units', unit);
        const localUnits = JSON.parse(localStorage.getItem(DATA_KEYS.UNITS)) || [];
        localUnits.push(res.data);
        localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(localUnits));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add unit, updating localStorage fallback.', e);
        const units = getUnits();
        const id = unit.name.replace(/[^a-zA-Z0-9]/g, '');
        const newUnit = {
            id: id,
            name: unit.name
        };
        if (!units.find(u => u.id === id)) {
            units.push(newUnit);
            localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(units));
            return newUnit;
        }
        return null;
    }
}

async function deleteUnit(id) {
    try {
        const res = await axios.delete(`/api/units/${id}`);
        let localUnits = JSON.parse(localStorage.getItem(DATA_KEYS.UNITS)) || [];
        localUnits = localUnits.filter(u => u.id !== id);
        localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(localUnits));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete unit, updating localStorage fallback.', e);
        let units = getUnits();
        units = units.filter(u => u.id !== id);
        localStorage.setItem(DATA_KEYS.UNITS, JSON.stringify(units));
    }
}

// Order operations
function getOrders() {
    if (window.SERVER_ORDERS) {
        return window.SERVER_ORDERS;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.ORDERS)) || [];
}

async function saveOrder(order) {
    try {
        const res = await axios.post('/api/orders', order);
        const localOrders = JSON.parse(localStorage.getItem(DATA_KEYS.ORDERS)) || [];
        localOrders.unshift(res.data);
        localStorage.setItem(DATA_KEYS.ORDERS, JSON.stringify(localOrders));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to save order on server, writing to localStorage fallback.', e);
        const orders = getOrders();
        const newOrder = {
            ...order,
            id: 'ORD_' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toISOString()
        };
        orders.unshift(newOrder);
        localStorage.setItem(DATA_KEYS.ORDERS, JSON.stringify(orders));
        return newOrder;
    }
}

// Inquiry Sourcing Lead operations
function getInquiries() {
    if (window.SERVER_INQUIRIES) {
        return window.SERVER_INQUIRIES;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.INQUIRIES)) || [];
}

async function saveInquiry(inquiry) {
    try {
        const res = await axios.post('/api/leads', inquiry);
        const localInquiries = JSON.parse(localStorage.getItem(DATA_KEYS.INQUIRIES)) || [];
        localInquiries.unshift(res.data);
        localStorage.setItem(DATA_KEYS.INQUIRIES, JSON.stringify(localInquiries));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to save inquiry lead, writing to localStorage fallback.', e);
        const inquiries = getInquiries();
        const newInquiry = {
            ...inquiry,
            id: 'INQ_' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toISOString(),
            status: 'Pending'
        };
        inquiries.unshift(newInquiry);
        localStorage.setItem(DATA_KEYS.INQUIRIES, JSON.stringify(inquiries));
        return newInquiry;
    }
}

// Buying Guide Database & Helpers
const INITIAL_GUIDE_POSTS = [
    {
        id: 'g1',
        title: 'Ensuring Quality In Building Materials',
        date: '2023-08-22 10:08:09',
        imageSrc: 'assets/guide_quality.png'
    },
    {
        id: 'g2',
        title: 'The Future of Building Materials and Eco-Friendly Progress',
        date: '2023-08-05 11:33:21',
        imageSrc: 'assets/guide_future.png'
    },
    {
        id: 'g3',
        title: 'Building Materials at a Cost Effective Price for Small-Scale Projects',
        date: '2023-07-17 06:45:52',
        imageSrc: 'assets/guide_cost.png'
    },
    {
        id: 'g4',
        title: 'The Latest Trends in Sustainable Building Materials',
        date: '2023-04-20 09:12:19',
        imageSrc: 'assets/guide_trends.png'
    },
    {
        id: 'g5',
        title: 'Renovation vs. Remodeling: Which One is Better?',
        date: '2021-08-13 12:18:00',
        imageSrc: 'assets/guide_renovation.png'
    },
    {
        id: 'g6',
        title: 'Foundation Cracks - When to Hire an Expert?',
        date: '2021-06-04 07:18:00',
        imageSrc: `<svg viewBox="0 0 400 250" style="background:#f1f5f9; width:100%; height:100%; border-radius:4px; display:block;">
            <rect width="100%" height="100%" fill="#cbd5e1" opacity="0.5"/>
            <rect x="150" y="80" width="100" height="90" fill="#f8fafc" stroke="#475569" stroke-width="3"/>
            <polygon points="130,80 200,30 270,80" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/>
            <path d="M150 170 l15 -20 l-10 -15 l20 -30" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
            <path d="M230 170 l-10 -25 l15 -20" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <text x="200" y="210" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">FOUNDATION CRACKS</text>
        </svg>`
    }
];

function getGuidePosts() {
    if (window.SERVER_GUIDES) {
        return window.SERVER_GUIDES;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.GUIDES)) || INITIAL_GUIDE_POSTS;
}

function saveGuidePosts(guides) {
    localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(guides));
}

async function addGuidePost(guide) {
    try {
        const res = await axios.post('/api/guides', guide);
        const localGuides = JSON.parse(localStorage.getItem(DATA_KEYS.GUIDES)) || [];
        localGuides.push(res.data);
        localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(localGuides));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add guide post, updating localStorage fallback.', e);
        const guides = getGuidePosts();
        const newGuide = {
            ...guide,
            id: 'g_' + Date.now()
        };
        guides.push(newGuide);
        localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(guides));
        return newGuide;
    }
}

async function updateGuidePost(id, updatedGuide) {
    try {
        const res = await axios.put(`/api/guides/${id}`, updatedGuide);
        const localGuides = JSON.parse(localStorage.getItem(DATA_KEYS.GUIDES)) || [];
        const idx = localGuides.findIndex(g => g.id === id);
        if (idx !== -1) {
            localGuides[idx] = { ...localGuides[idx], ...res.data };
            localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(localGuides));
        }
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to update guide post, updating localStorage fallback.', e);
        const guides = getGuidePosts();
        const index = guides.findIndex(g => g.id === id);
        if (index !== -1) {
            guides[index] = {
                ...guides[index],
                ...updatedGuide
            };
            localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(guides));
            return guides[index];
        }
        return null;
    }
}

async function deleteGuidePost(id) {
    try {
        const res = await axios.delete(`/api/guides/${id}`);
        let localGuides = JSON.parse(localStorage.getItem(DATA_KEYS.GUIDES)) || [];
        localGuides = localGuides.filter(g => g.id !== id);
        localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(localGuides));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete guide post, updating localStorage fallback.', e);
        let guides = getGuidePosts();
        guides = guides.filter(g => g.id !== id);
        localStorage.setItem(DATA_KEYS.GUIDES, JSON.stringify(guides));
    }
}

// Banners CRUD operations
function getBanners() {
    if (window.SERVER_BANNERS) {
        return window.SERVER_BANNERS;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.BANNERS)) || INITIAL_BANNERS;
}

function saveBanners(banners) {
    localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(banners));
}

async function addBanner(banner) {
    try {
        const res = await axios.post('/api/banners', banner);
        const localBanners = JSON.parse(localStorage.getItem(DATA_KEYS.BANNERS)) || [];
        localBanners.push(res.data);
        localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(localBanners));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add banner, updating localStorage fallback.', e);
        const banners = getBanners();
        const newBanner = {
            id: 'b_' + Date.now(),
            imageSrc: banner.imageSrc,
            link: banner.link || '#/products',
            styleType: banner.styleType || 'cover',
            position: banner.position || 'center',
            bgColor: banner.bgColor || '#ffffff'
        };
        banners.push(newBanner);
        localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(banners));
        return newBanner;
    }
}

async function updateBanner(id, updatedBanner) {
    try {
        const res = await axios.put(`/api/banners/${id}`, updatedBanner);
        const localBanners = JSON.parse(localStorage.getItem(DATA_KEYS.BANNERS)) || [];
        const idx = localBanners.findIndex(b => b.id === id);
        if (idx !== -1) {
            localBanners[idx] = { ...localBanners[idx], ...res.data };
            localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(localBanners));
        }
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to update banner, updating localStorage fallback.', e);
        const banners = getBanners();
        const index = banners.findIndex(b => b.id === id);
        if (index !== -1) {
            banners[index] = {
                ...banners[index],
                ...updatedBanner
            };
            localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(banners));
            return banners[index];
        }
        return null;
    }
}

async function deleteBanner(id) {
    try {
        const res = await axios.delete(`/api/banners/${id}`);
        let localBanners = JSON.parse(localStorage.getItem(DATA_KEYS.BANNERS)) || [];
        localBanners = localBanners.filter(b => b.id !== id);
        localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(localBanners));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete banner, updating localStorage fallback.', e);
        let banners = getBanners();
        banners = banners.filter(b => b.id !== id);
        localStorage.setItem(DATA_KEYS.BANNERS, JSON.stringify(banners));
    }
}

// Designers CRUD operations
function getDesigners() {
    if (window.SERVER_DESIGNERS) {
        return window.SERVER_DESIGNERS;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.DESIGNERS)) || [];
}

function saveDesigners(designers) {
    localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(designers));
}

async function addDesigner(designer) {
    try {
        const res = await axios.post('/api/designers', designer);
        const localDesigners = JSON.parse(localStorage.getItem(DATA_KEYS.DESIGNERS)) || [];
        localDesigners.push(res.data);
        localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(localDesigners));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add designer, updating localStorage fallback.', e);
        const designers = getDesigners();
        const newDesigner = {
            ...designer,
            id: designer.name ? designer.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : 'designer-' + Date.now()
        };
        designers.push(newDesigner);
        localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(designers));
        return newDesigner;
    }
}

async function updateDesigner(id, updatedDesigner) {
    try {
        const res = await axios.put(`/api/designers/${id}`, updatedDesigner);
        const localDesigners = JSON.parse(localStorage.getItem(DATA_KEYS.DESIGNERS)) || [];
        const idx = localDesigners.findIndex(d => d.id === id);
        if (idx !== -1) {
            localDesigners[idx] = { ...localDesigners[idx], ...res.data };
            localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(localDesigners));
        }
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to update designer, updating localStorage fallback.', e);
        const designers = getDesigners();
        const index = designers.findIndex(d => d.id === id);
        if (index !== -1) {
            designers[index] = {
                ...designers[index],
                ...updatedDesigner
            };
            localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(designers));
            return designers[index];
        }
        return null;
    }
}

async function deleteDesigner(id) {
    try {
        const res = await axios.delete(`/api/designers/${id}`);
        let localDesigners = JSON.parse(localStorage.getItem(DATA_KEYS.DESIGNERS)) || [];
        localDesigners = localDesigners.filter(d => d.id !== id);
        localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(localDesigners));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete designer, updating localStorage fallback.', e);
        let designers = getDesigners();
        designers = designers.filter(d => d.id !== id);
        localStorage.setItem(DATA_KEYS.DESIGNERS, JSON.stringify(designers));
    }
}
