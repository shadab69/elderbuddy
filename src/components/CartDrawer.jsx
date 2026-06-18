import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { getCleanImage } from '../utils/imageHelper.js';

export default function CartDrawer() {
  const { cart, products, updateCartQuantity, removeFromCart, clearCart } = useContext(AppContext);
  const navigate = useNavigate();

  const closeCartDrawer = () => {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Compute pricing
  let subtotal = 0;
  cart.forEach((item) => {
    const prod = products.find((p) => p.id === item.product.id);
    if (prod) {
      subtotal += prod.price * item.quantity;
    }
  });

  const gst = subtotal * 0.18; // 18% GST standard
  const total = subtotal + gst;

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="cart-drawer-overlay" 
        id="cart-overlay"
        onClick={closeCartDrawer}
      ></div>
      <aside class="cart-drawer" id="cart-drawer">
        <div className="cart-drawer-header">
          <h3>Shopping Cart ({totalItems})</h3>
          <button 
            type="button"
            className="btn-close-drawer" 
            onClick={closeCartDrawer}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        <div className="cart-drawer-body" id="cart-drawer-items">
          {cart.length === 0 ? (
            <div className="empty-cart-msg" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🧺</span>
              <p>Your shopping cart is empty.</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={() => { closeCartDrawer(); navigate('/products'); }}
                style={{ marginTop: '15px' }}
              >
                Shop Materials
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const prod = products.find((p) => p.id === item.product.id) || item.product;
              const itemSubtotal = prod.price * item.quantity;
              
              // Handle image renderer (which can be HTML raw string from backend, or a simple path)
              const renderProductImage = () => {
                const { isSvg, src } = getCleanImage(prod.imageSrc);
                if (isSvg) {
                  return <div dangerouslySetInnerHTML={{ __html: src }} className="cart-item-img-raw" />;
                }
                return <img src={src} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
              };

              return (
                <div key={item.product.id} className="cart-item" style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
                  <div className="cart-item-img" style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '4px', flexShrink: 0 }}>
                    {renderProductImage()}
                  </div>
                  <div className="cart-item-details" style={{ flex: 1 }}>
                    <h4 className="cart-item-name" style={{ fontSize: '0.9rem', margin: '0 0 5px 0' }}>{prod.name}</h4>
                    <span className="cart-item-price-unit" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ₹{prod.price.toLocaleString('en-IN')} / {prod.unit}
                    </span>
                    <div className="cart-item-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div className="cart-qty-ctrl">
                        <button 
                          type="button"
                          className="btn-qty-dec" 
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        >-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          type="button"
                          className="btn-qty-inc" 
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <span className="cart-item-subtotal" style={{ fontWeight: '600' }}>
                        ₹{itemSubtotal.toLocaleString('en-IN')}
                      </span>
                      <button 
                        type="button"
                        className="btn-remove-item" 
                        onClick={() => removeFromCart(item.product.id)}
                        style={{ color: 'var(--accent-red)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span className="cart-subtotal-val">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row gst-row">
              <span>GST (Estimated 18%)</span>
              <span>₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row total-row">
              <span>Total (Incl. Taxes)</span>
              <span className="cart-total-val">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-actions-btn-group">
              <button 
                type="button"
                className="btn-checkout" 
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </button>
              <button 
                type="button"
                className="btn-clear-cart-all" 
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
