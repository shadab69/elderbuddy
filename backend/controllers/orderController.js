const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const emailService = require('../services/emailService');

exports.getOrders = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const orders = await Order.find();
            return res.json(orders);
        }
        res.json([]);
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
        if (mongoose.connection.readyState === 1) {
            const dbResult = await Order.create(orderData);
            if (dbResult) {
                savedOrder = dbResult.toObject ? dbResult.toObject() : dbResult;
            }
        }
    } catch (dbErr) {
        console.warn('[orderController] Database write fallback (serverless mode):', dbErr.message);
    }

    // 2. Dispatch Admin Alert Email (shady69366@gmail.com)
    try {
        await emailService.sendOrderEmailNotification(savedOrder);
    } catch (adminEmailErr) {
        console.error('[orderController] Admin email notification error:', adminEmailErr.message);
    }

    // 3. Dispatch Customer Confirmation & Itemized Invoice directly to Customer's Email
    try {
        const customerEmail = (savedOrder.customer?.email || savedOrder.email || '').trim();
        if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('@turnkeyclient.in')) {
            console.log(`[orderController] Dispatching order invoice directly to customer: ${customerEmail}`);
            await emailService.sendCustomerOrderConfirmation(savedOrder);
        }
    } catch (custEmailErr) {
        console.error('[orderController] Customer order confirmation error:', custEmailErr.message);
    }

    return res.status(201).json(savedOrder);
};

