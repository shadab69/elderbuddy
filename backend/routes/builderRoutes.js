const express = require('express');
const router = express.Router();
const builderController = require('../controllers/builderController');

router.route('/')
    .get(builderController.getBuilders)
    .post(builderController.createBuilder);

router.route('/:id')
    .get(builderController.getBuilderById)
    .put(builderController.updateBuilder)
    .delete(builderController.deleteBuilder);

module.exports = router;
