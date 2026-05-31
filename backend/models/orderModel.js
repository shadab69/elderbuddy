const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.Mixed, required: true },
    items: { type: Array, required: true },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Site Delivery' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
