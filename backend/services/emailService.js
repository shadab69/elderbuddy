const nodemailer = require('nodemailer');

// ---------------------------------------------------------------------------
// Email configuration is provided EXCLUSIVELY through environment variables.
// Never hardcode credentials in source code, and never commit a config file
// containing secrets (see .env.example for the full variable list).
// Supported variables (SMTP_* are canonical; EMAIL_* are legacy aliases):
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_SERVICE / EMAIL_SERVICE,
//   SMTP_USER / EMAIL_USER, SMTP_PASS / EMAIL_PASS, ADMIN_EMAIL,
//   NOTIFY_ON_INQUIRY, NOTIFY_ON_ORDER
// ---------------------------------------------------------------------------

// Non-secret runtime overrides set via the (admin-token protected) config
// endpoint. These live only in memory, are never written to disk, and can
// never override SMTP credentials - those come from the environment only.
let runtimeOverrides = {};

function envConfig() {
  return {
    adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || '',
    service: process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE || 'gmail',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 465,
    smtpSecure: process.env.SMTP_SECURE !== 'false',
    smtpUser: process.env.SMTP_USER || process.env.EMAIL_USER || '',
    smtpPass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
    notifyOnInquiry: process.env.NOTIFY_ON_INQUIRY !== 'false',
    notifyOnOrder: process.env.NOTIFY_ON_ORDER !== 'false'
  };
}

// Read Email Config (environment variables + non-secret runtime overrides)
function getEmailConfig() {
  return { ...envConfig(), ...runtimeOverrides };
}

// Save Email Config: only non-secret preferences (admin notification email,
// notify flags) may be overridden at runtime, in memory only. SMTP host,
// user and password are environment-managed and cannot be changed via API.
function saveEmailConfig(newConfig) {
  const allowed = {};
  if (newConfig && typeof newConfig.adminEmail === 'string') allowed.adminEmail = newConfig.adminEmail;
  if (newConfig && typeof newConfig.notifyOnInquiry === 'boolean') allowed.notifyOnInquiry = newConfig.notifyOnInquiry;
  if (newConfig && typeof newConfig.notifyOnOrder === 'boolean') allowed.notifyOnOrder = newConfig.notifyOnOrder;
  runtimeOverrides = { ...runtimeOverrides, ...allowed };
  return getEmailConfig();
}

