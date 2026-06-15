const express = require('express');
const router = express.Router();
const designerController = require('../controllers/designerController');

router.route('/')
    .get(designerController.getDesigners)
    .post(designerController.createDesigner);

router.route('/:id')
    .get(designerController.getDesignerById)
    .put(designerController.updateDesigner)
    .delete(designerController.deleteDesigner);

module.exports = router;
