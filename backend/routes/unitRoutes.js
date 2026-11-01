const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const unitController = require('../controllers/unitController');

router.route('/')
    .get(unitController.getUnits)
    .post(adminAuth, unitController.createUnit);

router.route('/:id')
    .delete(adminAuth, unitController.deleteUnit);

module.exports = router;