// Create Nodemailer Transporter
function createTransporter() {
  const config = getEmailConfig();
  const user = (config.smtpUser || process.env.EMAIL_USER || '').trim();
  let pass = (config.smtpPass || process.env.EMAIL_PASS || '').trim();

  // Strip whitespace from the app password (providers often display it in spaced groups)
  if (pass) {
    pass = pass.replace(/\s+/g, '');
  }

  if (!user || !pass) {
    return null;
  }

  if (config.service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000
    });
  }

  return nodemailer.createTransport({
    host: config.smtpHost || 'smtp.gmail.com',
    port: config.smtpPort || 465,
    secure: config.smtpSecure !== false,
    auth: {
      user: user,
      pass: pass
    },
    connectionTimeout: 10000,
    greetingTimeout: 8000,
    socketTimeout: 15000
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
          <h1>🏗️ Elder-O-Buddy</h1>
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
            ${lead.email ? `<a href="mailto:${lead.email}?subject=Elder-O-Buddy Quote for ${encodeURIComponent(lead.service || 'Your Project')}" class="btn btn-email">✉️ Reply via Email</a>` : ''}
          </div>
        </div>
        <div class="footer">
          Received via Elder-O-Buddy Online Form • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
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
      message: 'Inquiry logged successfully (SMTP credentials pending configuration)'
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Elder-O-Buddy Alerts" <${config.smtpUser}>`,
      to: recipient,
      replyTo: lead.email || config.smtpUser,
      subject: subject,
      html: html
    });
    console.log('[EmailService] Admin inquiry email sent successfully to', recipient, 'MessageId:', info.messageId);

    // Also send automated confirmation email to the Customer (if customer email is provided)
    if (lead.email && lead.email.includes('@') && !lead.email.includes('@turnkeyclient.in')) {
      try {
        await sendCustomerLeadConfirmation(lead);
      } catch (custErr) {
        console.warn('[EmailService] Customer confirmation dispatch note:', custErr.message);
      }
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Error sending email via SMTP:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Automated Confirmation Email Directly to the Customer for Form Submission
 */
async function sendCustomerLeadConfirmation(lead) {
  const config = getEmailConfig();
  if (!lead.email || !lead.email.includes('@') || lead.email.includes('@turnkeyclient.in')) {
    return { success: false, reason: 'No valid customer email' };
  }

  const customerEmail = lead.email.trim();
  const customerName = lead.name || 'Valued Customer';
  const inquiryId = lead.id || 'INQ_AUTO';
  const serviceName = lead.service || 'Building Materials / Turnkey Consultation';
  const location = lead.location || lead.city || 'Your Location';
  const phone = lead.phone || 'Your Phone Number';
  const details = lead.details || lead.message || 'Consultation & Site Estimate Request';

  const subject = `✅ Request Received: Elder-O-Buddy - ${serviceName} (Ref #${inquiryId})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #ea580c, #c2410c); padding: 30px 20px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; opacity: 0.95; font-size: 14px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.25); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .content { padding: 25px 22px; }
        .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
        .sub-text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; }
        .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 22px; }
        .summary-title { font-size: 13px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .info-row { display: flex; margin-bottom: 8px; font-size: 14px; }
        .info-label { width: 35%; color: #64748b; font-weight: 600; }
        .info-val { width: 65%; color: #0f172a; font-weight: 600; }
        .steps-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 22px; }
        .steps-title { font-size: 13px; font-weight: 700; color: #c2410c; margin-bottom: 8px; }
        .steps-list { margin: 0; padding-left: 18px; font-size: 13px; color: #7c2d12; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 18px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .btn-portal { display: inline-block; background: #ea580c; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🏗️ Elder-O-Buddy</h1>
          <p>Thank You! Your Request Has Been Received</p>
          <div class="badge">Inquiry Reference: #${inquiryId}</div>
        </div>
        <div class="content">
          <div class="greeting">Namaste ${customerName}, 🙏</div>
          <div class="sub-text">
            Thank you for reaching out to <strong>Elder-O-Buddy</strong>. We have successfully logged your consultation and quote request. Our civil architects and material specialists are already reviewing your project details.
          </div>

          <div class="summary-card">
            <div class="summary-title">📋 Summary of Your Request</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; width: 35%;">🛠️ Service:</td>
                <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">📍 Location:</td>
                <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">📞 Contact Number:</td>
                <td style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">📝 Requirements:</td>
                <td style="padding: 6px 0; font-size: 13px; color: #334155;">${details.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>

          <div class="steps-box">
            <div class="steps-title">⏱️ What Happens Next?</div>
            <ol class="steps-list">
              <li><strong>Engineer Review:</strong> Our senior project engineer will evaluate your architectural requirements / material bill of quantities (BOQ).</li>
              <li><strong>Direct Callback:</strong> We will call you on <strong>${phone}</strong> shortly to answer your questions and schedule a complimentary site visit.</li>
              <li><strong>Guaranteed Quality:</strong> All construction is backed by our <strong>108-Point Engineering Quality Checklist</strong> and 10-Year Structural Warranty.</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Need immediate assistance? Feel free to explore our product catalog:</p>
            <a href="https://elderobuddy.com/#/products" class="btn-portal">Explore Building Materials & Deals →</a>
          </div>
        </div>
        <div class="footer">
          Elder-O-Buddy Building Materials & Turnkey Home Construction<br>
          For support, reply to this email or visit our website • Delivered with ❤️ across India
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EmailService] Customer confirmation simulated for: ${customerEmail}`);
    return { success: true, logged: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Elder-O-Buddy" <${config.smtpUser}>`,
      to: customerEmail,
      subject: subject,
      html: html
    });
    console.log(`[EmailService] Customer confirmation sent successfully to ${customerEmail}, MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[EmailService] Error sending customer confirmation to ${customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Order Email Notification
 */
async function sendOrderEmailNotification(order) {
  const config = getEmailConfig();
  const recipient = config.adminEmail || process.env.ADMIN_EMAIL || config.smtpUser;

  const orderId = order.id || order._id || 'ORD_AUTO';
  const customerName = order.customer?.name || order.customerName || order.name || 'Valued Customer';
  const customerPhone = order.customer?.phone || order.phone || 'N/A';
  const customerEmail = order.customer?.email || order.email || 'N/A';
  const deliveryAddress = order.customer ? `${order.customer.address || ''}, ${order.customer.city || ''} - ${order.customer.pincode || ''}` : (order.address || 'Site Delivery Location');
  const totalAmount = (order.total || 0).toLocaleString('en-IN');
  const subtotalAmount = (order.subtotal || 0).toLocaleString('en-IN');
  const gstAmount = (order.gst || 0).toLocaleString('en-IN');

  const subject = `🛒 New Material Order Received: #${orderId} (₹${totalAmount}) - ${customerName}`;

  const itemsRows = (order.items || []).map(it => {
    const qty = it.quantity || it.qty || 1;
    const price = it.price || 0;
    const itemTotal = (price * qty).toLocaleString('en-IN');
    return `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 600;">
          ${it.name || 'Building Material'}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: center; color: #475569;">
          ${qty}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; color: #475569;">
          ₹${price.toLocaleString('en-IN')}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; font-weight: 700; color: #0f172a;">
          ₹${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #16a34a, #15803d); padding: 25px 20px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.25); padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .content { padding: 25px 20px; }
        .section-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 8px; font-size: 14px; }
        .info-table td.label { width: 35%; color: #64748b; font-weight: 600; }
        .info-table td.val { font-weight: 600; color: #0f172a; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; background: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .items-table th { background: #e2e8f0; padding: 10px 8px; font-size: 12px; text-transform: uppercase; color: #475569; text-align: left; }
        .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; color: #16a34a; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px; }
        .actions { text-align: center; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; margin: 0 6px; }
        .btn-call { background: #16a34a; color: #ffffff !important; }
        .btn-email { background: #0f172a; color: #ffffff !important; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🏗️ Elder-O-Buddy</h1>
          <p>New Material Delivery Order Received</p>
          <div class="badge">Order ID: #${orderId}</div>
        </div>
        <div class="content">
          <div class="section-title">Customer & Delivery Details</div>
          <table class="info-table">
            <tr>
              <td class="label">👤 Customer Name:</td>
              <td class="val">${customerName}</td>
            </tr>
            <tr>
              <td class="label">📞 Phone Number:</td>
              <td class="val"><a href="tel:${customerPhone}" style="color: #16a34a; text-decoration: none;">${customerPhone}</a></td>
            </tr>
            <tr>
              <td class="label">✉️ Email Address:</td>
              <td class="val"><a href="mailto:${customerEmail}" style="color: #16a34a; text-decoration: none;">${customerEmail}</a></td>
            </tr>
            <tr>
              <td class="label">📍 Delivery Address:</td>
              <td class="val">${deliveryAddress}</td>
            </tr>
            <tr>
              <td class="label">💳 Payment Method:</td>
              <td class="val" style="color: #16a34a;">${order.paymentMethod || 'Cash on Site Delivery'}</td>
            </tr>
          </table>

          <div class="section-title">Ordered Materials</div>
          <table class="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows || '<tr><td colspan="4" style="padding: 10px; text-align: center;">No items found</td></tr>'}
            </tbody>
          </table>

          <div class="summary-box">
            <div style="font-size: 14px; margin-bottom: 4px;"><strong>Subtotal:</strong> ₹${subtotalAmount}</div>
            <div style="font-size: 14px; margin-bottom: 4px;"><strong>GST (18%):</strong> ₹${gstAmount}</div>
            <div style="font-size: 18px; font-weight: 800; color: #16a34a; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
              <strong>Grand Total:</strong> ₹${totalAmount}
            </div>
          </div>

          <div class="actions">
            ${customerPhone !== 'N/A' ? `<a href="tel:${customerPhone}" class="btn btn-call">📞 Call Customer for Dispatch</a>` : ''}
            ${customerEmail !== 'N/A' ? `<a href="mailto:${customerEmail}?subject=Elder-O-Buddy Order Confirmation #${orderId}" class="btn btn-email">✉️ Email Order Receipt</a>` : ''}
          </div>
        </div>
        <div class="footer">
          Received via Elder-O-Buddy Online Store • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`\n======================================================`);
  console.log(`🛒 [NEW ORDER RECEIVED FOR ADMIN EMAIL]`);
  console.log(`➡️ Recipient: ${recipient || '(Admin email not configured yet)'}`);
  console.log(`➡️ Order ID: #${orderId} | Total: ₹${totalAmount}`);
  console.log(`➡️ Customer: ${customerName} (${customerPhone} / ${customerEmail})`);
  console.log(`➡️ Delivery: ${deliveryAddress}`);
  console.log(`======================================================\n`);

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, logged: true, message: 'Order logged locally' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Elder-O-Buddy Orders" <${config.smtpUser}>`,
      to: recipient,
      replyTo: customerEmail !== 'N/A' ? customerEmail : config.smtpUser,
      subject: subject,
      html: html
    });
    console.log('[EmailService] Admin order email sent successfully to', recipient, 'MessageId:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] Order email error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Automated Order Confirmation & Receipt Email to the Customer
 */
async function sendCustomerOrderConfirmation(order) {
  const config = getEmailConfig();
  const customerEmail = (order.customer?.email || order.email || '').trim();
  if (!customerEmail || !customerEmail.includes('@') || customerEmail.includes('@turnkeyclient.in')) {
    return { success: false, reason: 'No valid customer email' };
  }

  const orderId = order.id || order._id || 'ORD_AUTO';
  const customerName = order.customer?.name || order.customerName || order.name || 'Valued Customer';
  const customerPhone = order.customer?.phone || order.phone || 'N/A';
  const deliveryAddress = order.customer ? `${order.customer.address || ''}, ${order.customer.city || ''} - ${order.customer.pincode || ''}` : (order.address || 'Site Delivery Location');
  const totalAmount = (order.total || 0).toLocaleString('en-IN');
  const subtotalAmount = (order.subtotal || 0).toLocaleString('en-IN');
  const gstAmount = (order.gst || 0).toLocaleString('en-IN');

  const subject = `🎉 Order Confirmed: Elder-O-Buddy #${orderId} (₹${totalAmount})`;

  const itemsRows = (order.items || []).map(it => {
    const qty = it.quantity || it.qty || 1;
    const price = it.price || 0;
    const itemTotal = (price * qty).toLocaleString('en-IN');
    return `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #0f172a; font-weight: 600;">
          ${it.name || 'Building Material'}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: center; color: #475569;">
          ${qty}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; color: #475569;">
          ₹${price.toLocaleString('en-IN')}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: right; font-weight: 700; color: #0f172a;">
          ₹${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #16a34a, #15803d); padding: 30px 20px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; opacity: 0.95; font-size: 14px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.25); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .content { padding: 25px 22px; }
        .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
        .sub-text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; }
        .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 22px; }
        .summary-title { font-size: 13px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .items-table th { background: #f1f5f9; padding: 10px 8px; font-size: 12px; text-transform: uppercase; color: #475569; text-align: left; }
        .steps-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 22px; }
        .steps-title { font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 8px; }
        .steps-list { margin: 0; padding-left: 18px; font-size: 13px; color: #14532d; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 18px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🏗️ Elder-O-Buddy</h1>
          <p>Order Placed Successfully!</p>
          <div class="badge">Order ID: #${orderId}</div>
        </div>
        <div class="content">
          <div class="greeting">Namaste ${customerName}, 🙏</div>
          <div class="sub-text">
            Thank you for ordering with <strong>Elder-O-Buddy</strong>. Your construction materials order has been confirmed and is being processed for site dispatch.
          </div>

          <div class="summary-card">
            <div class="summary-title">🚚 Delivery & Payment Details</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b; font-weight: 600; width: 35%;">📍 Site Location:</td>
                <td style="padding: 4px 0; font-size: 13px; color: #0f172a; font-weight: 600;">${deliveryAddress}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b; font-weight: 600;">📞 Contact:</td>
                <td style="padding: 4px 0; font-size: 13px; color: #0f172a; font-weight: 600;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b; font-weight: 600;">💳 Payment Mode:</td>
                <td style="padding: 4px 0; font-size: 13px; color: #16a34a; font-weight: 700;">Cash on Site Delivery</td>
              </tr>
            </table>

            <div class="summary-title">📦 Ordered Materials</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Rate</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                <span>Subtotal:</span>
                <span>₹${subtotalAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                <span>GST (18%):</span>
                <span>₹${gstAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #16a34a; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 4px;">
                <span>Grand Total:</span>
                <span>₹${totalAmount}</span>
              </div>
            </div>
          </div>

          <div class="steps-box">
            <div class="steps-title">🚚 Dispatch & Delivery Process</div>
            <ol class="steps-list">
              <li><strong>Site Call:</strong> Our logistics manager will call you at <strong>${customerPhone}</strong> within 30 minutes to confirm vehicle unloading access.</li>
              <li><strong>Material Inspection:</strong> You can inspect all brand ISI seals and batch certificates upon delivery truck arrival.</li>
              <li><strong>Payment:</strong> Pay securely upon satisfactory delivery at site.</li>
            </ol>
          </div>
        </div>
        <div class="footer">
          Elder-O-Buddy Building Materials Marketplace<br>
          For inquiries or support, reply directly to this email • Thank you for building with us!
        </div>
      </div>
    </body>
    </html>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EmailService] Customer order confirmation simulated for: ${customerEmail}`);
    return { success: true, logged: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Elder-O-Buddy Orders" <${config.smtpUser}>`,
      to: customerEmail,
      subject: subject,
      html: html
    });
    console.log(`[EmailService] Customer order confirmation sent successfully to ${customerEmail}, MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[EmailService] Error sending customer order confirmation to ${customerEmail}:`, err.message);
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
    from: `"Elder-O-Buddy" <${config.smtpUser}>`,
    to: recipient,
    subject: '✅ Elder-O-Buddy Email Notifications Test - Successful!',
    html: `
      <div style="font-family: sans-serif; padding: 25px; background: #f8fafc; color: #0f172a;">
        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <span style="font-size: 40px;">🎉</span>
          <h2 style="color: #ea580c; margin: 10px 0;">Email Alerts are Working!</h2>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Your Elder-O-Buddy store email notification system has been configured properly. All new customer inquiries, quote requests, and orders will now arrive directly at <strong>${recipient}</strong>.
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
  sendCustomerLeadConfirmation,
  sendOrderEmailNotification,
  sendCustomerOrderConfirmation,
  sendTestEmail
};
