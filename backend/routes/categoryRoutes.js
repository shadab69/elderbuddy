const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const categoryController = require('../controllers/categoryController');

router.route('/')
    .get(categoryController.getCategories)
    .post(adminAuth, categoryController.createCategory);

router.route('/:id')
    .put(adminAuth, categoryController.updateCategory)
    .delete(adminAuth, categoryController.deleteCategory);

module.exports = router;
