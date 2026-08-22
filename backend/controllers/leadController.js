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
    const leadData = req.body || {};
    if (!leadData.id) {
        leadData.id = 'INQ_' + Math.floor(100000 + Math.random() * 900000);
    }

    let savedLead = leadData;

    // 1. Try saving to Database if connected
    try {
        const dbResult = await Lead.create(leadData);
        if (dbResult) {
            savedLead = dbResult.toObject ? dbResult.toObject() : dbResult;
        }
    } catch (dbErr) {
        console.warn('[leadController] Database write fallback (serverless mode):', dbErr.message);
    }

    // 2. ALWAYS dispatch Admin Alert Email AND Customer Receipt Confirmation Email
    try {
        await emailService.sendLeadEmailNotification(savedLead);
    } catch (adminEmailErr) {
        console.error('[leadController] Admin lead notification error:', adminEmailErr.message);
        // Fallback: Try customer confirmation directly if admin email failed
        try {
            const customerEmail = savedLead.email;
            if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('@turnkeyclient.in')) {
                await emailService.sendCustomerLeadConfirmation(savedLead);
            }
        } catch (custErr) {}
    }

    return res.status(201).json(savedLead);
};

