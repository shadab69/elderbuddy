import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import * as LucideIcons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import DealCard from '../components/DealCard.jsx';
import HeroCarousel from '../components/home/HeroCarousel.jsx';
import PartnerBrands from '../components/home/PartnerBrands.jsx';
import ClientTestimonials from '../components/home/ClientTestimonials.jsx';
import TrustBadges from '../components/home/TrustBadges.jsx';

// Helper to resolve category Lucide icons dynamically
const getCategoryIcon = (iconName) => {
  if (!iconName) return <LucideIcons.Boxes style={{ width: '28px', height: '28px' }} />;
  
  const nameMap = {
    'boxes': 'Boxes',
    'anvil': 'Anvil',
    'layers': 'Layers',
    'grid': 'Grid',
    'droplet': 'Droplet',
    'zap': 'Zap',
    'paint-bucket': 'PaintBucket',
    'wrench': 'Wrench',
    'sofa': 'Sofa',
    'shield-check': 'ShieldCheck',
    'layout-grid': 'LayoutGrid',
    'rows-3': 'Rows3',
    'sparkles': 'Sparkles'
  };
  
  const componentName = nameMap[iconName.toLowerCase()] || 
    iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    
  const IconComponent = LucideIcons[componentName] || LucideIcons.Boxes;
  return <IconComponent style={{ width: '28px', height: '28px' }} />;
};

