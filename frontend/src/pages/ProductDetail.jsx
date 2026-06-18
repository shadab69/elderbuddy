import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { getCleanImage } from '../utils/imageHelper.js';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart } = useContext(AppContext);
  const [quantity, setQuantity] = useState(1);

  const prod = products.find((p) => p.id === id);

  if (!prod) {
    return (
      <div className="container text-center" style={{ padding: '100px 0' }}>
        <h2>Material Not Found</h2>
        <p>The product code you requested does not exist or has been removed.</p>
        <Link to="/products" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
          Go Back to Materials
        </Link>
      </div>
    );
  }

  // Related products
  const related = products
    .filter((p) => p.category === prod.category && p.id !== prod.id)
    .slice(0, 3);

  const fullStars = Math.floor(prod.rating || 5);
  const halfStar = (prod.rating || 5) % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const handleAddToCart = () => {
    addToCart(prod, quantity);
    
    // Open Cart Drawer
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  };

  const renderProductImage = (item) => {
    const { isSvg, src } = getCleanImage(item.imageSrc);
    if (isSvg) {
      return <div dangerouslySetInnerHTML={{ __html: src }} className="detail-raw-svg" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
    }
    return <img className="product-detail-img" src={src} alt={item.name} style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }} />;
  };


  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Breadcrumbs */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> &gt;{' '}
        <Link to={`/products?category=${prod.category}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {prod.category.toUpperCase()}
        </Link>{' '}
        &gt; <span>{prod.name}</span>
      </div>

      {/* Detail Grid */}
      <div className="product-detail-layout">
        <div className="product-detail-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface-alt)', borderRadius: '6px', padding: '20px', border: '1px solid var(--border-color)' }}>
          {renderProductImage(prod)}
        </div>

        <div className="product-detail-info">
          <span className="detail-brand-badge">{prod.brand}</span>
          <h2 className="detail-title">{prod.name}</h2>

          <div className="detail-meta-row" style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: 'var(--text-muted)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="rating-stars" style={{ display: 'flex', color: 'var(--secondary)' }}>
                {[...Array(fullStars)].map((_, i) => <Star key={i} style={{ width: '14px', height: '14px', fill: 'currentColor', stroke: 'none' }} />)}
                {halfStar === 1 && <StarHalf style={{ width: '14px', height: '14px', fill: 'currentColor', stroke: 'none' }} />}
                {[...Array(emptyStars)].map((_, i) => <Star key={i} style={{ width: '14px', height: '14px', fill: 'none', stroke: 'var(--slate-300)' }} />)}
              </span>
              <span>
                <strong>{prod.rating}</strong> ({prod.ratingCount} reviews)
              </span>
            </div>
            <span>|</span>
            <span>Product ID: <strong>{prod.id}</strong></span>
            <span>|</span>
            <span className="badge badge-success">In Stock</span>
          </div>

          <div className="detail-price-box" style={{ margin: '20px 0' }}>
            <span className="detail-price-main">₹{prod.price.toLocaleString('en-IN')}</span>
            <span className="detail-price-unit" style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
              per {prod.unit}
            </span>
          </div>

          <p className="detail-desc" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{prod.description}</p>

          {/* Add to Cart Actions */}
          <div className="detail-buying-actions" style={{ display: 'flex', gap: '15px', margin: '30px 0', alignItems: 'center' }}>
            <div className="detail-qty-picker" style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '4px', height: '48px', overflow: 'hidden' }}>
              <button 
                type="button" 
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                style={{ width: '40px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
              >-</button>
              <input 
                type="number" 
                value={quantity} 
                readOnly
                style={{ width: '50px', border: 'none', textAlign: 'center', fontSize: '1rem', fontWeight: '600', background: 'transparent' }}
              />
              <button 
                type="button" 
                onClick={() => setQuantity((q) => q + 1)}
                style={{ width: '40px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem' }}
              >+</button>
            </div>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleAddToCart}
              style={{ flex: 1, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingCart style={{ width: '18px', height: '18px' }} />
              <span>Add to Shopping Cart</span>
            </button>
          </div>

          {/* Tech Specs */}
          {prod.specs && Object.keys(prod.specs).length > 0 && (
            <div className="product-specs-section">
              <h4>Material Specifications</h4>
              <table className="specs-table">
                <tbody>
                  {Object.entries(prod.specs).map(([lbl, val]) => (
                    <tr key={lbl}>
                      <td className="specs-label" style={{ fontWeight: '600', padding: '10px 15px', borderBottom: '1px solid var(--border-color)', width: '35%' }}>{lbl}</td>
                      <td className="specs-val" style={{ padding: '10px 15px', borderBottom: '1px solid var(--border-color)' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="home-section" style={{ marginTop: '60px' }}>
          <div className="section-header">
            <h2>Related Materials</h2>
          </div>
          <div className="products-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
