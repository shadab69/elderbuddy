// Email-configuration tests.
//
// SMTP credentials come exclusively from environment variables
// (backend/services/emailService.js). The API-facing config response is
// built by backend/controllers/emailController.js: it must NEVER expose
// the raw password (masked as '********', or empty when unset) and it
// reports `isConfigured` from the presence of SMTP user + password.
// saveEmailConfig() must never be able to change SMTP credentials —
// only non-secret preferences (admin email, notify flags).

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const emailService = require('../backend/services/emailService');
const emailController = require('../backend/controllers/emailController');

const ENV_KEYS = [
  'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_SERVICE', 'SMTP_USER', 'SMTP_PASS',
  'EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS',
  'ADMIN_EMAIL', 'NOTIFY_ON_INQUIRY', 'NOTIFY_ON_ORDER'
];

const RAW_PASS = 'super-secret-app-password';
let savedEnv;

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) { savedEnv[k] = process.env[k]; delete process.env[k]; }
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
}

async function getConfigViaController() {
  const res = mockRes();
  await emailController.getConfig({}, res);
  return res.body;
}

describe('emailService.getEmailConfig (environment-driven)', () => {
  it('reports empty credentials and gmail defaults when no env is set', () => {
    const cfg = emailService.getEmailConfig();
    assert.equal(cfg.smtpUser, '');
    assert.equal(cfg.smtpPass, '');
    assert.equal(cfg.service, 'gmail');
    assert.equal(cfg.smtpHost, 'smtp.gmail.com');
    assert.equal(cfg.smtpPort, 465);
  });

  it('reads credentials from SMTP_USER / SMTP_PASS', () => {
    process.env.SMTP_USER = 'owner@example.com';
    process.env.SMTP_PASS = RAW_PASS;
    const cfg = emailService.getEmailConfig();
    assert.equal(cfg.smtpUser, 'owner@example.com');
    assert.equal(cfg.smtpPass, RAW_PASS);
  });

  it('falls back to the legacy EMAIL_USER / EMAIL_PASS aliases', () => {
    process.env.EMAIL_USER = 'legacy@example.com';
    process.env.EMAIL_PASS = RAW_PASS;
    const cfg = emailService.getEmailConfig();
    assert.equal(cfg.smtpUser, 'legacy@example.com');
    assert.equal(cfg.smtpPass, RAW_PASS);
  });
});

describe('emailController.getConfig (API response safety)', () => {
  it('masks the password and reports isConfigured=true when credentials are set', async () => {
    process.env.SMTP_USER = 'owner@example.com';
    process.env.SMTP_PASS = RAW_PASS;
    const body = await getConfigViaController();
    assert.equal(body.isConfigured, true);
    assert.equal(body.smtpPass, '********');
    assert.ok(!JSON.stringify(body).includes(RAW_PASS), 'raw password must never appear in the API response');
  });

  it('returns an empty password and isConfigured=false when credentials are missing', async () => {
    const body = await getConfigViaController();
    assert.equal(body.isConfigured, false);
    assert.equal(body.smtpPass, '');
  });

  it('reports isConfigured=false when only the user is set (no password)', async () => {
    process.env.SMTP_USER = 'owner@example.com';
    const body = await getConfigViaController();
    assert.equal(body.isConfigured, false);
    assert.equal(body.smtpPass, '');
  });
});

describe('emailService.saveEmailConfig (credential protection)', () => {
  it('cannot override SMTP credentials, only non-secret preferences', () => {
    process.env.SMTP_USER = 'owner@example.com';
    process.env.SMTP_PASS = RAW_PASS;
    const updated = emailService.saveEmailConfig({
      smtpUser: 'attacker@example.com',
      smtpPass: 'pwned',
      smtpHost: 'evil.example.com',
      adminEmail: 'admin@example.com',
      notifyOnOrder: false
    });
    assert.equal(updated.smtpUser, 'owner@example.com', 'smtpUser must stay env-managed');
    assert.equal(updated.smtpPass, RAW_PASS, 'smtpPass must stay env-managed');
    assert.equal(updated.smtpHost, 'smtp.gmail.com', 'smtpHost must stay env-managed');
    assert.equal(updated.adminEmail, 'admin@example.com', 'admin email preference is allowed');
    assert.equal(updated.notifyOnOrder, false, 'notify preference is allowed');
  });
});
