// ==========================================================================
// DATA LAYER: Categories, Products & LocalStorage Handlers
// ==========================================================================

const INITIAL_CATEGORIES = [
    {
        id: 'cement',
        name: 'Cement & Concrete',
        icon: 'boxes',
        desc: 'OPC & PPC Cements, Ready Mix Concrete',
        subcategories: [
            { id: 'opc-cement', name: 'OPC 53 Grade Cement' },
            { id: 'ppc-cement', name: 'PPC Pozzolana Cement' },
            { id: 'rmc-concrete', name: 'Ready Mix Concrete (RMC)' },
            { id: 'white-cement', name: 'White Cement & Wall Care' }
        ]
    },
    {
        id: 'steel',
        name: 'TMT Steel Bars',
        icon: 'anvil',
        desc: 'Reinforcement bars for columns & slabs',
        subcategories: [
            { id: 'fe500d', name: 'Fe 500D TMT Steel Bars' },
            { id: 'fe550d', name: 'Fe 550D TMT Steel Bars' },
            { id: 'structural-steel', name: 'Structural Beams & Channels' },
            { id: 'binding-wire', name: 'Binding Wires & Stirrups' }
        ]
    },
    {
        id: 'bricks',
        name: 'Bricks & Blocks',
        icon: 'layers',
        desc: 'Red clay bricks, fly ash & AAC blocks',
        subcategories: [
            { id: 'red-clay-bricks', name: 'Red Clay Kiln Bricks' },
            { id: 'fly-ash-bricks', name: 'Fly Ash Bricks' },
            { id: 'aac-blocks', name: 'AAC Lightweight Blocks' },
            { id: 'solid-blocks', name: 'Concrete Solid & Hollow Blocks' }
        ]
    },
    {
        id: 'lockers-safes',
        name: 'Digital Lockers & Safes',
        icon: 'shield-check',
        desc: 'Biometric, keypad digital security lockers & fireproof cash vaults',
        subcategories: [
            { id: 'digital-lockers', name: 'Electronic Digital Keypad Safes' },
            { id: 'biometric-lockers', name: 'Smart Biometric Fingerprint Lockers' },
            { id: 'fireproof-safes', name: 'Fire & Burglar Resistant Safes' },
            { id: 'heavy-vaults', name: 'Heavy Duty Commercial Cash Vaults' }
        ]
    },
    {
        id: 'pvc-panels',
        name: 'PVC Wall Panels & Louvers',
        icon: 'layout-grid',
        desc: '3D fluted louvers, charcoal panels, UV marble sheets & ceiling panels',
        subcategories: [
            { id: '3d-fluted-louvers', name: '3D Fluted Charcoal & Wood Louvers' },
            { id: 'waterproof-pvc-panels', name: 'Waterproof Decorative Wall Panels' },
            { id: 'marble-finish-sheets', name: 'UV Marble Sheet Wall Cladding' },
            { id: 'acoustic-wall-slats', name: 'Acoustic Wooden Slatted Panels' }
        ]
    },
    {
        id: 'wooden-flooring',
        name: 'Wooden & Laminate Flooring',
        icon: 'rows-3',
        desc: 'AC4 laminate, engineered oak, hardwood parquet & waterproof SPC planks',
        subcategories: [
            { id: 'laminate-flooring', name: 'HDF AC4 Scratch-Resistant Laminate' },
            { id: 'engineered-hardwood', name: 'Engineered Oak & Teak Flooring' },
            { id: 'spc-vinyl-flooring', name: '100% Waterproof SPC Rigid Core Planks' },
            { id: 'herringbone-parquet', name: 'Herringbone & Chevron Parquet Planks' }
        ]
    },
    {
        id: 'designer-wallpapers',
        name: 'Designer 3D & Luxury Wallpapers',
        icon: 'sparkles',
        desc: '3D metallic wallpapers, textured royal damask & nature murals',
        subcategories: [
            { id: '3d-geometric-wallpapers', name: '3D Geometric & Metallic Wallpapers' },
            { id: 'textured-damask', name: 'Royal Damask & Embossed Wallpapers' },
            { id: 'botanical-nature', name: 'Nature & Floral Mural Wallpapers' },
            { id: 'brick-stone-textures', name: 'Rustic Stone & Brick Finish Wallpapers' }
        ]
    },
    {
        id: 'tiles',
        name: 'Tiles & Natural Stones',
        icon: 'grid',
        desc: 'Ceramic, vitrified tiles, granite slabs & Italian marble',
        subcategories: [
            { id: 'vitrified-tiles', name: 'Vitrified Floor Tiles' },
            { id: 'ceramic-tiles', name: 'Ceramic Wall Tiles' },
            { id: 'granite-marble', name: 'Granite & Natural Marble' },
            { id: 'parking-outdoor-tiles', name: 'Heavy-Duty Anti-Skid Paver Tiles' }
        ]
    },
    {
        id: 'plumbing',
        name: 'Plumbing & Pipes',
        icon: 'droplet',
        desc: 'CPVC, PVC pipes & bathroom fittings',
        subcategories: [
            { id: 'cpvc-pipes', name: 'CPVC & UPVC Water Pipes' },
            { id: 'pipe-fittings', name: 'Pipes Bends & Coupling Fittings' },
            { id: 'sanitaryware', name: 'Sanitaryware & Wash Basins' },
            { id: 'faucets-taps', name: 'Bathroom Faucets & Showers' }
        ]
    },
    {
        id: 'electrical',
        name: 'Electricals & Wires',
        icon: 'zap',
        desc: 'FRLS wires, modular switches & lights',
        subcategories: [
            { id: 'frls-wires', name: 'FRLS Copper Wires' },
            { id: 'modular-switches', name: 'Modular Switches & Sockets' },
            { id: 'led-lights', name: 'LED Ceiling & Panel Lights' },
            { id: 'mcb-boards', name: 'MCB & Distribution Boards' }
        ]
    },
    {
        id: 'paints',
        name: 'Paints & Finishes',
        icon: 'paint-bucket',
        desc: 'Interior, exterior paints, wall putty & wood polish',
        subcategories: [
            { id: 'interior-paints', name: 'Interior Emulsion Paints' },
            { id: 'exterior-paints', name: 'Exterior Weatherproof Paints' },
            { id: 'wall-putty', name: 'Acrylic Wall Putty & Primers' },
            { id: 'wood-finishes', name: 'Wood Polish & Metal Enamels' }
        ]
    },
    {
        id: 'hardware',
        name: 'Hardware & Fixtures',
        icon: 'wrench',
        desc: 'Smart digital locks, SS hinges, screws, fasteners & drawer channels',
        subcategories: [
            { id: 'digital-locks', name: 'Smart Digital & Mortise Locks' },
            { id: 'door-hinges', name: 'Stainless Steel Hinges & Handles' },
            { id: 'screws-fasteners', name: 'Screws, Bolts & Fasteners' },
            { id: 'cabinet-hardware', name: 'Cabinet Fittings & Channels' },
            { id: 'door-handles-locks', name: 'Mortise Handles & Main Door Locks' }
        ]
    },
    {
        id: 'interior',
        name: 'Interior & Living',
        icon: 'sofa',
        desc: 'Luxury living sofas, coffee tables, wall decor & designer lighting',
        subcategories: [
            { id: 'sofas-seating', name: 'Luxury Sofas & Living Seating' },
            { id: 'center-tables', name: 'Center Coffee & Dining Tables' },
            { id: 'wall-decor', name: 'Wall Decor & Art Frames' },
            { id: 'lighting-lamps', name: 'Modern Lighting & Pendant Lamps' },
            { id: 'rugs-carpets', name: 'Plush Area Rugs & Floor Carpets' }
        ]
    }
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
        imageSrc: 'assets/banner2.png',
        link: '#/products',
        styleType: 'cover',
        position: 'center',
        bgColor: '#ffffff'
    },
    {
        id: 'b3',
        imageSrc: 'assets/banner3.png',
        link: '#/products',
        styleType: 'cover',
        position: 'center',
        bgColor: '#ffffff'
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
        subcategory: 'aac-blocks',
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
        subcategory: 'ppc-cement',
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
        subcategory: 'pipe-fittings',
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
        subcategory: 'wall-putty',
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
        subcategory: 'fly-ash-bricks',
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
        subcategory: 'led-lights',
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
        subcategory: 'aac-blocks',
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
        subcategory: 'solid-blocks',
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
        subcategory: 'fe550d',
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
        imageSrc: '<img src="assets/promo_steel.png" alt="Sugna TMT Steel Bars">'
    },
    {
        id: 'hd4',
        name: 'Local Red Brick - 8-10 x 3.8 x 2.9',
        brand: 'Karnataka Red Brick',
        category: 'bricks',
        subcategory: 'red-clay-bricks',
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
        subcategory: 'opc-cement',
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
        subcategory: 'opc-cement',
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
        subcategory: 'opc-cement',
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
        subcategory: 'ppc-cement',
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
        subcategory: 'ppc-cement',
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
        subcategory: 'fe500d',
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
        subcategory: 'fe550d',
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
        subcategory: 'red-clay-bricks',
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
        subcategory: 'aac-blocks',
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
        subcategory: 'vitrified-tiles',
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
        subcategory: 'ceramic-tiles',
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
        subcategory: 'cpvc-pipes',
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
        subcategory: 'frls-wires',
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
        subcategory: 'exterior-paints',
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
        subcategory: 'aac-blocks',
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
        subcategory: 'ppc-cement',
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
        subcategory: 'ceramic-tiles',
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
        id: 'e2',
        name: 'Anchor Roma Classic 6-Module Switch Plate & Modular Switches',
        brand: 'Anchor Roma',
        category: 'electrical',
        subcategory: 'modular-switches',
        price: 480,
        originalPrice: 650,
        discountLabel: '26% OFF',
        unit: 'Set',
        description: 'Premium flame-retardant polycarbonate 6-module grid plate with silver cadmium contact switches.',
        rating: 4.8,
        ratingCount: 95,
        specs: { 'Modules': '6 Module', 'Color': 'Glossy White', 'Brand': 'Anchor Roma' },
        imageSrc: 'assets/modular_switch.jpg'
    },
    {
        id: 'e3',
        name: 'Syska 12W Slim Concealed LED Ceiling Light',
        brand: 'Syska LED',
        category: 'electrical',
        subcategory: 'led-lights',
        price: 290,
        originalPrice: 450,
        discountLabel: '35% OFF',
        unit: 'Piece',
        description: 'Energy efficient cool day white round concealed LED ceiling panel light fixture.',
        rating: 4.6,
        ratingCount: 130,
        specs: { 'Wattage': '12W', 'Color': 'Cool White', 'Brand': 'Syska' },
        imageSrc: 'assets/led_bulb.png'
    },
    {
        id: 'e4',
        name: 'Schneider 4-Pole MCB & Distribution Board',
        brand: 'Schneider Electric',
        category: 'electrical',
        subcategory: 'mcb-boards',
        price: 1420,
        originalPrice: 1850,
        discountLabel: '23% OFF',
        unit: 'Piece',
        description: 'Double door metal distribution board with 4-pole 32A Miniature Circuit Breaker for safety.',
        rating: 4.8,
        ratingCount: 44,
        specs: { 'Current': '32A', 'Poles': '4 Pole', 'Brand': 'Schneider' },
        imageSrc: 'assets/mcb_board.jpg'
    },
    {
        id: 'pt1',
        name: 'Asian Paints Royale Luxury Interior Emulsion (20L)',
        brand: 'Asian Paints',
        category: 'paints',
        subcategory: 'interior-paints',
        price: 6450,
        originalPrice: 7800,
        discountLabel: '17% OFF',
        unit: 'Tin',
        description: 'Washable Teflon surface protected interior acrylic emulsion paint with sheen finish.',
        rating: 4.9,
        ratingCount: 160,
        specs: { 'Quantity': '20 Liters', 'Finish': 'Soft Sheen', 'Brand': 'Asian Paints' },
        imageSrc: 'assets/paint_bucket.jpg'
    },
    {
        id: 'pt2',
        name: 'Dulux WeatherShield Exterior Paint (20L)',
        brand: 'Dulux',
        category: 'paints',
        subcategory: 'exterior-paints',
        price: 5900,
        originalPrice: 7200,
        discountLabel: '18% OFF',
        unit: 'Tin',
        description: 'Anti-fungal weather proof exterior acrylic emulsion wall paint with sun-reflect tech.',
        rating: 4.8,
        ratingCount: 92,
        specs: { 'Quantity': '20 Liters', 'Finish': 'Matte Exterior', 'Brand': 'Dulux' },
        imageSrc: 'assets/paint_bucket.jpg'
    },
    {
        id: 'pt3',
        name: 'Magic Acrylic Smooth Wall Putty - 20 Ltr',
        brand: 'Shalimar Paints',
        category: 'paints',
        subcategory: 'wall-putty',
        price: 1350,
        originalPrice: 1700,
        discountLabel: '20% OFF',
        unit: 'Tin',
        description: 'Heavy duty acrylic wall putty for smoothing interior wall surfaces before painting.',
        rating: 4.6,
        ratingCount: 87,
        specs: { 'Quantity': '20 Liters', 'Type': 'Acrylic Putty', 'Brand': 'Shalimar' },
        imageSrc: 'assets/wall_putty.png'
    },
    {
        id: 'pt4',
        name: 'Melamyne Clear Gloss Wood Polish Enamel (4L)',
        brand: 'Asian Paints',
        category: 'paints',
        subcategory: 'wood-finishes',
        price: 1280,
        originalPrice: 1600,
        discountLabel: '20% OFF',
        unit: 'Tin',
        description: 'Acid curing transparent polyurethane wood finish polish for doors and wooden furniture.',
        rating: 4.7,
        ratingCount: 51,
        specs: { 'Quantity': '4 Liters', 'Finish': 'High Gloss', 'Brand': 'Asian Paints' },
        imageSrc: 'assets/paint_bucket.jpg'
    },
    {
        id: 'h1',
        name: 'VN G111 Digital Smart Fingerprint Door Lock',
        brand: 'Kshema Technos',
        category: 'hardware',
        subcategory: 'digital-locks',
        price: 27998,
        originalPrice: 35000,
        discountLabel: '20% OFF',
        unit: 'Piece',
        description: 'Keyless smart biometric door lock with fingerprint scanner, PIN keypad, RFID card & mobile app.',
        rating: 4.9,
        ratingCount: 40,
        specs: { 'Access': 'Fingerprint & PIN', 'Finish': 'Gold & Black', 'Brand': 'Kshema Technos' },
        imageSrc: 'assets/digital_lock.png'
    },
    {
        id: 'h2',
        name: 'Stainless Steel Ball Bearing Door Hinges (4 Inch)',
        brand: 'Godrej Hardware',
        category: 'hardware',
        subcategory: 'door-hinges',
        price: 340,
        originalPrice: 450,
        discountLabel: '24% OFF',
        unit: 'Pair',
        description: 'Heavy gauge SS 304 anti-rust ball bearing door hinges for main wooden doors.',
        rating: 4.8,
        ratingCount: 78,
        specs: { 'Size': '4 Inches', 'Material': 'SS 304 Steel', 'Brand': 'Godrej' },
        imageSrc: 'assets/door_hinge.jpg'
    },
    {
        id: 'h3',
        name: 'Steel Anchor Fasteners & Self Tapping Screws Box',
        brand: 'Hilti',
        category: 'hardware',
        subcategory: 'screws-fasteners',
        price: 450,
        originalPrice: 600,
        discountLabel: '25% OFF',
        unit: 'Box',
        description: 'Assorted zinc plated steel wood screws and wall anchor expansion bolts (Box of 200 pcs).',
        rating: 4.6,
        ratingCount: 65,
        specs: { 'Quantity': '200 Pieces', 'Material': 'Zinc Plated Steel', 'Brand': 'Hilti' },
        imageSrc: 'assets/screws_bolts.jpg'
    },
    {
        id: 'h4',
        name: 'Soft-Close Telescopic Drawer Channels (18 Inch)',
        brand: 'Hettich',
        category: 'hardware',
        subcategory: 'cabinet-hardware',
        price: 620,
        originalPrice: 800,
        discountLabel: '22% OFF',
        unit: 'Pair',
        description: 'Full extension soft-close ball bearing drawer runner channels for kitchen modular drawers.',
        rating: 4.9,
        ratingCount: 82,
        specs: { 'Size': '18 Inches', 'Load': '45 Kg', 'Brand': 'Hettich' },
        imageSrc: 'assets/screws_bolts.jpg'
    },
    {
        id: 'int1',
        name: 'Luxury Velvet 3-Seater Living Room Sofa',
        brand: 'Urban Living',
        category: 'interior',
        subcategory: 'sofas-seating',
        price: 24999,
        originalPrice: 32999,
        discountLabel: '24% OFF',
        unit: 'Piece',
        description: 'Ergonomic 3-seater plush velvet sofa with high-density foam cushioning for living rooms.',
        rating: 4.8,
        ratingCount: 42,
        specs: { 'Material': 'Velvet & Solid Wood', 'Seating': '3 Seater', 'Brand': 'Urban Living' },
        imageSrc: 'assets/interior_sofa.jpg'
    },
    {
        id: 'int2',
        name: 'Nordic Solid Oak Wood Coffee Table',
        brand: 'WoodCraft',
        category: 'interior',
        subcategory: 'center-tables',
        price: 8499,
        originalPrice: 11999,
        discountLabel: '29% OFF',
        unit: 'Piece',
        description: 'Minimalist Scandinavian design coffee table with natural grain finish and scratch-resistant coat.',
        rating: 4.7,
        ratingCount: 38,
        specs: { 'Size': '110x60 cm', 'Material': 'Solid Oak Wood', 'Brand': 'WoodCraft' },
        imageSrc: 'assets/interior_table.jpg'
    },
    {
        id: 'int3',
        name: 'Modern Industrial Pendant Ceiling Light',
        brand: 'Lumina Decor',
        category: 'interior',
        subcategory: 'lighting-lamps',
        price: 3299,
        originalPrice: 4999,
        discountLabel: '34% OFF',
        unit: 'Set',
        description: 'Aesthetic metal pendant hanging lamp fixture with warm LED filament illumination.',
        rating: 4.6,
        ratingCount: 54,
        specs: { 'Material': 'Matte Black Metal', 'Bulb': 'E27 LED', 'Brand': 'Lumina' },
        imageSrc: 'assets/interior_pendant_light.jpg'
    },
    {
        id: 'int4',
        name: 'Ergonomic Velvet Accent Lounge Chair',
        brand: 'Urban Living',
        category: 'interior',
        subcategory: 'sofas-seating',
        price: 12999,
        originalPrice: 17500,
        discountLabel: '25% OFF',
        unit: 'Piece',
        description: 'Comfortable lounge accent arm chair with brass metallic legs and soft upholstery.',
        rating: 4.9,
        ratingCount: 61,
        specs: { 'Legs': 'Gold Plated Brass', 'Upholstery': 'Velvet', 'Brand': 'Urban Living' },
        imageSrc: 'assets/interior_accent_chair.jpg'
    },
    {
        id: 'int5',
        name: 'Abstract Canvas Wall Art Frame (Set of 3)',
        brand: 'Artisan Gallery',
        category: 'interior',
        subcategory: 'wall-decor',
        price: 4199,
        originalPrice: 5999,
        discountLabel: '30% OFF',
        unit: 'Set',
        description: 'HD gallery wrap canvas prints with wooden inner frame for modern wall decor.',
        rating: 4.8,
        ratingCount: 29,
        specs: { 'Size': '24x36 Inches Each', 'Material': 'Canvas', 'Brand': 'Artisan Gallery' },
        imageSrc: 'assets/interior_wall_art.jpg'
    },
    {
        id: 'int6',
        name: 'Handwoven Boho Plush Area Rug (6 x 9 ft)',
        brand: 'RugArt Studio',
        category: 'interior',
        subcategory: 'rugs-carpets',
        price: 7999,
        originalPrice: 10999,
        discountLabel: '27% OFF',
        unit: 'Piece',
        description: 'Ultra-soft micro-fiber handwoven carpet rug with anti-skid backing.',
        rating: 4.7,
        ratingCount: 46,
        specs: { 'Size': '6x9 Feet', 'Material': 'Microfiber & Cotton', 'Brand': 'RugArt' },
        imageSrc: 'assets/interior_area_rug.jpg'
    },
    {
        id: 'int7',
        name: 'Modular Engineered Wood Bookshelf Unit',
        brand: 'WoodCraft',
        category: 'interior',
        subcategory: 'center-tables',
        price: 9499,
        originalPrice: 13999,
        discountLabel: '32% OFF',
        unit: 'Piece',
        description: 'Multi-tier display open shelf cabinet for organizing books and planters.',
        rating: 4.6,
        ratingCount: 33,
        specs: { 'Tiers': '5 Shelves', 'Material': 'Engineered Wood', 'Brand': 'WoodCraft' },
        imageSrc: 'assets/interior_bookshelf.jpg'
    },
    {
        id: 'int8',
        name: 'Handcrafted Ceramic Decorative Table Vase Set',
        brand: 'Artisan Gallery',
        category: 'interior',
        subcategory: 'wall-decor',
        price: 2199,
        originalPrice: 3499,
        discountLabel: '37% OFF',
        unit: 'Set',
        description: 'Set of 2 modern minimalist ceramic flower vases with matte finish.',
        rating: 4.9,
        ratingCount: 50,
        specs: { 'Quantity': '2 Vases', 'Material': 'Ceramic', 'Brand': 'Artisan Gallery' },
        imageSrc: 'assets/interior_vase.jpg'
    },
    {
        id: 'h_lock1',
        name: 'Godrej Security Forte Pro Digital Electronic Locker (15L)',
        brand: 'Godrej',
        category: 'lockers-safes',
        subcategory: 'digital-lockers',
        price: 7999,
        originalPrice: 9999,
        discountLabel: '20% OFF',
        unit: 'Piece',
        description: 'Heavy gauge steel motorized shooting bolts with password access and emergency override keys for cash & jewelry.',
        rating: 4.9,
        ratingCount: 84,
        specs: { 'Capacity': '15 Litres', 'Lock Type': 'Digital PIN + Key', 'Brand': 'Godrej Security' },
        imageSrc: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'h_lock2',
        name: 'Yale Touchscreen Biometric & Keypad Home Security Safe Locker',
        brand: 'Yale',
        category: 'lockers-safes',
        subcategory: 'biometric-lockers',
        price: 14499,
        originalPrice: 18999,
        discountLabel: '24% OFF',
        unit: 'Piece',
        description: 'Premium laser-cut door biometric fingerprint and digital keypad electronic locker with internal LED illumination.',
        rating: 4.8,
        ratingCount: 62,
        specs: { 'Lock Type': 'Fingerprint + PIN', 'Material': 'Reinforced Alloy Steel', 'Brand': 'Yale' },
        imageSrc: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'h_lock3',
        name: 'Ozone Fireproof Heavy Duty Commercial Cash Safe Locker',
        brand: 'Ozone',
        category: 'lockers-safes',
        subcategory: 'fireproof-safes',
        price: 21999,
        originalPrice: 28500,
        discountLabel: '23% OFF',
        unit: 'Piece',
        description: 'Double-walled fire-resistant concrete insulation certified for 1 hour at 1000°C for documents and cash.',
        rating: 4.9,
        ratingCount: 45,
        specs: { 'Fire Resistance': '1 Hour at 1000°C', 'Lock Type': 'Dual Key + PIN', 'Brand': 'Ozone' },
        imageSrc: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'h_lock4',
        name: 'Godrej Rhino Heavy Steel Commercial Cash Vault Safe',
        brand: 'Godrej',
        category: 'lockers-safes',
        subcategory: 'heavy-vaults',
        price: 34500,
        originalPrice: 42000,
        discountLabel: '18% OFF',
        unit: 'Piece',
        description: 'High security reinforced solid steel vault safe (100x stronger) with multi-point active drill-proof locking bolts.',
        rating: 4.9,
        ratingCount: 39,
        specs: { 'Weight': '85 Kg', 'Material': 'Armor Steel Plating', 'Brand': 'Godrej Security' },
        imageSrc: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'pvc_p1',
        name: 'Eurostar 3D Charcoal Fluted Louver PVC Wall Panel (10ft x 5in)',
        brand: 'Eurostar',
        category: 'pvc-panels',
        subcategory: '3d-fluted-louvers',
        price: 480,
        originalPrice: 650,
        discountLabel: '26% OFF',
        unit: 'Piece',
        description: '100% waterproof termite-proof acoustic fluted charcoal wall cladding panel for TV units and bed backdrops.',
        rating: 4.9,
        ratingCount: 73,
        specs: { 'Dimensions': '10ft x 5inch', 'Pattern': '3D Fluted Louver', 'Material': 'Polyvinyl Charcoal' },
        imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'pvc_p2',
        name: 'DecoTeak Natural Woodgrain Waterproof PVC Wall & Ceiling Panel',
        brand: 'DecoTeak',
        category: 'pvc-panels',
        subcategory: 'waterproof-pvc-panels',
        price: 320,
        originalPrice: 450,
        discountLabel: '29% OFF',
        unit: 'Piece',
        description: 'Interlocking tongue-and-groove PVC false ceiling and wall panel with natural matte teak wood texture.',
        rating: 4.7,
        ratingCount: 58,
        specs: { 'Dimensions': '8ft x 10inch', 'Finish': 'Natural Teak Grain', 'Features': 'Waterproof & Fire Retardant' },
        imageSrc: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'pvc_p3',
        name: 'Royal Statuario High Gloss UV Marble Sheet PVC Wall Cladding (8ft x 4ft)',
        brand: 'Eurostar',
        category: 'pvc-panels',
        subcategory: 'marble-finish-sheets',
        price: 1850,
        originalPrice: 2400,
        discountLabel: '23% OFF',
        unit: 'Sheet',
        description: 'Seamless lightweight UV marble sheet for luxury lobby walls, kitchen backsplashes, and bathroom feature walls.',
        rating: 4.8,
        ratingCount: 51,
        specs: { 'Size': '8ft x 4ft (3mm thickness)', 'Finish': 'High Gloss UV Polish', 'Pattern': 'Statuario Italian White' },
        imageSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'pvc_p4',
        name: 'Acoustic Slatted Charcoal & Oak Wood Sound-Absorbing Wall Panel',
        brand: 'DecoTeak',
        category: 'pvc-panels',
        subcategory: 'acoustic-wall-slats',
        price: 1450,
        originalPrice: 1950,
        discountLabel: '26% OFF',
        unit: 'Piece',
        description: 'Felt backed sound-dampening acoustic wooden wall slats for home theatres, recording spaces, and living lounges.',
        rating: 4.9,
        ratingCount: 42,
        specs: { 'Size': '8ft x 2ft', 'Backing': 'Sound Absorption Felt', 'Slats': 'MDF Woodgrain Veneer' },
        imageSrc: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wood_fl1',
        name: 'Action TESA AC4 HDF Interlocking Laminate Wooden Flooring (8mm)',
        brand: 'Action TESA',
        category: 'wooden-flooring',
        subcategory: 'laminate-flooring',
        price: 115,
        originalPrice: 150,
        discountLabel: '23% OFF',
        unit: 'sq.ft',
        description: 'High-density fiberboard (HDF) AC4 scratch-resistant German click-interlock wooden flooring planks.',
        rating: 4.8,
        ratingCount: 94,
        specs: { 'Thickness': '8mm', 'Grade': 'AC4 Heavy Domestic', 'Brand': 'Action TESA' },
        imageSrc: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wood_fl2',
        name: 'Pergo Original Natural Oak Moisture-Resistant Wooden Floor Planks',
        brand: 'Pergo',
        category: 'wooden-flooring',
        subcategory: 'engineered-hardwood',
        price: 165,
        originalPrice: 210,
        discountLabel: '21% OFF',
        unit: 'sq.ft',
        description: 'Premium Scandinavian natural golden oak real-feel grain texture with AquaSafe water barrier technology.',
        rating: 4.9,
        ratingCount: 67,
        specs: { 'Thickness': '8.5mm', 'Finish': 'Natural Oak Matte', 'Brand': 'Pergo' },
        imageSrc: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wood_fl3',
        name: 'Armstrong 100% Waterproof SPC Rigid Core Vinyl Wooden Planks',
        brand: 'Armstrong',
        category: 'wooden-flooring',
        subcategory: 'spc-vinyl-flooring',
        price: 135,
        originalPrice: 175,
        discountLabel: '23% OFF',
        unit: 'sq.ft',
        description: 'Stone Polymer Composite (SPC) 100% waterproof flooring with acoustic IXPE underlayment.',
        rating: 4.8,
        ratingCount: 77,
        specs: { 'Thickness': '5.5mm + 1.5mm IXPE', 'Waterproof': '100% Guaranteed', 'Brand': 'Armstrong' },
        imageSrc: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wood_fl4',
        name: 'Quick-Step Classic European Herringbone Parquet Wooden Flooring',
        brand: 'Quick-Step',
        category: 'wooden-flooring',
        subcategory: 'herringbone-parquet',
        price: 240,
        originalPrice: 310,
        discountLabel: '23% OFF',
        unit: 'sq.ft',
        description: 'Royal herringbone chevron pattern real hardwood veneer planks with scratch guard top layer.',
        rating: 4.9,
        ratingCount: 38,
        specs: { 'Pattern': 'Herringbone 90°', 'Grade': 'AC5 Commercial', 'Brand': 'Quick-Step' },
        imageSrc: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wp_1',
        name: 'Asian Paints Nilaya Luxury Geometric Metallic Wallpaper Roll',
        brand: 'Asian Paints Nilaya',
        category: 'designer-wallpapers',
        subcategory: '3d-geometric-wallpapers',
        price: 2850,
        originalPrice: 3800,
        discountLabel: '25% OFF',
        unit: 'Roll',
        description: 'Designer non-woven luxury metallic foil embossed wallpaper roll (57 sq.ft coverage per roll) for accent walls.',
        rating: 4.9,
        ratingCount: 112,
        specs: { 'Coverage': '10m x 0.53m (57 sq.ft)', 'Material': 'Non-Woven Vinyl', 'Brand': 'Asian Paints Nilaya' },
        imageSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wp_2',
        name: 'Excel Modern 3D Botanical Embossed Living Room Wallpaper Roll',
        brand: 'Excel Wallpapers',
        category: 'designer-wallpapers',
        subcategory: 'botanical-nature',
        price: 1950,
        originalPrice: 2600,
        discountLabel: '25% OFF',
        unit: 'Roll',
        description: 'Washable deep embossed textured 3D tropical leaf design wallpaper with seamless pattern alignment.',
        rating: 4.8,
        ratingCount: 88,
        specs: { 'Coverage': '10m x 0.53m (57 sq.ft)', 'Finish': 'Textured Matte', 'Brand': 'Excel Wallpapers' },
        imageSrc: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wp_3',
        name: 'Grand Versailles Royal Gold Textured Damask Wallpaper Roll',
        brand: 'Excel Wallpapers',
        category: 'designer-wallpapers',
        subcategory: 'textured-damask',
        price: 3200,
        originalPrice: 4200,
        discountLabel: '24% OFF',
        unit: 'Roll',
        description: 'Classic Victorian embossed gold velvet texture damask wallpaper for luxury master bedrooms.',
        rating: 4.9,
        ratingCount: 64,
        specs: { 'Coverage': '57 sq.ft', 'Pattern': 'Royal Damask', 'Brand': 'Excel' },
        imageSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wp_4',
        name: 'Raw Slate Stone 3D Textured Embossed Accent Wallpaper Roll',
        brand: 'Asian Paints Nilaya',
        category: 'designer-wallpapers',
        subcategory: 'brick-stone-textures',
        price: 2150,
        originalPrice: 2900,
        discountLabel: '26% OFF',
        unit: 'Roll',
        description: 'Hyper-realistic stacked natural stone brick effect wallpaper with textured relief printing.',
        rating: 4.7,
        ratingCount: 52,
        specs: { 'Coverage': '57 sq.ft', 'Texture': 'Stone Relief', 'Brand': 'Asian Paints Nilaya' },
        imageSrc: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'h5',
        name: 'Godrej Duralock Stainless Steel Heavy Mortise Door Handle Lock Set',
        brand: 'Godrej Hardware',
        category: 'hardware',
        subcategory: 'door-handles-locks',
        price: 1850,
        originalPrice: 2400,
        discountLabel: '23% OFF',
        unit: 'Set',
        description: 'High tensile anti-pick brass cylinder mortise lock with dual aesthetic satin steel lever handles.',
        rating: 4.8,
        ratingCount: 71,
        specs: { 'Finish': 'Satin SS 304', 'Keys': '3 Brass Keys', 'Brand': 'Godrej' },
        imageSrc: 'assets/door_hinge.jpg'
    },
    {
        id: 'rmc_1',
        name: 'UltraTech Ready Mix Concrete (RMC) M25 Grade',
        brand: 'UltraTech RMC',
        category: 'cement',
        subcategory: 'rmc-concrete',
        price: 4200,
        originalPrice: 5100,
        discountLabel: '18% OFF',
        unit: 'Cu.M',
        description: 'Design mixed M25 grade high-performance concrete delivered via transit mixer trucks with slump retention.',
        rating: 4.9,
        ratingCount: 76,
        specs: { 'Grade': 'M25 Mix (1:1:2)', 'Slump': '100-120mm', 'Delivery': 'Direct Transit Mixer' },
        imageSrc: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'wc_1',
        name: 'Birla White WallCare Putty & White Cement (40 Kg)',
        brand: 'Birla White',
        category: 'cement',
        subcategory: 'white-cement',
        price: 980,
        originalPrice: 1200,
        discountLabel: '18% OFF',
        unit: 'Bag',
        description: 'Premium white Portland cement based wall care putty offering maximum whiteness and damp protection.',
        rating: 4.8,
        ratingCount: 110,
        specs: { 'Weight': '40 Kg', 'Whiteness': '90%+ ISO', 'Brand': 'Birla White' },
        imageSrc: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'st_beam1',
        name: 'SAIL ISMB Heavy Duty Structural Steel I-Beam (150x75mm)',
        brand: 'SAIL',
        category: 'steel',
        subcategory: 'structural-steel',
        price: 64500,
        originalPrice: 75000,
        discountLabel: '14% OFF',
        unit: 'Ton',
        description: 'Hot rolled ISMB standard structural I-beams and C-channels for load-bearing framing and industrial sheds.',
        rating: 4.8,
        ratingCount: 48,
        specs: { 'Section': 'ISMB 150x75mm', 'Standard': 'IS 2062 Grade E250', 'Brand': 'Steel Authority of India' },
        imageSrc: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'st_wire1',
        name: 'Tata Wiron GI Galvanized Rebar Binding Wire (18 Gauge, 25 Kg Bundle)',
        brand: 'Tata Wiron',
        category: 'steel',
        subcategory: 'binding-wire',
        price: 2350,
        originalPrice: 2900,
        discountLabel: '19% OFF',
        unit: 'Bundle',
        description: 'Soft annealed flexible GI binding wire for tying TMT rebars, stirrups, and column links securely.',
        rating: 4.9,
        ratingCount: 134,
        specs: { 'Gauge': '18 SWG (1.2mm)', 'Weight': '25 Kg Bundle', 'Brand': 'Tata Wiron' },
        imageSrc: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tile_gran1',
        name: 'Royal Black Galaxy Polished Granite Slab (18mm Thickness)',
        brand: 'Natural Granite Quarries',
        category: 'tiles',
        subcategory: 'granite-marble',
        price: 195,
        originalPrice: 260,
        discountLabel: '25% OFF',
        unit: 'sq.ft',
        description: 'High gloss mirror-finish Black Galaxy granite stone with golden crystalline flecks for kitchen countertops.',
        rating: 4.9,
        ratingCount: 82,
        specs: { 'Thickness': '18mm', 'Finish': 'Mirror Polish', 'Material': 'Natural Granite' },
        imageSrc: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'tile_pvr1',
        name: 'Johnson Endura Heavy Duty Anti-Skid Industrial Parking & Paver Tiles (16mm)',
        brand: 'Johnson Endura',
        category: 'tiles',
        subcategory: 'parking-outdoor-tiles',
        price: 72,
        originalPrice: 95,
        discountLabel: '24% OFF',
        unit: 'sq.ft',
        description: '16mm heavy-duty vitrified anti-skid parking paver tiles designed to withstand heavy vehicular traffic.',
        rating: 4.8,
        ratingCount: 56,
        specs: { 'Thickness': '16mm Extra Thick', 'Size': '300x300mm', 'Anti-Skid': 'R11 Rating' },
        imageSrc: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'plumb_san1',
        name: 'Hindware Italian Collection One-Piece Rimless Floor-Mounted Western Toilet',
        brand: 'Hindware',
        category: 'plumbing',
        subcategory: 'sanitaryware',
        price: 11999,
        originalPrice: 15999,
        discountLabel: '25% OFF',
        unit: 'Piece',
        description: 'Vitreous china ceramic rimless water closet with dual 3/6L tornado flush and soft-close hydraulic seat cover.',
        rating: 4.9,
        ratingCount: 65,
        specs: { 'Trap': 'S-Trap 300mm', 'Flush': 'Dual Tornado 3/6L', 'Brand': 'Hindware' },
        imageSrc: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'plumb_faucet1',
        name: 'Jaquar Queen Series Chrome Solid Brass Single-Lever Basin Mixer Tap',
        brand: 'Jaquar',
        category: 'plumbing',
        subcategory: 'faucets-taps',
        price: 3450,
        originalPrice: 4500,
        discountLabel: '23% OFF',
        unit: 'Piece',
        description: 'Solid forged brass basin mixer tap with 12-micron high sheen chrome plating and ceramic disc cartridge.',
        rating: 4.9,
        ratingCount: 92,
        specs: { 'Material': 'Forged Brass', 'Finish': 'High Sheen Chrome', 'Brand': 'Jaquar' },
        imageSrc: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80'
    }
];

