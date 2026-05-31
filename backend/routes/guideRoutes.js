const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.route('/')
    .get(guideController.getGuides)
    .post(guideController.createGuide);

router.route('/:id')
    .get(guideController.getGuideById)
    .put(guideController.updateGuide)
    .delete(guideController.deleteGuide);

module.exports = router;
