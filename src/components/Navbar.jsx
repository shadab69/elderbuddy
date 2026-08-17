import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ChevronDown, ChevronRight, Search, ShoppingCart, Sun, Moon, Tag } from 'lucide-react';
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

export default function Navbar() {
  const { categories = [], cart = [], theme, setTheme } = useContext(AppContext);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const catMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCatId) {
      setActiveCatId(categories[0].id);
    }
  }, [categories, activeCatId]);

  const currentActiveCat = categories.find((c) => c?.id === activeCatId) || categories[0] || null;

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
    const modal = document.getElementById('calc-modal-overlay');
    if (modal) modal.classList.add('active');
  };

  return (
    <header className="app-header-light">
      {/* Main Top Header Row */}
      <div className="container main-header-row">
        {/* Elder-o-Buddy Logo */}
        <Link to="/" className="logo-area-bm" style={{ textDecoration: 'none' }}>
          <span className="logo-orange">Elder</span> <span className="logo-blk">-O-</span> <span className="logo-dark">Buddy</span>
          <sup className="logo-tm">®</sup>
        </Link>
        
        {/* Shop by Categories Hover Dropdown & Horizontal Mega Menu */}
        <div 
          ref={catMenuRef} 
          className="category-select-bm" 
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
            {/* Top Accent Gradient Bar */}
            <div className="mega-top-gradient-bar"></div>

            {/* Header inside Mega Menu */}
            <div className="mega-menu-top-header">
              <div className="mega-menu-title-area">
                <span className="mega-badge">Explore Store</span>
                <h3 className="mega-main-heading">All Product Categories & Building Materials</h3>
              </div>
              <Link to="/products" className="mega-quick-all-link" onClick={() => setCatMenuOpen(false)}>
                Browse Full Catalog →
              </Link>
            </div>

            {/* Categories & Subcategories Grid */}
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
                      <span className="horizontal-cat-count">{cat.subcategories?.length || 0} Subcategories</span>
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

            {/* Bottom Promo Footer inside Menu */}
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
        <form className="search-form-bm" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search entire store here..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required 
            autoComplete="off"
          />
          <button type="submit" className="btn-search-bm">
            <Search style={{ width: '18px', height: '18px' }} />
          </button>
        </form>

        {/* Price Check, Dark Mode, and Seller Portal Buttons */}
        <div className="header-action-buttons-bm" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/admin" className="btn-price-check" style={{ textDecoration: 'none' }}>
            <span className="check-box-icon">✓</span> Price Check
          </Link>

          {/* Premium Theme Switcher */}
          <button 
            type="button" 
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-color)',
              transition: 'all 0.2s'
            }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon style={{ width: '18px', height: '18px' }} /> : <Sun style={{ width: '18px', height: '18px', color: '#f59e0b' }} />}
          </button>

          <button 
            type="button" 
            className="btn-become-seller"
            onClick={() => navigate('/admin')}
          >
            Become a Seller
          </button>
        </div>

        {/* Cart Trigger */}
        <div className="cart-trigger-bm" onClick={openCartDrawer} style={{ cursor: 'pointer' }}>
          <ShoppingCart className="cart-icon" style={{ width: '20px', height: '20px' }} />
          <span>Cart</span>
          <span className="cart-badge-bm">{totalItems}</span>
        </div>
      </div>

      {/* Middle Menu Row */}
      <nav className="middle-menu-nav">
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

      {/* Delivery Alert Bar */}
      <div className="delivery-bar-bm">
        <div className="container delivery-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>🚚 We deliver across Pan India only</span>
        </div>
      </div>

      {/* Quick Jump Links Row */}
      <div className="quick-links-bar">
        <div className="container quick-links-container">
          <span className="quick-label">Go Quickly To :</span>
          <div className="quick-tags">
            <Link to="/products?category=cement" className="quick-tag-link">Cement</Link>
            <span className="divider">,</span>
            <Link to="/products?category=steel" className="quick-tag-link">TMT Steels</Link>
            <span className="divider">,</span>
            <Link to="/products?category=bricks" className="quick-tag-link">Bricks & Blocks</Link>
            <span className="divider">,</span>
            <Link to="/products?category=paints" className="quick-tag-link">Paints</Link>
            <span className="divider">,</span>
            <Link to="/products?category=plumbing" className="quick-tag-link">Plumbing</Link>
            <span className="divider">,</span>
            <Link to="/products?category=tiles" className="quick-tag-link">Tiles</Link>
            <span className="divider">,</span>
            <Link to="/products?category=electrical" className="quick-tag-link">Lighting & Fixtures</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
