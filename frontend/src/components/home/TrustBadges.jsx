import React from 'react';

export default function TrustBadges() {
  return (
    <section className="trust-bar-section" style={{ marginTop: '40px' }}>
      <div className="container trust-bar-grid">
        <div className="trust-badge-item">
          <span style={{ fontSize: '2rem' }}>💳</span>
          <div className="trust-content-bm">
            <h4>100% SECURE PAYMENTS</h4>
            <p>UPI, Cards, and Netbanking support.</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <div className="trust-content-bm">
            <h4>TRUST PAY</h4>
            <p>100% Payment Protection.</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <span style={{ fontSize: '2rem' }}>🚚</span>
          <div className="trust-content-bm">
            <h4>ON-TIME DELIVERY</h4>
            <p>Direct bulk shipping to your construction site.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
