import React from 'react';

export default function PartnerBrands() {
  return (
    <section className="home-section">
      <div className="section-header">
        <h2>Partner Brands</h2>
      </div>
      <div className="brands-carousel-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="brands-track marquee-infinite" style={{ display: 'flex', gap: '20px' }}>
          <div className="brand-item-card"><div className="brand-logo-mock ambuja">Ambuja<span>Cement</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock asianpaints">asian<span>paints</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock birla">Birla-A1<span>StrongCrete</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock bondit">BONDIT<span>Const. Chemicals</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock centuryply">CENTURY<span>PLY</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock grasim">G<span>GRASIM</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock godrej">godrej</div></div>
          <div className="brand-item-card"><div className="brand-logo-mock greenpanel">green<span>panel</span></div></div>
          {/* Repeat for Infinite loop */}
          <div className="brand-item-card"><div className="brand-logo-mock ambuja">Ambuja<span>Cement</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock asianpaints">asian<span>paints</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock birla">Birla-A1<span>StrongCrete</span></div></div>
          <div className="brand-item-card"><div className="brand-logo-mock bondit">BONDIT<span>Const. Chemicals</span></div></div>
        </div>
      </div>
    </section>
  );
}
