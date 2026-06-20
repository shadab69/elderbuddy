import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';

export default function Guides() {
  const { guides } = useContext(AppContext);

  return (
    <section className="interior-designers-section">
      <div className="interior-hero-banner" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
        <div className="container">
          <h1>Elder-o-Buddy Buying Guides & Blogs</h1>
          <p>
            Read expert guidelines, material quality checking tips, and price estimation rules for building materials.
          </p>
        </div>
      </div>

      <div className="container interior-content-container" style={{ marginTop: '40px' }}>
        <div className="guides-grid">
          {guides.map((g) => (
            <Link key={g._id || g.id} to={`/guide/${g.id}`} className="guide-card-link" style={{ textDecoration: 'none' }}>
              <div className="guide-card">
                <div className="guide-card-media" style={{ height: '180px', overflow: 'hidden' }}>
                  {g.imageSrc && g.imageSrc.startsWith('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: g.imageSrc }} className="raw-svg-wrapper" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  ) : (
                    <img src={g.imageSrc} alt={g.title} className="guide-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="guide-card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="guide-card-date" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.date}</div>
                  <h4 className="guide-card-title" style={{ fontSize: '1.05rem', margin: 0, fontWeight: '700', color: 'var(--text-main)' }}>{g.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                    {g.content ? g.content.replace(/[#*`]/g, '').substring(0, 120) + '...' : 'Read expert tips and specifications about this material in this complete guide.'}
                  </p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', display: 'inline-block', marginTop: '10px' }}>Read Full Guide &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
