const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check: reports whether the API is backed by MongoDB right now or
// serving the JSON seed fallback (see backend/utils/jsonFallback.js).
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'fallback',
        timestamp: new Date().toISOString()
    });
});

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const unitRoutes = require('./unitRoutes');
const bannerRoutes = require('./bannerRoutes');
const orderRoutes = require('./orderRoutes');
const leadRoutes = require('./leadRoutes');
const uploadRoutes = require('./uploadRoutes');
const guideRoutes = require('./guideRoutes');
const designerRoutes = require('./designerRoutes');
const builderRoutes = require('./builderRoutes');
const emailRoutes = require('./emailRoutes');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/units', unitRoutes);
router.use('/banners', bannerRoutes);
router.use('/orders', orderRoutes);
router.use('/leads', leadRoutes);
router.use('/upload', uploadRoutes);
router.use('/guides', guideRoutes);
router.use('/designers', designerRoutes);
router.use('/builders', builderRoutes);
router.use('/email', emailRoutes);

module.exports = router;
