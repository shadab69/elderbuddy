const express = require('express');
const router = express.Router();

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const unitRoutes = require('./unitRoutes');
const bannerRoutes = require('./bannerRoutes');
const orderRoutes = require('./orderRoutes');
const leadRoutes = require('./leadRoutes');
const uploadRoutes = require('./uploadRoutes');
const guideRoutes = require('./guideRoutes');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/units', unitRoutes);
router.use('/banners', bannerRoutes);
router.use('/orders', orderRoutes);
router.use('/leads', leadRoutes);
router.use('/upload', uploadRoutes);
router.use('/guides', guideRoutes);

module.exports = router;
