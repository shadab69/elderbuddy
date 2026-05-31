const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.route('/')
    .get(leadController.getLeads)
    .post(leadController.createLead);

module.exports = router;
