import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ChevronDown, ChevronRight, Search, ShoppingCart, Sun, Moon, Menu, X, Sparkles, Building, Calculator, UserCheck, BookOpen, Layers } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const getCategoryIcon = (iconName) => {
  if (!iconName) return <LucideIcons.Boxes style={{ width: '18px', height: '18px', strokeWidth: 2 }} />;
  
  const nameMap = {
    'boxes': 'Boxes',
    'anvil': 'Anvil',
    'layers': 'Layers',
    'grid': 'Grid',
    'droplet': 'Droplet',
    'zap': 'Zap',
    'paint-bucket': 'PaintBucket',
    'wrench': 'Wrench',
    'sofa': 'Sofa'
  };
  
  const componentName = nameMap[iconName.toLowerCase()] || 
    iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    
  const IconComponent = LucideIcons[componentName] || LucideIcons.Boxes;
  return <IconComponent style={{ width: '18px', height: '18px', strokeWidth: 2 }} />;
};

export default function Navbar({ mobileDrawerOpen, setMobileDrawerOpen }) {
  const { categories = [], cart = [], theme, setTheme } = useContext(AppContext);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const catMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCatId) {
      setActiveCatId(categories[0].id);
    }
  }, [categories, activeCatId]);

  // Close categories menu on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setCatMenuOpen(false);
      }
    };

    if (catMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [catMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (setMobileDrawerOpen) setMobileDrawerOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = (cart || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Toggle Cart Drawer
  const openCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  };

  // Toggle Estimator Modal
  const openEstimator = () => {
    if (setMobileDrawerOpen) setMobileDrawerOpen(false);
    const modal = document.getElementById('calc-modal-overlay');
    if (modal) modal.classList.add('active');
  };

  const triggerAIAssistant = () => {
    if (setMobileDrawerOpen) setMobileDrawerOpen(false);
    const btn = document.querySelector('.agentic-floating-launcher');
    if (btn) btn.click();
  };

  return (
    <header className="app-header-light">
      {/* Main Top Header Row */}
      <div className="container main-header-row">
        {/* Left Section: Mobile Hamburger Toggle + Logo */}
        <div className="header-left-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            type="button" 
            className="mobile-hamburger-btn" 
            onClick={() => setMobileDrawerOpen && setMobileDrawerOpen(!mobileDrawerOpen)}
            aria-label="Open Navigation Menu"
          >
            {mobileDrawerOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>

          {/* Elder-o-Buddy Logo */}
          <Link to="/" className="logo-area-bm" style={{ textDecoration: 'none' }}>
            <span className="logo-orange">Elder</span> <span className="logo-blk">-O-</span> <span className="logo-dark">Buddy</span>
            <sup className="logo-tm">®</sup>
          </Link>
        </div>
        
        {/* Desktop Shop by Categories Hover Dropdown */}
        <div 
          ref={catMenuRef} 
          className="category-select-bm desktop-only" 
          onMouseEnter={() => setCatMenuOpen(true)}
          onMouseLeave={() => setCatMenuOpen(false)}
        >
          <button 
            type="button"
            className="btn-category-bm" 
            onClick={() => setCatMenuOpen(!catMenuOpen)}
          >
            <span>Shop by Categories</span>
            <ChevronDown className={`chevron ${catMenuOpen ? 'rotate-180' : ''}`} style={{ width: '16px', height: '16px', marginLeft: '5px' }} />
          </button>
          
          <div className={`horizontal-cat-menu-bm ${catMenuOpen ? 'show' : ''}`}>
            <div className="mega-top-gradient-bar"></div>
            <div className="mega-menu-top-header">
              <div className="mega-menu-title-area">
                <span className="mega-badge">Explore Store</span>
                <h3 className="mega-main-heading">All Product Categories & Building Materials</h3>
              </div>
              <Link to="/products" className="mega-quick-all-link" onClick={() => setCatMenuOpen(false)}>
                Browse Full Catalog →
              </Link>
            </div>

            <div className="horizontal-cat-grid">
              {(categories || []).map((cat) => (
                <div key={cat.id} className="horizontal-cat-card">
                  <Link 
                    to={`/products?category=${cat.id}`}
                    className="horizontal-cat-header"
                    onClick={() => setCatMenuOpen(false)}
                  >
                    <div className="horizontal-cat-icon">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div className="horizontal-cat-header-info">
                      <span className="horizontal-cat-title">{cat.name}</span>
                      <span className="horizontal-cat-count">{(cat.subcategories || []).length} Subcategories</span>
                    </div>
                  </Link>

                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="horizontal-subcat-list">
                      {cat.subcategories.map((subcat) => (
                        <Link 
                          key={subcat.id} 
                          to={`/products?category=${cat.id}&subcat=${subcat.id}`}
                          className="horizontal-subcat-link"
                          onClick={() => setCatMenuOpen(false)}
                        >
                          <span className="subcat-dot"></span>
                          <span className="subcat-text">{subcat.name}</span>
                          <span className="subcat-arrow">→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mega-menu-bottom-footer">
              <div className="mega-footer-left">
                <span className="mega-footer-icon">⚡</span>
                <span>Direct Site Delivery Across Pan-India</span>
              </div>
              <div className="mega-footer-right">
                <Link to="/guides" onClick={() => setCatMenuOpen(false)} className="mega-footer-link">Buying Guides</Link>
                <span className="dot-sep">•</span>
                <span onClick={openEstimator} className="mega-footer-link" style={{ cursor: 'pointer' }}>Material Calculator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Search Bar */}
        <form className="search-form-bm desktop-only" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search entire store here..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required 
            autoComplete="off"
            aria-label="Search materials"
          />
          <button type="submit" className="btn-search-bm" aria-label="Submit search">
            <Search style={{ width: '18px', height: '18px' }} />
          </button>
        </form>

        {/* Right Section: Action Buttons & Cart */}
        <div className="header-right-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Action Buttons */}
          <div className="header-action-buttons-bm" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/admin" className="btn-price-check desktop-only" style={{ textDecoration: 'none' }}>
              <span className="check-box-icon">✓</span> Price Check
            </Link>

            {/* AI Copilot Badge */}
            <button 
              type="button" 
              className="btn-ai-header desktop-only"
              onClick={triggerAIAssistant}
              title="Ask AI Assistant"
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                color: '#fdba74',
                border: '1px solid #ea580c',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Sparkles style={{ width: '14px', height: '14px', color: '#f97316' }} />
              <span>AI Copilot</span>
            </button>

            {/* Premium Theme Switcher */}
            <button 
              type="button" 
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle Light/Dark Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? <Moon style={{ width: '18px', height: '18px' }} /> : <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} />}
            </button>

            <button 
              type="button" 
              className="btn-become-seller desktop-only"
              onClick={() => navigate('/admin')}
            >
              Become a Seller
            </button>
          </div>

          {/* Cart Trigger */}
          <div className="cart-trigger-bm" onClick={openCartDrawer} style={{ cursor: 'pointer' }} aria-label="Shopping Cart">
            <ShoppingCart className="cart-icon" style={{ width: '20px', height: '20px' }} />
            <span className="desktop-only">Cart</span>
            <span className="cart-badge-bm">{totalItems}</span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Visible on mobile) */}
      <div className="mobile-search-row">
        <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search cement, steel, tiles, paints..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
            aria-label="Mobile Search"
          />
          <button type="submit" className="btn-mobile-search" aria-label="Search">
            <Search style={{ width: '16px', height: '16px' }} />
          </button>
        </form>
      </div>

      {/* Middle Menu Row (Desktop) */}
      <nav className="middle-menu-nav desktop-only">
        <div className="container menu-nav-container">
          <Link to="/products?category=cement" className="menu-link">Cement Exchange</Link>
          <Link to="/" className="menu-link">Brands</Link>
          <Link to="/guides" className="menu-link">Buying Guide</Link>
          <Link to="/products" className="menu-link">Best Selling</Link>
          <span className="menu-link" onClick={openEstimator} style={{ cursor: 'pointer' }}>Material Calculator</span>
          <Link to="/build-your-home" className="menu-link" style={{ color: '#ea580c', fontWeight: '700' }}>🏠 Build Your Home</Link>
          <Link to="/interior-designers" className="menu-link">Interior Designers</Link>
          <Link to="/builders" className="menu-link">Builders</Link>
        </div>
      </nav>

      {/* Mobile Slideout Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-card" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="logo-area-bm" style={{ fontSize: '1.4rem' }}>
                <span className="logo-orange">Elder</span> <span className="logo-blk">-O-</span> <span className="logo-dark">Buddy</span>
              </div>
              <button 
                type="button" 
                className="btn-close-drawer"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Quick Action Highlights */}
              <div className="mobile-drawer-promos">
                <Link 
                  to="/build-your-home" 
                  className="mobile-promo-card"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ background: 'linear-gradient(135deg, #0f172a, #ea580c)', color: '#ffffff' }}
                >
                  <Building style={{ width: '20px', height: '20px' }} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>🏠 Build Your Home</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Complete Turnkey Construction & QA</div>
                  </div>
                </Link>

                <div 
                  className="mobile-promo-card"
                  onClick={triggerAIAssistant}
                  style={{ background: 'linear-gradient(135deg, #1e1b4b, #6366f1)', color: '#ffffff', cursor: 'pointer' }}
                >
                  <Sparkles style={{ width: '20px', height: '20px', color: '#fdba74' }} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem' }}>🤖 AI Copilot</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>Material & Sq.Ft Quantity Estimator</div>
                  </div>
                </div>
              </div>

              {/* Categories Accordion Section */}
              <div className="mobile-drawer-section-title">
                <Layers style={{ width: '16px', height: '16px', color: '#ea580c' }} />
                <span>Shop by Categories</span>
              </div>

              <div className="mobile-cat-accordion-list">
                {categories.map((cat) => {
                  const isExpanded = expandedMobileCat === cat.id;
                  return (
                    <div key={cat.id} className="mobile-accordion-item">
                      <div 
                        className={`mobile-accordion-header ${isExpanded ? 'active' : ''}`}
                        onClick={() => setExpandedMobileCat(isExpanded ? null : cat.id)}
                      >
                        <div className="mobile-acc-title-wrap">
                          <span className="mobile-cat-icon">{getCategoryIcon(cat.icon)}</span>
                          <span className="mobile-cat-name">{cat.name}</span>
                        </div>
                        <ChevronDown className={`mobile-acc-chevron ${isExpanded ? 'rotate-180' : ''}`} style={{ width: '16px', height: '16px' }} />
                      </div>

                      {isExpanded && cat.subcategories && (
                        <div className="mobile-subcat-drawer-grid">
                          <Link 
                            to={`/products?category=${cat.id}`}
                            className="mobile-subcat-chip all-chip"
                            onClick={() => setMobileDrawerOpen(false)}
                          >
                            <span>Browse All {cat.name}</span>
                            <span className="chip-arrow">→</span>
                          </Link>
                          {cat.subcategories.map((subcat) => (
                            <Link 
                              key={subcat.id}
                              to={`/products?category=${cat.id}&subcat=${subcat.id}`}
                              className="mobile-subcat-chip"
                              onClick={() => setMobileDrawerOpen(false)}
                            >
                              <span className="subcat-chip-dot"></span>
                              <span className="subcat-chip-text">{subcat.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* General Navigation Links */}
              <div className="mobile-drawer-section-title" style={{ marginTop: '18px' }}>
                <span>Quick Services</span>
              </div>
              <div className="mobile-nav-links-list">
                <div className="mobile-nav-link" onClick={openEstimator} style={{ cursor: 'pointer' }}>
                  <Calculator style={{ width: '18px', height: '18px', color: '#ea580c' }} />
                  <span>Material Calculator</span>
                </div>
                <Link to="/interior-designers" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                  <UserCheck style={{ width: '18px', height: '18px', color: '#ea580c' }} />
                  <span>Interior Designers</span>
                </Link>
                <Link to="/builders" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                  <Building style={{ width: '18px', height: '18px', color: '#ea580c' }} />
                  <span>Verified Builders</span>
                </Link>
                <Link to="/guides" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                  <BookOpen style={{ width: '18px', height: '18px', color: '#ea580c' }} />
                  <span>Buying Guides & Blogs</span>
                </Link>
                <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileDrawerOpen(false)}>
                  <span>🏷️ Seller Portal & Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
