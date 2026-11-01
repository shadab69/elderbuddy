const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const emailController = require('../controllers/emailController');

// Reading the (password-masked) config is public; changing config or
// sending a test email are admin actions and require the admin token.
router.get('/config', emailController.getConfig);
router.post('/config', adminAuth, emailController.updateConfig);
router.post('/test', adminAuth, emailController.sendTest);

module.exports = router;
