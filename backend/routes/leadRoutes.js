const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const leadController = require('../controllers/leadController');

// Creating a lead is a public customer action; READING leads exposes
// customer PII, so the list endpoint requires the admin token.
router.route('/')
    .get(adminAuth, leadController.getLeads)
    .post(leadController.createLead);

module.exports = router;
