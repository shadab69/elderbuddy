const Order = require('../models/orderModel');
const emailService = require('../services/emailService');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving orders', error: e.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        if (!req.body.id) {
            req.body.id = 'ORD_' + Math.floor(100000 + Math.random() * 900000);
        }
        const order = await Order.create(req.body);

        // Await email dispatch so Vercel serverless function doesn't terminate before sending
        try {
            await emailService.sendOrderEmailNotification(order);
        } catch (err) {
            console.error('[orderController] Email notification error:', err.message);
        }

        res.status(201).json(order);
    } catch (e) {
        console.error('[orderController] Error logging order:', e.message);
        res.status(201).json({ success: true, message: 'Order recorded', data: req.body });
    }
};

