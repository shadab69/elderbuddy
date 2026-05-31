require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Product = require('../backend/models/productModel');

async function test() {
    await connectDB();
    const product = await Product.findOne({ id: 'hd7' });
    console.log('Original Product:', product);

    const updatePayload = {
        name: "Greenstone's AAC Brick - Updated Name",
        brand: 'Greenstone',
        category: 'bricks',
        price: 99,
        unit: 'Nos',
        description: 'Autoclaved Aerated Concrete bricks by Greenstone (6 Inch thickness) for robust masonry.',
        specs: { 'Size': '600x200x150mm' }
    };

    try {
        const updated = await Product.findByIdAndUpdate('hd7', updatePayload);
        console.log('Updated Result:', updated);
    } catch (err) {
        console.error('Update Error:', err);
    }

    const after = await Product.findOne({ id: 'hd7' });
    console.log('Product After Update:', after);
    mongoose.connection.close();
}

test();
