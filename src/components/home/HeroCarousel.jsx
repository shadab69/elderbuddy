import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel({ banners, activeSlide, setActiveSlide, navigate }) {
  if (banners.length === 0) return null;

  return (
    <section className="hero-carousel-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="carousel-track">
        {banners.map((b, idx) => {
          const bgPos = b.position ? `center ${b.position}` : 'center';
          const linkUrl = b.link || '/products';
          const isActive = idx === activeSlide;
          
          const slideStyles = {
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            backgroundPosition: bgPos,
            backgroundRepeat: 'no-repeat',
            backgroundColor: b.bgColor || 'transparent',
            flexShrink: 0
          };

          if (b.styleType === 'dual') {
            return (
              <div 
                key={b._id || idx} 
                className={`carousel-slide ${isActive ? 'active' : ''}`}
                onClick={() => navigate(linkUrl.replace('#', ''))}
                style={{ ...slideStyles, position: 'relative' }}
              >
                <div className="slide-blur-bg" style={{ backgroundImage: `url('${b.imageSrc}')`, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, filter: 'blur(20px)', backgroundSize: 'cover' }}></div>
                <div className="slide-main-img" style={{ backgroundImage: `url('${b.imageSrc}')`, position: 'relative', width: '100%', height: '100%', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
              </div>
            );
          }

          const bgSize = b.styleType === 'contain' ? 'contain' : b.styleType === 'stretch' ? '100% 100%' : 'cover';

          return (
            <div 
              key={b._id || idx} 
              className={`carousel-slide ${isActive ? 'active' : ''}`}
              onClick={() => navigate(linkUrl.replace('#', ''))}
              style={{ 
                ...slideStyles, 
                backgroundImage: `url('${b.imageSrc}')`,
                backgroundSize: bgSize
              }}
            ></div>
          );
        })}
      </div>

      <button 
        type="button"
        className="carousel-arrow prev" 
        onClick={() => setActiveSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
      >
        <ChevronLeft />
      </button>
      <button 
        type="button"
        className="carousel-arrow next" 
        onClick={() => setActiveSlide((prev) => (prev + 1) % banners.length)}
      >
        <ChevronRight />
      </button>

      <div className="carousel-indicators">
        {banners.map((_, idx) => (
          <span 
            key={idx}
            className={`indicator ${idx === activeSlide ? 'active' : ''}`}
            onClick={() => setActiveSlide(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
}
