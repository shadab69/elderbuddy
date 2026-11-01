const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const guideController = require('../controllers/guideController');

router.route('/')
    .get(guideController.getGuides)
    .post(adminAuth, guideController.createGuide);

router.route('/:id')
    .get(guideController.getGuideById)
    .put(adminAuth, guideController.updateGuide)
    .delete(adminAuth, guideController.deleteGuide);

module.exports = router;
