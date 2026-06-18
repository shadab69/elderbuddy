import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { ChevronDown, Search, ShoppingCart, Sun, Moon } from 'lucide-react';
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
    'wrench': 'Wrench'
  };
  
  const componentName = nameMap[iconName.toLowerCase()] || 
    iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    
  const IconComponent = LucideIcons[componentName] || LucideIcons.Boxes;
  return <IconComponent style={{ width: '18px', height: '18px', strokeWidth: 2 }} />;
};

export default function Navbar() {
  const { categories, cart, theme, setTheme } = useContext(AppContext);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const catMenuRef = useRef(null);
  const navigate = useNavigate();

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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle Cart Drawer (Managed globally or via DOM class as styled in index.css)
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
        
        {/* Shop by Categories Button */}
        <div ref={catMenuRef} className="category-select-bm" style={{ position: 'relative' }}>
          <button 
            type="button"
            className="btn-category-bm" 
            onClick={() => setCatMenuOpen(!catMenuOpen)}
          >
            <span>Shop by Categories</span>
            <ChevronDown className={`chevron ${catMenuOpen ? 'rotate-180' : ''}`} style={{ width: '16px', height: '16px', marginLeft: '5px' }} />
          </button>
          
          <div className={`category-dropdown-bm ${catMenuOpen ? 'show' : ''}`}>
            {categories.map((cat) => (
              <Link 
                key={cat.id}
                to={`/products?category=${cat.id}`} 
                className="category-drop-item"
                onClick={() => setCatMenuOpen(false)}
              >
                <div className="category-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getCategoryIcon(cat.icon)}
                </div>
                <div className="category-content">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-desc">{cat.desc || ''}</span>
                </div>
              </Link>
            ))}
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
          <Link to="/" className="menu-link">Buying Guide</Link>
          <Link to="/products" className="menu-link">Best Selling</Link>
          <span className="menu-link" onClick={openEstimator} style={{ cursor: 'pointer' }}>Material Calculator</span>
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
            <Link to="/products?category=paints" className="quick-tag-link">Paints</Link>
            <span className="divider">,</span>
            <Link to="/products?category=plumbing" className="quick-tag-link">Plumbing</Link>
            <span className="divider">,</span>
            <Link to="/products?category=tiles" className="quick-tag-link">Tiles</Link>
            <span className="divider">,</span>
            <Link to="/products?category=electrical" className="quick-tag-link">Lighting & Fixtures</Link>
            <span className="divider">,</span>
            <Link to="/interior-designers" className="quick-tag-link">Interior Designers</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
