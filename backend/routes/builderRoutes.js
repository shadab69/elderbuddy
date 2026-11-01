const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const builderController = require('../controllers/builderController');

router.route('/')
    .get(builderController.getBuilders)
    .post(adminAuth, builderController.createBuilder);

router.route('/:id')
    .get(builderController.getBuilderById)
    .put(adminAuth, builderController.updateBuilder)
    .delete(adminAuth, builderController.deleteBuilder);

module.exports = router;
