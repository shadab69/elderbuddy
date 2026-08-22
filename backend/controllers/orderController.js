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
    const orderData = req.body || {};
    if (!orderData.id) {
        orderData.id = 'ORD_' + Math.floor(100000 + Math.random() * 900000);
    }

    let savedOrder = orderData;

    // 1. Try saving to Database if connected
    try {
        const dbResult = await Order.create(orderData);
        if (dbResult) {
            savedOrder = dbResult.toObject ? dbResult.toObject() : dbResult;
        }
    } catch (dbErr) {
        console.warn('[orderController] Database write fallback (serverless mode):', dbErr.message);
    }

    // 2. ALWAYS dispatch Admin Alert Email AND Customer Receipt Confirmation Email
    try {
        await emailService.sendOrderEmailNotification(savedOrder);
    } catch (adminEmailErr) {
        console.error('[orderController] Admin email notification error:', adminEmailErr.message);
    }

    try {
        const customerEmail = savedOrder.customer?.email || savedOrder.email;
        if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('@turnkeyclient.in')) {
            await emailService.sendCustomerOrderConfirmation(savedOrder);
        }
    } catch (custEmailErr) {
        console.error('[orderController] Customer order confirmation email error:', custEmailErr.message);
    }

    return res.status(201).json(savedOrder);
};

