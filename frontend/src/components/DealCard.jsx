import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getCleanImage } from '../utils/imageHelper.js';

export default function DealCard({ product, addToCart }) {
  const p = product;
  const originalPriceHtml = p.originalPrice ? (
    <div className="orig-price-crossed">
      M.R.P.: <del>Rs.{p.originalPrice.toLocaleString('en-IN')}</del>
    </div>
  ) : null;
  
  const discountBadgeHtml = p.discountLabel ? (
    <div className="discount-badge-bm">{p.discountLabel}</div>
  ) : null;

  const { isSvg, src } = getCleanImage(p.imageSrc);

  return (
    <div className="deal-card-bm" style={{ flexShrink: 0 }}>
      <Link to={`/product/${p.id}`} className="deal-card-img-wrapper">
        {isSvg ? (
          <div dangerouslySetInnerHTML={{ __html: src }} className="raw-svg-wrapper" />
        ) : (
          <img src={src} alt={p.name} />
        )}
      </Link>
      <div className="deal-card-body">
        <Link to={`/product/${p.id}`} style={{ textDecoration: 'none' }}>
          <h4 className="deal-card-title">{p.name}</h4>
        </Link>
        <div className="deal-price-row">
          {originalPriceHtml}
          <div className="sale-price-row">
            <span className="sale-label">Price: </span>
            <span className="sale-val">Rs.{p.price.toLocaleString('en-IN')}</span>
            <span className="price-unit">per {p.unit}</span>
          </div>
          {discountBadgeHtml}
        </div>
        <div className="deal-card-vendor">by {p.brand}</div>
      </div>
      <div className="deal-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <label className="compare-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <input type="checkbox" className="compare-check" />
          <span>Add To Compare</span>
        </label>

        <button 
          type="button" 
          className="btn-card-add" 
          onClick={() => addToCart(p, 1)}
          style={{ width: '28px', height: '28px', borderRadius: '4px', display: 'flex', alignItems: 'center', justify: 'center', border: '1px solid var(--border-color)' }}
        >
          <ShoppingCart style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    </div>
  );
}
