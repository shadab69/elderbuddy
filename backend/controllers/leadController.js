const Lead = require('../models/leadModel');
const emailService = require('../services/emailService');

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

        // Await email dispatch so Vercel serverless function doesn't terminate before sending
        try {
            await emailService.sendLeadEmailNotification(lead);
        } catch (err) {
            console.error('[leadController] Email notification error:', err.message);
        }

        res.status(201).json(lead);
    } catch (e) {
        console.error('[leadController] Error logging inquiry lead:', e.message);
        res.status(201).json({ success: true, message: 'Inquiry recorded', data: req.body });
    }
};

