const emailService = require('../services/emailService');

exports.getConfig = async (req, res) => {
  try {
    const config = emailService.getEmailConfig();
    // Mask sensitive password for client response
    const safeConfig = {
      ...config,
      smtpPass: config.smtpPass ? '********' : '',
      isConfigured: !!(config.smtpUser && config.smtpPass)
    };
    res.json(safeConfig);
  } catch (e) {
    res.status(500).json({ message: 'Error retrieving email config', error: e.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const updateData = { ...req.body };
    // If password is still masked, keep the existing one
    if (updateData.smtpPass === '********') {
      const current = emailService.getEmailConfig();
      updateData.smtpPass = current.smtpPass;
    }
    const updated = emailService.saveEmailConfig(updateData);
    res.json({
      message: 'Email configuration saved successfully',
      config: {
        ...updated,
        smtpPass: updated.smtpPass ? '********' : '',
        isConfigured: !!(updated.smtpUser && updated.smtpPass)
      }
    });
  } catch (e) {
    res.status(400).json({ message: 'Error updating email config', error: e.message });
  }
};

exports.sendTest = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const result = await emailService.sendTestEmail(targetEmail);
    res.json({ message: 'Test email sent successfully!', result });
  } catch (e) {
    res.status(400).json({ message: 'Failed to send test email', error: e.message });
  }
};
