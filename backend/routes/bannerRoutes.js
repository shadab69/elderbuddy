const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.route('/')
    .get(bannerController.getBanners)
    .post(bannerController.createBanner);

router.route('/:id')
    .get(bannerController.getBannerById)
    .put(bannerController.updateBanner)
    .delete(bannerController.deleteBanner);

module.exports = router;
