const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const CONFIG_FILE = path.join(__dirname, '../config/emailConfig.json');

// Read Email Config
function getEmailConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[EmailService] Failed to read emailConfig.json', err.message);
  }

  // Fallback defaults / environment variables
  return {
    adminEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '',
    service: process.env.EMAIL_SERVICE || 'gmail',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 465,
    smtpSecure: process.env.SMTP_SECURE !== 'false',
    smtpUser: process.env.EMAIL_USER || process.env.SMTP_USER || '',
    smtpPass: process.env.EMAIL_PASS || process.env.SMTP_PASS || '',
    notifyOnInquiry: true,
    notifyOnOrder: true
  };
}

// Save Email Config
function saveEmailConfig(newConfig) {
  try {
    const current = getEmailConfig();
    const updated = { ...current, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  } catch (err) {
    console.error('[EmailService] Failed to write emailConfig.json', err.message);
    throw err;
  }
}

// Create Nodemailer Transporter
function createTransporter() {
  const config = getEmailConfig();
  const user = config.smtpUser || process.env.EMAIL_USER;
  const pass = config.smtpPass || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  if (config.service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });
  }

  return nodemailer.createTransport({
    host: config.smtpHost || 'smtp.gmail.com',
    port: config.smtpPort || 465,
    secure: config.smtpSecure !== false,
    auth: {
      user: user,
      pass: pass
    }
  });
}

/**
 * Send Customer Lead / Quote Request Notification to Admin Email
 */
async function sendLeadEmailNotification(lead) {
  const config = getEmailConfig();
  const recipient = config.adminEmail || process.env.ADMIN_EMAIL || config.smtpUser;

  const subject = `🚨 New Customer Quote Request: ${lead.service || 'Construction Service'} (${lead.name})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #ea580c, #c2410c); padding: 25px 20px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-top: 8px; }
        .content { padding: 25px 20px; }
        .section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 10px 8px; font-size: 14px; border-bottom: 1px solid #f8fafc; }
        .info-table td.label { width: 35%; color: #64748b; font-weight: 600; }
        .info-table td.val { font-weight: 600; color: #0f172a; }
        .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 25px; font-size: 14px; line-height: 1.5; color: #334155; }
        .actions { text-align: center; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 0 6px; }
        .btn-call { background: #ea580c; color: #ffffff !important; }
        .btn-email { background: #0f172a; color: #ffffff !important; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🏗️ BuilderPro Marketplace</h1>
          <p>New Customer Inquiry & Quote Request</p>
          <div class="badge">Inquiry ID: ${lead.id || 'INQ_AUTO'}</div>
        </div>
        <div class="content">
          <div class="section-title">Customer Contact Details</div>
          <table class="info-table">
            <tr>
              <td class="label">👤 Customer Name:</td>
              <td class="val">${lead.name || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">📞 Phone Number:</td>
              <td class="val"><a href="tel:${lead.phone}" style="color: #ea580c; text-decoration: none;">${lead.phone || 'N/A'}</a></td>
            </tr>
            <tr>
              <td class="label">✉️ Email Address:</td>
              <td class="val"><a href="mailto:${lead.email}" style="color: #ea580c; text-decoration: none;">${lead.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td class="label">📍 Project Location:</td>
              <td class="val">${lead.location || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">🛠️ Service Required:</td>
              <td class="val" style="color: #ea580c;">${lead.service || 'General Inquiry'}</td>
            </tr>
          </table>

          <div class="section-title">Project Requirements / Message</div>
          <div class="details-box">
            ${(lead.details || 'No additional message provided.').replace(/\n/g, '<br>')}
          </div>

          <div class="actions">
            ${lead.phone ? `<a href="tel:${lead.phone}" class="btn btn-call">📞 Call Customer Now</a>` : ''}
            ${lead.email ? `<a href="mailto:${lead.email}?subject=BuilderPro Quote for ${encodeURIComponent(lead.service || 'Your Project')}" class="btn btn-email">✉️ Reply via Email</a>` : ''}
          </div>
        </div>
        <div class="footer">
          Received via BuilderPro Marketplace Online Form • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`📧 [NEW INQUIRY RECEIVED FOR ADMIN EMAIL]`);
  console.log(`➡️ Recipient: ${recipient || '(Admin email not configured yet)'}`);
  console.log(`➡️ Customer: ${lead.name} (${lead.phone} / ${lead.email})`);
  console.log(`➡️ Service: ${lead.service} - ${lead.location}`);
  console.log(`➡️ Details: ${lead.details}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('[EmailService] SMTP credentials not configured. Please configure SMTP in Admin Console or .env to send live emails.');
    return {
      success: true,
      logged: true,
      message: 'Inquiry logged successfully (SMTP credentials pending configuration in Admin Console)'
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"BuilderPro Alerts" <${config.smtpUser}>`,
      to: recipient,
      replyTo: lead.email || config.smtpUser,
      subject: subject,
      html: html
    });
    console.log('[EmailService] Email sent successfully to', recipient, 'MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Error sending email via SMTP:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Order Email Notification
 */
async function sendOrderEmailNotification(order) {
  const config = getEmailConfig();
  const recipient = config.adminEmail || process.env.ADMIN_EMAIL || config.smtpUser;

  const subject = `🛒 New Order Placed: #${order.id || 'ORD'} (₹${order.total || 0})`;
  const itemsList = (order.items || []).map(it => `<li>${it.name || 'Product'} × ${it.qty || 1} — ₹${(it.price || 0) * (it.qty || 1)}</li>`).join('');

  const html = `
    <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; color: #0f172a;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h2 style="color: #ea580c; margin-top: 0;">🛒 New Order Received!</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customerName || order.name || 'Customer'} (${order.phone || ''})</p>
        <p><strong>Delivery Address:</strong> ${order.address || order.location || 'N/A'}</p>
        <p><strong>Total Amount:</strong> ₹${order.total || 0}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <h3>Ordered Items:</h3>
        <ul>${itemsList || '<li>No items list provided</li>'}</ul>
      </div>
    </div>
  `;

  console.log(`[EmailService] Order notification logged for Order #${order.id}`);

  const transporter = createTransporter();
  if (!transporter) return { success: true, logged: true };

  try {
    const info = await transporter.sendMail({
      from: `"BuilderPro Orders" <${config.smtpUser}>`,
      to: recipient,
      subject: subject,
      html: html
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Order email error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Test Email
 */
async function sendTestEmail(targetEmail) {
  const config = getEmailConfig();
  const recipient = targetEmail || config.adminEmail || process.env.ADMIN_EMAIL;

  if (!recipient) {
    throw new Error('Please specify an Admin recipient email address.');
  }

  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP user & password are required to send emails. Please enter your Gmail ID & App Password in Email Settings.');
  }

  const info = await transporter.sendMail({
    from: `"BuilderPro Marketplace" <${config.smtpUser}>`,
    to: recipient,
    subject: '✅ BuilderPro Email Notifications Test - Successful!',
    html: `
      <div style="font-family: sans-serif; padding: 25px; background: #f8fafc; color: #0f172a;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <span style="font-size: 40px;">🎉</span>
          <h2 style="color: #ea580c; margin: 10px 0;">Email Alerts are Working!</h2>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Your BuilderPro store email notification system has been configured properly. All new customer inquiries, quote requests, and orders will now arrive directly at <strong>${recipient}</strong>.
          </p>
        </div>
      </div>
    `
  });

  return { success: true, messageId: info.messageId, recipient };
}

module.exports = {
  getEmailConfig,
  saveEmailConfig,
  sendLeadEmailNotification,
  sendOrderEmailNotification,
  sendTestEmail
};
