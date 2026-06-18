import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export default function Footer() {
  const openEstimator = (e) => {
    e.preventDefault();
    const modal = document.getElementById('calc-modal-overlay');
    if (modal) modal.classList.add('active');
  };

  const openInquiry = (e) => {
    e.preventDefault();
    const modal = document.getElementById('inquiry-modal-overlay');
    if (modal) modal.classList.add('active');
  };

  return (
    <footer className="app-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Link to="/" className="logo-area footer-logo" style={{ textDecoration: 'none' }}>
            <div className="logo-icon">
              <HardHat style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="logo-text">Elder-o-<span>Buddy</span></span>
          </Link>
          <p className="footer-desc" style={{ marginTop: '10px' }}>
            India's leading e-store for direct-from-manufacturer building materials. Delivering cement, TMT bars, sand, brick, and plumbing items directly to construction sites.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            {/* Social link placeholder icons */}
            <span className="social-icon" style={{ cursor: 'pointer' }}>📘</span>
            <span className="social-icon" style={{ cursor: 'pointer' }}>🐦</span>
            <span className="social-icon" style={{ cursor: 'pointer' }}>📸</span>
            <span className="social-icon" style={{ cursor: 'pointer' }}>💼</span>
          </div>
        </div>
        
        <div className="footer-links-col">
          <h4>Core Categories</h4>
          <ul>
            <li><Link to="/products?category=cement">Cement & Concrete</Link></li>
            <li><Link to="/products?category=steel">TMT Steel Bars</Link></li>
            <li><Link to="/products?category=bricks">Bricks & Blocks</Link></li>
            <li><Link to="/products?category=tiles">Tiles & Flooring</Link></li>
            <li><Link to="/products?category=plumbing">Plumbing & Pipes</Link></li>
          </ul>
        </div>
        
        <div className="footer-links-col">
          <h4>Services</h4>
          <ul>
            <li><a href="#" onClick={openEstimator}>Material Estimator</a></li>
            <li><a href="#" onClick={openInquiry}>Bulk Site Sourcing</a></li>
            <li><a href="#" onClick={openInquiry}>Architectural Planning</a></li>
            <li><a href="#" onClick={openInquiry}>Custom Fabrication</a></li>
          </ul>
        </div>
        
        <div className="footer-links-col">
          <h4>Contact Us</h4>
          <ul className="contact-info-list">
            <li>
              <span>📞 +91 7464889991</span>
            </li>
            <li>
              <span>✉️ elderobuddysales@gmail.com</span>
            </li>
            <li>
              <span>⏰ Mon - Sat: 9:00 AM - 7:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; 2026 Elder-o-Buddy Marketplace Private Limited. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
