import React from 'react';
import { Link } from 'react-router-dom';
import { Star, StarHalf, ShoppingCart } from 'lucide-react';
import { getCleanImage } from '../utils/imageHelper.js';

export default function ProductCard({ product, addToCart }) {
  const p = product;
  const fullStars = Math.floor(p.rating || 5);
  const halfStar = (p.rating || 5) % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const { isSvg, src } = getCleanImage(p.imageSrc);

  return (
    <article className="product-card">
      {p.price < 50 ? (
        <span className="badge badge-success product-card-badge">Best Price</span>
      ) : p.rating >= 4.8 ? (
        <span className="badge badge-primary product-card-badge">Top Rated</span>
      ) : null}
      <Link to={`/product/${p.id}`} className="product-card-img-wrapper">
        {isSvg ? (
          <div dangerouslySetInnerHTML={{ __html: src }} className="raw-svg-wrapper" />
        ) : (
          <img className="product-card-img" src={src} alt={p.name} />
        )}
      </Link>
      <div className="product-card-brand">{p.brand}</div>
      <Link to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
        <h3 className="product-card-title">{p.name}</h3>
      </Link>
      <div className="product-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span className="rating-stars" style={{ display: 'flex', color: 'var(--secondary)' }}>
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} style={{ width: '14px', height: '14px', fill: 'currentColor', stroke: 'none' }} />
          ))}
          {halfStar === 1 && <StarHalf style={{ width: '14px', height: '14px', fill: 'currentColor', stroke: 'none' }} />}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={i} style={{ width: '14px', height: '14px', fill: 'none', stroke: 'var(--slate-300)' }} />
          ))}
        </span>
        <span className="rating-count">({p.ratingCount || 10})</span>
      </div>
      <div className="product-card-bottom">
        <div className="product-card-price">
          <span className="price-val">₹{p.price.toLocaleString('en-IN')}</span>
          <span className="price-unit">per {p.unit}</span>
        </div>
        <button 
          type="button"
          className="btn-card-add" 
          onClick={() => addToCart(p, 1)}
          title="Add to Cart"
        >
          <ShoppingCart style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </article>
  );
}
