const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const bannerController = require('../controllers/bannerController');

router.route('/')
    .get(bannerController.getBanners)
    .post(adminAuth, bannerController.createBanner);

router.route('/:id')
    .get(bannerController.getBannerById)
    .put(adminAuth, bannerController.updateBanner)
    .delete(adminAuth, bannerController.deleteBanner);

module.exports = router;
