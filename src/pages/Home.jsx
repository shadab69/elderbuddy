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
    'wrench': 'Wrench'
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

  // Filter products for lists
  const hotDealsIds = ['hd1', 'hd2', 'hd3', 'hd4', 'hd5', 'hd6'];
  const hotDeals = products.filter((p) => hotDealsIds.includes(p.id));

  const offersIds = ['hd7', 'hd8', 'hd9', 'hd10', 'hd11', 'hd12'];
  const offersForYou = products.filter((p) => offersIds.includes(p.id));

  const trendingProducts = products.filter((p) => p.id.startsWith('tr'));
  const featuredProducts = products.filter((p) => p.id.startsWith('p')); // Display catalog products as featured

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

      {/* Brands Marquee Section */}
      <PartnerBrands />

      {/* Hot Deals Showcase */}
      {hotDeals.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <h2>Hot Deals</h2>
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
          <div className="section-header">
            <h2>Offers For You</h2>
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
          <div className="section-header">
            <h2>Trending Offers</h2>
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

      {/* Buying Guides Preview */}
      {guides.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Buying Guide & Blogs</h2>
            <Link to="/guides" className="btn-view-all" style={{ backgroundColor: '#2196f3', color: 'white', borderRadius: '4px', padding: '6px 16px', fontWeight: '500', fontSize: '0.85rem', border: 'none', textDecoration: 'none' }}>View All</Link>
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

      {/* Featured Materials Showcase */}
      {featuredProducts.length > 0 && (
        <section className="home-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Featured Materials</h2>
            <Link to="/products" className="btn-view-all" style={{ textDecoration: 'none' }}>View All</Link>
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
