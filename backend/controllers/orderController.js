const Order = require('../models/orderModel');

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
        res.status(201).json(order);
    } catch (e) {
        res.status(400).json({ message: 'Error logging order', error: e.message });
    }
};
