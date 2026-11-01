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
require('./models/builderModel');

const connectDB = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');
const { apiNotFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS — restricted to the origins listed in ALLOWED_ORIGINS
// (comma-separated). Defaults to the local dev origins. Requests without
// an Origin header (curl, server-to-server, same-origin) are unaffected.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
}));

// Body Parsers
app.use(express.json({ limit: '50mb' })); // Support Base64 payloads too
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve API routes
app.use('/api', apiRoutes);

// Any /api/* request still unmatched gets a JSON 404 (not the SPA fallback)
app.use('/api', apiNotFound);

// Serve static frontend files (SPA)
app.use(express.static(path.join(__dirname, '../dist')));

// Direct any unmatched routes to index.html for SPA hash routing fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Central JSON error handler (must stay last)
app.use(errorHandler);

// Start the server if executed directly
if (process.env.NODE_ENV !== 'production' || require.main === module) {
    app.listen(PORT, () => {
        console.log(` Active Port: ${PORT}`);
        console.log(` Web App URL: http://localhost:${PORT}`);
    });
}

module.exports = app;
