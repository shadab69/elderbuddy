const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { publicPostRateLimiter } = require('../middleware/rateLimit');
const leadController = require('../controllers/leadController');

// Creating a lead is a public customer action (rate-limited against form
// spam); READING leads exposes customer PII, so the list endpoint requires
// the admin token.
router.route('/')
    .get(adminAuth, leadController.getLeads)
    .post(publicPostRateLimiter, leadController.createLead);

module.exports = router;
