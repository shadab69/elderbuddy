const Lead = require('../models/leadModel');

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving leads', error: e.message });
    }
};

exports.createLead = async (req, res) => {
    try {
        if (!req.body.id) {
            req.body.id = 'INQ_' + Math.floor(100000 + Math.random() * 900000);
        }
        const lead = await Lead.create(req.body);
        res.status(201).json(lead);
    } catch (e) {
        res.status(400).json({ message: 'Error logging inquiry lead', error: e.message });
    }
};
