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
    // Only non-secret preferences (admin email, notify flags) can be updated
    // at runtime. SMTP credentials are environment-managed (SMTP_USER /
    // SMTP_PASS) and are deliberately ignored here even if sent.
    const updated = emailService.saveEmailConfig(req.body || {});
    res.json({
      message: 'Email preferences saved. SMTP credentials are managed via environment variables and cannot be changed through the API.',
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