// Helper Functions for LocalStorage Persistence
const DATA_KEYS = {
    PRODUCTS: 'elderobuddy_products',
    ORDERS: 'elderobuddy_orders',
    INQUIRIES: 'elderobuddy_inquiries',
    CATEGORIES: 'elderobuddy_categories',
    UNITS: 'elderobuddy_units',
    BANNERS: 'elderobuddy_banners',
    GUIDES: 'elderobuddy_guides',
    DESIGNERS: 'elderobuddy_designers',
    BUILDERS: 'elderobuddy_builders'
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

const INITIAL_BUILDERS = [
    {
        id: 'rajesh-kumar',
        name: 'Rajesh Kumar',
        avatarText: 'RK',
        avatarBg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        firm: 'Principal Builder, Kumar Construction Corp',
        experience: '15+ Years',
        rating: '4.9',
        reviewsCount: 142,
        completedProjects: 85,
        specialties: ['Residential Apartments', 'Independent Villas', 'Green Buildings'],
        bio: 'Rajesh Kumar is a veteran builder known for constructing high-durability residential complexes and eco-friendly structures.',
        fullBio: 'Rajesh Kumar founded Kumar Construction Corp in 2010. Over the last 15 years, he has successfully delivered over 85 high-end residential and villa projects in Pan India, Noida, and Bangalore. His construction philosophy revolves around earthquake-resistant design, premium quality structural materials, and strict timeline adherence.',
        projects: [
            {
                title: 'Premium 3BHK Apartment Complex',
                location: 'Whitefield, Pan India',
                year: '2025',
                desc: 'A structural masterpiece featuring premium reinforced TMT steel, high-compressive concrete columns, and rainwater harvesting structures.',
                images: ['assets/builder_project1.png']
            },
            {
                title: 'Luxury Eco-Villa Project',
                location: 'Sarjapur, Pan India',
                year: '2024',
                desc: 'A premium green housing project built with AAC blocks, low-VOC thermal insulating paints, and integrated solar roofing systems.',
                images: ['assets/builder_project2.png']
            }
        ]
    },
    {
        id: 'vikram-aditya',
        name: 'Vikram Aditya',
        avatarText: 'VA',
        avatarBg: 'linear-gradient(135deg, #0f766e, #14b8a6)',
        firm: 'Founder, Aditya Infra Projects',
        experience: '12+ Years',
        rating: '4.8',
        reviewsCount: 96,
        completedProjects: 40,
        specialties: ['Commercial Hubs', 'Structural Renovations', 'High-Rise Towers'],
        bio: 'Vikram Aditya specializes in steel-reinforced high-rise buildings, contemporary commercial plazas, and complex structural expansions.',
        fullBio: 'Vikram Aditya is an infrastructure pioneer. Over the past 12 years, he has specialized in heavy-duty commercial plazas and high-rise structural designs. His projects stand out for their modern glass facade integrations, spacious column-free office designs, and premium durability standards.',
        projects: [
            {
                title: 'Aditya Business Plaza',
                location: 'Gachibowli, Pan India',
                year: '2025',
                desc: 'An iconic commercial hub constructed with high-grade self-healing concrete and modular columns, spanning over 200,000 sq ft.',
                images: ['assets/builder_project3.png']
            },
            {
                title: 'Corporate Office Headquarters',
                location: 'Hitec City, Pan India',
                year: '2024',
                desc: 'A sleek, multi-story corporate building featuring noise-reduction glass paneling, smart HVAC integrations, and customized steel structural frames.',
                images: ['assets/builder_project4.png']
            }
        ]
    },
    {
        id: 'sanjay-mehta',
        name: 'Sanjay Mehta',
        avatarText: 'SM',
        avatarBg: 'linear-gradient(135deg, #7c2d12, #ea580c)',
        firm: 'Managing Director, Mehta & Sons Builders',
        experience: '18+ Years',
        rating: '5.0',
        reviewsCount: 110,
        completedProjects: 150,
        specialties: ['Industrial Sheds', 'Affordable Housing', 'Concrete Frameworks'],
        bio: 'Sanjay Mehta is a structural engineer and builder specializing in high-load industrial warehouses and large-scale affordable housing.',
        fullBio: 'Sanjay Mehta has over 18 years of experience in structural engineering and mass construction. His firm, Mehta & Sons Builders, has delivered over 150 projects across Pan India, including heavy-load industrial sheds, logistic warehouses, and affordable mass housing townships.',
        projects: [
            {
                title: 'Mehta Enclave Housing Scheme',
                location: 'Noida Sector 62, Pan India',
                year: '2025',
                desc: 'A massive residential township built using precast concrete technology, saving 40% construction time while maximizing load bearing strength.',
                images: ['assets/builder_project5.png']
            },
            {
                title: 'Heavy Industrial Logistics Warehouse',
                location: 'Manesar, Pan India',
                year: '2024',
                desc: 'A heavy-duty logistics facility built with industrial-grade steel trusses, high-performance vacuum-dewatered flooring, and modular loading bays.',
                images: ['assets/builder_project6.png']
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
    if (!localStorage.getItem(DATA_KEYS.BUILDERS)) {
        localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(INITIAL_BUILDERS));
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
        imageSrc: 'assets/guide_quality.png',
        content: `# Ensuring Quality In Building Materials

Quality assurance is paramount in construction projects. This guide covers how to inspect and ensure you are buying high-grade materials.

## 1. Concrete Quality Testing
Make sure to check the grade and certification of the cement. High strength concrete starts with grade 43 or 53 OPC cement.

## 2. Steel Reinforcement Inspection
TMT Bars should have clear certification marks, rust-free surfaces, and excellent bendability.

## 3. Bricks and Blocks
A high-quality brick should have uniform dimensions, sharp edges, and a metallic ringing sound when struck against another brick.

Buying from verified suppliers ensures that materials meet standard ISI specifications.`
    },
    {
        id: 'g2',
        title: 'The Future of Building Materials and Eco-Friendly Progress',
        date: '2023-08-05 11:33:21',
        imageSrc: 'assets/guide_future.png',
        content: `# The Future of Building Materials and Eco-Friendly Progress

Exploring advancements in green technology and how eco-friendly products are shaping the construction landscape.

## Modern Green Building Technologies
With carbon neutral targets, the construction sector is adopting self-healing concrete, solar panel glass roofs, and smart insulation.

## Eco-Friendly Progress
Using smart glass reduces heat gain, saving HVAC energy costs. Sustainable paint options release low VOCs, improving indoor air quality.`
    },
    {
        id: 'g3',
        title: 'Building Materials at a Cost Effective Price for Small-Scale Projects',
        date: '2023-07-17 06:45:52',
        imageSrc: 'assets/guide_cost.png',
        content: `# Building Materials at a Cost Effective Price for Small-Scale Projects

Tips and tricks to budget your material procurement without compromising on safety and longevity.

## 1. Plan in Bulk Sourcing
Even for small projects, grouping material requirements together can help you secure wholesale rates.

## 2. Local Alternatives
Sourcing clay bricks or aggregates locally reduces transportation overheads drastically.

## 3. Compare Brands
Opt for secondary tier certified brands that offer similar grades at competitive pricing compared to premium heavily-advertised brands.`
    },
    {
        id: 'g4',
        title: 'The Latest Trends in Sustainable Building Materials',
        date: '2023-04-20 09:12:19',
        imageSrc: 'assets/guide_trends.png',
        content: `# The Latest Trends in Sustainable Building Materials (2025–2026)

As the construction industry works to reduce carbon emissions and improve resource efficiency, sustainable building materials are moving from niche applications to mainstream adoption. The biggest trend is the shift toward **low-carbon, renewable, recycled, and carbon-storing materials** that reduce a building's environmental impact throughout its lifecycle.

## 1. Mass Timber and Cross-Laminated Timber (CLT)

Mass timber products such as Cross-Laminated Timber (CLT) are becoming a preferred alternative to steel and concrete in many mid-rise and commercial projects.

**Why it's trending:**
* Stores carbon instead of emitting it.
* Faster construction through prefabrication.
* Reduced construction waste.
* Strong structural performance with growing code acceptance.

Many jurisdictions now permit taller timber structures, accelerating adoption worldwide.

---

## 2. Low-Carbon and Carbon-Capturing Concrete

Concrete remains essential, but manufacturers are developing greener alternatives.

**Innovations include:**
* Cement replacement using fly ash, slag, and calcined clay.
* Carbon-capture technologies during production.
* Bio-cement produced using bacteria.
* Carbon-mineralized concrete that stores CO₂.

These technologies can significantly reduce the embodied carbon of construction projects.

---

## 3. Hempcrete and Bio-Based Materials

Hempcrete is gaining popularity for residential and sustainable building projects.

**Benefits:**
* Carbon-negative potential.
* Excellent thermal insulation.
* Moisture regulation.
* Improved indoor air quality.
* Renewable agricultural source.

Although not typically load-bearing, it is increasingly used as wall infill and insulation material.

---

## 4. Recycled Construction Materials

The circular economy is becoming a major driver in construction.

**Popular recycled materials include:**
* Recycled steel
* Recycled concrete aggregates
* Reclaimed wood
* Recycled bricks and masonry

These materials reduce landfill waste while lowering demand for virgin resources. Major building-material companies are investing heavily in recycling infrastructure.

---

## 5. Bamboo-Based Construction

Bamboo is emerging as a viable low-carbon alternative for many structural and finishing applications.

**Advantages:**
* Extremely fast-growing renewable resource.
* High strength-to-weight ratio.
* Earthquake resilience.
* Carbon sequestration during growth.

Engineered bamboo products are increasingly being used in modern architecture and infrastructure projects.

---

## 6. Mycelium-Based Materials

Mycelium (the root structure of mushrooms) is one of the most innovative sustainable materials entering the market.

**Applications:**
* Insulation panels
* Interior partitions
* Acoustic products
* Packaging and temporary structures

Benefits include biodegradability, fire resistance, and very low embodied energy.

---

## 7. Natural and Regenerative Materials

Growing interest in regenerative construction has increased the use of:
* Straw bale systems
* Rammed earth
* Clay plasters
* Cork insulation
* Natural fiber insulation
* Lime-based finishes

These materials are valued for low embodied carbon, healthy indoor environments, and local sourcing opportunities.

---

## 8. Prefabricated and Modular Building Systems

Sustainability is no longer only about materials; it's also about how buildings are assembled.

**Benefits of prefabrication:**
* Less waste.
* Faster construction.
* Improved quality control.
* Reduced transportation and labor impacts.

Mass timber and other sustainable materials pair particularly well with modular construction methods.

---

## Key Takeaway

The most influential sustainable building material trends today are:
1. **Mass Timber (CLT)**
2. **Low-Carbon Concrete**
3. **Hempcrete**
4. **Recycled Steel and Aggregates**
5. **Engineered Bamboo**
6. **Mycelium-Based Products**
7. **Natural Insulation and Earth-Based Materials**
8. **Modular and Prefabricated Construction**

For builders, developers, and homeowners, the future is increasingly focused on materials that not only reduce emissions but actively **store carbon, support circular economies, and improve building performance over the long term**.`
    },
    {
        id: 'g5',
        title: 'Renovation vs. Remodeling: Which One is Better?',
        date: '2021-08-13 12:18:00',
        imageSrc: 'assets/guide_renovation.png',
        content: `# Renovation vs. Remodeling: Which One is Better?

Understanding the core differences between structural remodeling and cosmetic renovation.

## Renovation (Restoring & Repairing)
Renovation refers to "restoring" something to a good state of repair. It includes painting, replacing flooring, and updating cabinets.

## Remodeling (Changing Structure)
Remodeling involves altering the structure or layout of a space. Examples include removing walls to create an open-floor kitchen, expanding rooms, or changing plumbing lines.

## Which is better?
If your budget is tight and you want a fresh aesthetic look, renovation is best. If you need functionality changes, go for remodeling.`
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
        </svg>`,
        content: `# Foundation Cracks - When to Hire an Expert?

Learn to distinguish minor cosmetic settling cracks from major structural hazards.

## Cosmetic Cracks
Hairline cracks (less than 1/16 inch) are common in newly constructed concrete as it cures and settles. These are usually non-structural.

## Structural Cracks
- **Horizontal Cracks:** Severe pressure from soil outside. Requires immediate engineering consult.
- **Wide Cracks:** Cracks wider than 1/4 inch need sealing and structural inspection.
- **Stair-step Cracks:** Common in brick foundation, indicates uneven settling of foundation footings.

## Summary
Always inspect cracks periodically. If they grow, seep water, or prevent doors from closing, call a structural engineer immediately.`
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

// Builders CRUD operations
function getBuilders() {
    if (window.SERVER_BUILDERS) {
        return window.SERVER_BUILDERS;
    }
    initializeData();
    return JSON.parse(localStorage.getItem(DATA_KEYS.BUILDERS)) || [];
}

function saveBuilders(builders) {
    localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(builders));
}

async function addBuilder(builder) {
    try {
        const res = await axios.post('/api/builders', builder);
        const localBuilders = JSON.parse(localStorage.getItem(DATA_KEYS.BUILDERS)) || [];
        localBuilders.push(res.data);
        localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(localBuilders));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to add builder, updating localStorage fallback.', e);
        const builders = getBuilders();
        const newBuilder = {
            ...builder,
            id: builder.name ? builder.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : 'builder-' + Date.now()
        };
        builders.push(newBuilder);
        localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(builders));
        return newBuilder;
    }
}

async function updateBuilder(id, updatedBuilder) {
    try {
        const res = await axios.put(`/api/builders/${id}`, updatedBuilder);
        const localBuilders = JSON.parse(localStorage.getItem(DATA_KEYS.BUILDERS)) || [];
        const idx = localBuilders.findIndex(b => b.id === id);
        if (idx !== -1) {
            localBuilders[idx] = { ...localBuilders[idx], ...res.data };
            localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(localBuilders));
        }
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to update builder, updating localStorage fallback.', e);
        const builders = getBuilders();
        const index = builders.findIndex(b => b.id === id);
        if (index !== -1) {
            builders[index] = {
                ...builders[index],
                ...updatedBuilder
            };
            localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(builders));
            return builders[index];
        }
        return null;
    }
}

async function deleteBuilder(id) {
    try {
        const res = await axios.delete(`/api/builders/${id}`);
        let localBuilders = JSON.parse(localStorage.getItem(DATA_KEYS.BUILDERS)) || [];
        localBuilders = localBuilders.filter(b => b.id !== id);
        localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(localBuilders));
        return res.data;
    } catch (e) {
        console.warn('[Backend] Failed to delete builder, updating localStorage fallback.', e);
        let builders = getBuilders();
        builders = builders.filter(b => b.id !== id);
        localStorage.setItem(DATA_KEYS.BUILDERS, JSON.stringify(builders));
    }
}

export {
    INITIAL_CATEGORIES,
    INITIAL_BANNERS,
    INITIAL_PRODUCTS,
    INITIAL_UNITS,
    INITIAL_DESIGNERS,
    INITIAL_BUILDERS,
    INITIAL_GUIDE_POSTS
};

