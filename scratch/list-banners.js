require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Banner = require('../backend/models/bannerModel');

async function list() {
    await connectDB();
    const banners = await Banner.find();
    console.log('MongoDB Banners:', banners);
    mongoose.connection.close();
}

list();