export default function Home() {
  const { products, categories, banners, guides, addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Banner State
  const [activeSlide, setActiveSlide] = useState(0);

  // Scroll Track Refs
  const dealsRef = useRef(null);
  const offersRef = useRef(null);
  const trendingRef = useRef(null);
  const guideRef = useRef(null);
  const featuredRef = useRef(null);
  const clientRef = useRef(null);

  // Auto-scroll Banners
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  // Auto-scroll Product Showcases every 4.5 seconds
  useEffect(() => {
    const scrollShowcases = () => {
      const tracks = [
        { ref: dealsRef, amount: 240 },
        { ref: offersRef, amount: 240 },
        { ref: trendingRef, amount: 240 },
        { ref: featuredRef, amount: 280 }
      ];

      tracks.forEach((t) => {
        const el = t.ref.current;
        if (el) {
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 30) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            el.scrollBy({ left: t.amount, behavior: 'smooth' });
          }
        }
      });
    };

    const timer = setInterval(scrollShowcases, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSlideScroll = (ref, amount) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Dynamic Product Slices for Showcases
  const hotDeals = products
    .filter((p) => p.discountLabel || (p.originalPrice && p.originalPrice > p.price))
    .slice(0, 10);

  const offersForYou = products
    .filter((p) => ['cement', 'steel', 'bricks', 'tiles', 'plumbing'].includes(p.category))
    .slice(0, 10);

  const trendingProducts = products
    .filter((p) => (p.rating && p.rating >= 4.7) || (p.ratingCount && p.ratingCount >= 40))
    .slice(0, 10);

  const structuralProducts = products
    .filter((p) => ['cement', 'steel', 'bricks'].includes(p.category))
    .slice(0, 8);

  const finishingProducts = products
    .filter((p) => ['tiles', 'paints', 'interior'].includes(p.category))
    .slice(0, 8);

  const electricalPlumbingProducts = products
    .filter((p) => ['electrical', 'plumbing', 'hardware'].includes(p.category))
    .slice(0, 8);

  const featuredProducts = products.length > 0 ? products.slice(0, 14) : [];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Hero Carousel */}
      <HeroCarousel 
        banners={banners} 
        activeSlide={activeSlide} 
        setActiveSlide={setActiveSlide} 
        navigate={navigate} 
      />

      {/* Circular Categories Bar */}
      <section className="home-section" style={{ marginTop: '30px' }}>
        <div className="section-header">
          <h2>Popular Categories</h2>
        </div>
        <div className="categories-slider-wrapper" style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '10px 5px' }}>
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/products?category=${cat.id}`} 
              className="cat-slider-card"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', minWidth: '100px' }}
            >
              <div className="cat-slider-img" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', overflow: 'hidden' }}>
                {getCategoryIcon(cat.icon)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-color)', marginTop: '8px', textAlign: 'center' }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Turnkey "Build Your Home" Highlight Banner */}
      <section className="home-section" style={{ margin: '35px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #ea580c 100%)',
          borderRadius: '16px',
          padding: '35px 40px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '600px', zIndex: 1 }}>
            <span style={{ background: 'rgba(234, 88, 12, 0.3)', border: '1px solid #ea580c', color: '#ffedd5', fontSize: '0.78rem', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '12px' }}>
              🏠 Complete Turnkey Construction Service
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 10px 0', lineHeight: 1.25, color: '#ffffff' }}>
              Apne Sapno Ka Ghar Banaiye — Design Se Lekar Handover Tak
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Fixed BOQ pricing (₹1,650/sq.ft onwards), 108 Quality Checks, Tier-1 materials (Tata Tiscon, UltraTech), and 10-Year Structural Warranty.
            </p>
          </div>
          <div style={{ zIndex: 1 }}>
            <Link 
              to="/build-your-home" 
              className="btn-turnkey-primary" 
              style={{ fontSize: '1rem', padding: '14px 28px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Explore Turnkey Home Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Marquee Section */}
      <PartnerBrands />

      {/* Hot Deals Showcase */}
      {hotDeals.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🔥 Hot Deals & Top Discounts</h2>
            <Link to="/products" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
            <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(dealsRef, -240)}><ChevronLeft /></button>
            <div className="hot-deals-track" ref={dealsRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {hotDeals.map((p) => (
                <DealCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
            <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(dealsRef, 240)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* Offers For You Showcase */}
      {offersForYou.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>⚡ Offers For You</h2>
            <Link to="/products" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
            <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(offersRef, -240)}><ChevronLeft /></button>
            <div className="hot-deals-track" ref={offersRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {offersForYou.map((p) => (
                <DealCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
            <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(offersRef, 240)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* Trending Offers Showcase */}
      {trendingProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🌟 Trending Building Supplies</h2>
            <Link to="/products" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
            <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(trendingRef, -240)}><ChevronLeft /></button>
            <div className="hot-deals-track" ref={trendingRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {trendingProducts.map((p) => (
                <DealCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
            <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(trendingRef, 240)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* Structural Materials Category Row */}
      {structuralProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🏗️ Structural & Foundation Supplies (Cement, Steel & Bricks)</h2>
            <Link to="/products?category=cement" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-track" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {structuralProducts.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* Finishing & Flooring Category Row */}
      {finishingProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>🎨 Finishing, Tiles, Paints & Interior</h2>
            <Link to="/products?category=tiles" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-track" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {finishingProducts.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* Electrical & Plumbing Category Row */}
      {electricalPlumbingProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>⚡ Plumbing & Electrical Fixtures</h2>
            <Link to="/products?category=electrical" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
          </div>
          <div className="hot-deals-track" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {electricalPlumbingProducts.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Materials Showcase */}
      {featuredProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>💎 All Featured Construction Materials</h2>
            <Link to="/products" className="btn-view-all" style={{ textDecoration: 'none' }}>View All Products</Link>
          </div>
          <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
            <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(featuredRef, -280)}><ChevronLeft /></button>
            <div className="hot-deals-track" id="featured-track" ref={featuredRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
            <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(featuredRef, 280)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* Buying Guides Preview */}
      {guides.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>📚 Buying Guides & Expert Construction Blogs</h2>
            <Link to="/guides" className="btn-view-all" style={{ backgroundColor: '#2196f3', color: 'white', borderRadius: '4px', padding: '6px 16px', fontWeight: '500', fontSize: '0.85rem', border: 'none', textDecoration: 'none' }}>View All Guides</Link>
          </div>
          <div className="hot-deals-carousel-wrapper" style={{ position: 'relative' }}>
            <button type="button" className="brands-arrow prev" onClick={() => handleSlideScroll(guideRef, -280)}><ChevronLeft /></button>
            <div className="buying-guide-track" ref={guideRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollBehavior: 'smooth' }}>
              {guides.map((g) => (
                <Link key={g._id || g.id} to={`/guide/${g.id}`} className="guide-card-link" style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div className="guide-card">
                    <div className="guide-card-media" style={{ height: '160px', overflow: 'hidden' }}>
                      {g.imageSrc && g.imageSrc.startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: g.imageSrc }} className="raw-svg-wrapper" />
                      ) : (
                        <img src={g.imageSrc} alt={g.title} className="guide-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className="guide-card-body" style={{ padding: '12px' }}>
                      <div className="guide-card-date" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{g.date}</div>
                      <h4 className="guide-card-title" style={{ fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>{g.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button type="button" className="brands-arrow next" onClick={() => handleSlideScroll(guideRef, 280)}><ChevronRight /></button>
          </div>
        </section>
      )}

      {/* What Client Say Testimonial Section */}
      <ClientTestimonials 
        clientRef={clientRef} 
        handleSlideScroll={handleSlideScroll} 
      />

      {/* Trust Badges Bar */}
      <TrustBadges />
    </div>
  );
}
