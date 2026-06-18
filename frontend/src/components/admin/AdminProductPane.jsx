import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { getCleanImage } from '../../utils/imageHelper.js';

export default function AdminProductPane({
  products,
  categories,
  units,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Product Inventory Management</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddProduct}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Product
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Material Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const { isSvg, src } = getCleanImage(p.imageSrc, 'assets/logo.png');
              return (
                <tr key={p.id}>
                  <td>
                    <div className="admin-prod-cell">
                      <div className="admin-prod-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSvg ? (
                          <span dangerouslySetInnerHTML={{ __html: src }} />
                        ) : (
                          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                        )}
                      </div>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                <td>{p.brand}</td>
                <td>
                  <strong>₹{p.price}</strong> / {p.unit}
                </td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="btn-icon-action edit"
                      title="Edit Product"
                      onClick={() => onEditProduct(p)}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      className="btn-icon-action delete"
                      title="Delete Product"
                      onClick={() => onDeleteProduct(p.id)}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </>
  );
}
