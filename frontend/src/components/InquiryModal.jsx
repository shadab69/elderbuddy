import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText } from 'lucide-react';

export default function InquiryModal() {
  const [service, setService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      const { service: reqService, details: reqDetails } = e.detail || {};
      if (reqService) setService(reqService);
      if (reqDetails) setDetails(reqDetails);
      const modal = document.getElementById('inquiry-modal-overlay');
      if (modal) modal.classList.add('active');
    };
    window.addEventListener('openInquiryModal', handleOpen);
    return () => window.removeEventListener('openInquiryModal', handleOpen);
  }, []);

  const closeModal = () => {
    const modal = document.getElementById('inquiry-modal-overlay');
    if (modal) modal.classList.remove('active');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !name || !phone || !email || !location || !details) return;

    try {
      const payload = {
        name,
        phone,
        email,
        location,
        service: service === 'sourcing' ? 'Bulk Sourcing' : service === 'estimation' ? 'Architectural Layout' : service === 'structural' ? 'Structural Design' : 'Turnkey Construction',
        details
      };
      
      await axios.post('/api/leads', payload);
      setSubmitted(true);
      
      // Reset form fields
      setService('');
      setName('');
      setPhone('');
      setEmail('');
      setLocation('');
      setDetails('');
    } catch (err) {
      console.error('Failed to submit quote request inquiry', err);
      alert('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" id="inquiry-modal-overlay">
      <div className="modal-card inquiry-modal">
        <div className="modal-header">
          <h3><FileText style={{ width: '18px', height: '18px', marginRight: '8px' }} /> Construction Services Quote Request</h3>
          <button 
            type="button"
            className="btn-close-modal" 
            onClick={closeModal}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>✅</span>
            <h4>Inquiry Submitted Successfully!</h4>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Our structural engineering team will review your requirements and get back to you shortly.</p>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={closeModal}
              style={{ marginTop: '20px' }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="modal-intro">Tell us about your project requirements and our engineering team will get back to you with custom pricing and delivery timelines.</p>
              
              <div className="input-group">
                <label>Select Service Type</label>
                <select 
                  value={service} 
                  onChange={(e) => setService(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Select a Service --</option>
                  <option value="sourcing">Bulk Sourcing & Delivery</option>
                  <option value="estimation">Architectural Layout & Estimation</option>
                  <option value="structural">Structural Design & Engineering</option>
                  <option value="execution">Turnkey Construction Execution</option>
                </select>
              </div>

              <div className="form-row">
                <div class="input-group">
                  <label>Your Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                <div class="input-group">
                  <label>Contact Number</label>
                  <input 
                    type="tel" 
                    placeholder="9876543210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Project Location (City & Pincode)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Delhi, Mumbai, etc. (Pan India)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <label>Project Description & Specifications</label>
                <textarea 
                  rows="4" 
                  placeholder="Mention size of plot, materials required, custom steel grades, or brick types..." 
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">Submit Sourcing Request</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
