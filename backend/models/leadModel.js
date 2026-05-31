const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    id: { type: String, required: true },
    service: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    location: { type: String, required: true },
    details: { type: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
