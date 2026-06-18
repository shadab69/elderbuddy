import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ClientTestimonials({ clientRef, handleSlideScroll }) {
  return (
    <section className="home-section text-center">
      <div className="section-header" style={{ justifyContent: 'center', borderBottom: 'none', marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center', width: '100%' }}>What Clients Say</h2>
      </div>
      <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
        <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(clientRef, -300)}><ChevronLeft /></button>
        <div className="client-testimonials-track" ref={clientRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
          <div className="testimonial-card-bm" style={{ flexShrink: 0, minWidth: '300px' }}>
            <span className="testimonial-quote-bm">”</span>
            <p className="testimonial-text-bm">"ElderOBuddy is an EXCELLENT platform for all types of Building Material and Construction products like Cement ,TMT,Electricals, Plumbing etc. It helps us to procure building materials during construction period at best price."</p>
            <div className="testimonial-divider-bm"></div>
          </div>
          <div className="testimonial-card-bm" style={{ flexShrink: 0, minWidth: '300px' }}>
            <span className="testimonial-quote-bm">”</span>
            <p className="testimonial-text-bm">Portals like ElderOBuddy which I am using are being used by many more people like me. This has helped us to get all construction needs under one roof.</p>
            <div className="testimonial-divider-bm"></div>
          </div>
          <div className="testimonial-card-bm" style={{ flexShrink: 0, minWidth: '300px' }}>
            <span className="testimonial-quote-bm">”</span>
            <p className="testimonial-text-bm">ElderOBuddy.in has shown the path to the future of buying construction materials. Easy to purchase for everyone. They provide support throughout, from getting the best quotes to material delivery at the sites.</p>
            <div className="testimonial-divider-bm"></div>
          </div>
        </div>
        <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(clientRef, 300)}><ChevronRight /></button>
      </div>
    </section>
  );
}
