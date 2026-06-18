import React, { useContext } from 'react';
import { AppContext } from '../App.jsx';
import ProfessionalCard from '../components/ProfessionalCard.jsx';

export default function Designers() {
  const { designers } = useContext(AppContext);

  return (
    <section className="interior-designers-section">
      <div className="interior-hero-banner">
        <div className="container">
          <h1>Premium Interior Designers in Pan India</h1>
          <p>
            Connect with top-rated interior design experts, browse their portfolios, and book a
            free design consultation today.
          </p>
        </div>
      </div>

      <div className="container interior-content-container">
        <div className="designers-grid">
          {designers.map((designer) => (
            <ProfessionalCard
              key={designer.id || designer._id}
              professional={designer}
              type="designer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
