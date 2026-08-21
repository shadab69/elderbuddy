const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.get('/config', emailController.getConfig);
router.post('/config', emailController.updateConfig);
router.post('/test', emailController.sendTest);

module.exports = router;
