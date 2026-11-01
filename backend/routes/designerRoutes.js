const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const designerController = require('../controllers/designerController');

router.route('/')
    .get(designerController.getDesigners)
    .post(adminAuth, designerController.createDesigner);

router.route('/:id')
    .get(designerController.getDesignerById)
    .put(adminAuth, designerController.updateDesigner)
    .delete(adminAuth, designerController.deleteDesigner);

module.exports = router;
