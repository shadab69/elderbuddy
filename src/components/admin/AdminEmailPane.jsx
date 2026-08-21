import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, CheckCircle2, AlertTriangle, Send, Save, Key, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AdminEmailPane() {
  const [config, setConfig] = useState({
    adminEmail: '',
    service: 'gmail',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpSecure: true,
    smtpUser: '',
    smtpPass: '',
    notifyOnInquiry: true,
    notifyOnOrder: true,
    isConfigured: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/email/config');
      setConfig(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.warn('Failed to load email config from server, using local defaults', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg(null);
      const res = await axios.post('/api/email/config', config);
      setConfig(prev => ({ ...prev, ...res.data.config }));
      setStatusMsg({ type: 'success', text: 'Email alert settings saved successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!config.adminEmail) {
      alert('Please enter an Admin Receiving Email first.');
      return;
    }
    try {
      setTesting(true);
      setStatusMsg(null);
      const res = await axios.post('/api/email/test', { targetEmail: config.adminEmail });
      setStatusMsg({ type: 'success', text: `Test email sent to ${config.adminEmail}! Please check your inbox (and spam folder).` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.error || err.response?.data?.message || 'Failed to send test email. Please check your App Password.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '30px', textAlign: 'center' }}>Loading email notification settings...</div>;
  }

  return (
    <div className="admin-pane email-pane">
      <div className="admin-pane-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2><Mail style={{ display: 'inline', width: '22px', height: '22px', marginRight: '8px', verticalAlign: 'middle', color: '#ea580c' }} /> Customer Form Email Alerts</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Configure the email where all customer quote inquiries, contact forms, and order notifications are delivered.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {config.isConfigured ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
              <CheckCircle2 style={{ width: '15px', height: '15px' }} /> SMTP Active
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
              <AlertTriangle style={{ width: '15px', height: '15px' }} /> Credentials Pending
            </span>
          )}
        </div>
      </div>

      {statusMsg && (
        <div style={{
          marginTop: '15px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: statusMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: statusMsg.type === 'success' ? '#15803d' : '#b91c1c',
          fontSize: '0.86rem',
          fontWeight: '600'
        }}>
          {statusMsg.type === 'success' ? '✅ ' : '❌ '} {statusMsg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Main Settings Form */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ color: '#ea580c', width: '18px', height: '18px' }} /> Email Alert Configuration
          </h3>

          <form onSubmit={handleSave}>
            <div className="input-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '700' }}>
                📬 Admin Receiving Email Address *
              </label>
              <input 
                type="email" 
                required 
                placeholder="your_email@gmail.com" 
                value={config.adminEmail} 
                onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                All quote forms & inquiries submitted by customers will be delivered to this inbox.
              </span>
            </div>

            <div className="input-group" style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '700' }}>
                📤 Sender Gmail Address (SMTP User)
              </label>
              <input 
                type="email" 
                placeholder="your_sender_gmail@gmail.com" 
                value={config.smtpUser} 
                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: '700' }}>
                <Key style={{ display: 'inline', width: '14px', height: '14px', marginRight: '4px', verticalAlign: 'middle' }} />
                Gmail 16-Digit App Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••••••••••" 
                value={config.smtpPass} 
                onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Not your regular Gmail password. Generate a 16-digit App Password from Google Account Security.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                type="submit" 
                disabled={saving}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
                {saving ? 'Saving...' : 'Save Settings'}
              </button>

              <button 
                type="button"
                disabled={testing}
                onClick={handleTestEmail}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
                {testing ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
          </form>
        </div>

        {/* Setup Guide / Instructions */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
            <HelpCircle style={{ color: '#ea580c', width: '18px', height: '18px' }} />
            How to get Gmail App Password (2 Minutes)
          </h3>
          <ol style={{ fontSize: '0.82rem', color: '#475569', paddingLeft: '18px', lineHeight: '1.6', margin: 0 }}>
            <li>Go to your Google Account at <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" style={{ color: '#ea580c', fontWeight: '700' }}>Google Security</a>.</li>
            <li>Ensure <strong>2-Step Verification</strong> is enabled.</li>
            <li>Type an app name like <code>Elder-O-Buddy Alerts</code> and click <strong>Create</strong>.</li>
            <li>Copy the <strong>16-digit password</strong> and paste it in the box on the left.</li>
            <li>Click <strong>Save Settings</strong> and then <strong>Send Test Email</strong>!</li>
          </ol>

          <div style={{ marginTop: '16px', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
            💡 <strong>Instant Terminal & Console Logs:</strong> All customer inquiries and order requests are also logged with full customer phone numbers & messages directly in your backend terminal console!
          </div>
        </div>
      </div>
    </div>
  );
}
