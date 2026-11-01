const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const orderController = require('../controllers/orderController');

// Placing an order is a public customer action; READING orders exposes
// customer PII, so the list endpoint requires the admin token.
router.route('/')
    .get(adminAuth, orderController.getOrders)
    .post(orderController.createOrder);

module.exports = router;
