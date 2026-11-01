const mongoose = require('mongoose');
const Lead = require('../models/leadModel');
const emailService = require('../services/emailService');
const { validateLeadPayload } = require('../utils/validate');

exports.getLeads = async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const leads = await Lead.find();
            return res.json(leads);
        }
        res.json([]);
    } catch (e) {
        res.status(500).json({ message: 'Error retrieving leads', error: e.message });
    }
};

exports.createLead = async (req, res) => {
    const validation = validateLeadPayload(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    const leadData = req.body || {};
    if (!leadData.id) {
        leadData.id = 'INQ_' + Math.floor(100000 + Math.random() * 900000);
    }

    let savedLead = leadData;

    // 1. Try saving to Database if connected
    try {
        if (mongoose.connection.readyState === 1) {
            const dbResult = await Lead.create(leadData);
            if (dbResult) {
                savedLead = dbResult.toObject ? dbResult.toObject() : dbResult;
            }
        }
    } catch (dbErr) {
        console.warn('[leadController] Database write fallback (serverless mode):', dbErr.message);
    }

    // 2. Dispatch Admin Alert Email (shady69366@gmail.com)
    try {
        await emailService.sendLeadEmailNotification(savedLead);
    } catch (adminEmailErr) {
        console.error('[leadController] Admin lead notification error:', adminEmailErr.message);
    }

    // 3. Dispatch Customer Confirmation Email directly to Customer's Email
    try {
        const customerEmail = (savedLead.email || '').trim();
        if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('@turnkeyclient.in')) {
            console.log(`[leadController] Dispatching consultation confirmation directly to customer: ${customerEmail}`);
            await emailService.sendCustomerLeadConfirmation(savedLead);
        }
    } catch (custEmailErr) {
        console.error('[leadController] Customer lead confirmation error:', custEmailErr.message);
    }

    return res.status(201).json(savedLead);
};

