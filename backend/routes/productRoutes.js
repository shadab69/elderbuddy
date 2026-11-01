const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const productController = require('../controllers/productController');

router.route('/')
    .get(productController.getProducts)
    .post(adminAuth, productController.createProduct);

router.route('/:id')
    .get(productController.getProductById)
    .put(adminAuth, productController.updateProduct)
    .delete(adminAuth, productController.deleteProduct);

module.exports = router;
