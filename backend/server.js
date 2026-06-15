require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Compile Mongoose Models
require('./models/productModel');
require('./models/categoryModel');
require('./models/unitModel');
require('./models/bannerModel');
require('./models/orderModel');
require('./models/leadModel');
require('./models/guideModel');
require('./models/designerModel');

const connectDB = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Body Parsers
app.use(express.json({ limit: '50mb' })); // Support Base64 payloads too
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve API routes
app.use('/api', apiRoutes);

// Serve static frontend files (SPA)
app.use(express.static(path.join(__dirname, '..')));

// Direct any unmatched routes to index.html for SPA hash routing fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` BuilderPro Backend Server Running!`);
    console.log(` Active Port: ${PORT}`);
    console.log(` Web App URL: http://localhost:${PORT}`);
    console.log(`====================================================`);
});
