import React, { useContext } from 'react';
import { AppContext } from '../App.jsx';
import ProfessionalCard from '../components/ProfessionalCard.jsx';

export default function Builders() {
  const { builders } = useContext(AppContext);

  return (
    <section className="interior-designers-section">
      <div className="interior-hero-banner" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="container">
          <h1>Premium Builders & Construction Partners</h1>
          <p>
            Connect with verified builders, browse successful commercial and residential structural
            projects, and request a consultation.
          </p>
        </div>
      </div>

      <div className="container interior-content-container">
        <div className="designers-grid">
          {builders.map((builder) => (
            <ProfessionalCard
              key={builder.id || builder._id}
              professional={builder}
              type="builder"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
