import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { Home, Layers, Sparkles, Building, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav({ onOpenCategories }) {
  const { cart = [] } = useContext(AppContext);
  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const openCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  };

  const triggerAIAssistant = () => {
    const btn = document.querySelector('.agentic-floating-launcher');
    if (btn) btn.click();
  };

  return (
    <nav className="mobile-bottom-nav-bar" aria-label="Mobile Navigation">
      <NavLink to="/" className={({ isActive }) => 'mobile-nav-item ' + (isActive ? 'active' : '')}>
        <Home className="mobile-nav-icon" />
        <span>Home</span>
      </NavLink>

      <button type="button" className="mobile-nav-item" onClick={onOpenCategories}>
        <Layers className="mobile-nav-icon" />
        <span>Categories</span>
      </button>

      <button type="button" className="mobile-nav-item ai-highlight-nav" onClick={triggerAIAssistant}>
        <div className="mobile-ai-circle">
          <Sparkles className="mobile-nav-icon" />
        </div>
        <span>AI Copilot</span>
      </button>

      <NavLink to="/build-your-home" className={({ isActive }) => 'mobile-nav-item ' + (isActive ? 'active' : '')}>
        <Building className="mobile-nav-icon" />
        <span>Build Home</span>
      </NavLink>

      <button type="button" className="mobile-nav-item" onClick={openCartDrawer}>
        <div style={{ position: 'relative' }}>
          <ShoppingBag className="mobile-nav-icon" />
          {totalItems > 0 && <span className="mobile-cart-badge">{totalItems}</span>}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}
