import React from 'react';
import { X, Upload } from 'lucide-react';
import { getCleanImage } from '../../../utils/imageHelper.js';

export default function ProductModal({
  categories,
  units,
  productModal,
  setProductModal,
  onSubmit,
  compressAndUpload
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h3>{productModal.editId ? 'Edit Product Material' : 'Add New Construction Material'}</h3>
          <button type="button" className="btn-close-modal" onClick={() => setProductModal({ open: false, editId: null, data: {} })}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="input-group">
              <label>Product / Material Name</label>
              <input
                type="text"
                value={productModal.data.name || ''}
                placeholder="e.g. UltraTech PPC Super Cement"
                onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, name: e.target.value } })}
                required
              />
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={productModal.data.brand || ''}
                  placeholder="e.g. UltraTech"
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, brand: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select
                  value={productModal.data.category || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, category: e.target.value } })}
                  required
                >
                  <option value="" disabled>-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Price (INR)</label>
                <input
                  type="number"
                  value={productModal.data.price || ''}
                  placeholder="420"
                  min="1"
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Unit of Measure</label>
                <select
                  value={productModal.data.unit || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, unit: e.target.value } })}
                >
                  <option value="" disabled>-- Select Unit --</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Detailed Description</label>
              <textarea
                rows="3"
                value={productModal.data.description || ''}
                placeholder="Explain technical benefits, standard ratings, cement grade, compression test results..."
                onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, description: e.target.value } })}
                required
              ></textarea>
            </div>
            <div className="input-group" style={{ marginTop: '12px' }}>
              <label>Product Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-surface-alt)',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {(() => {
                    if (!productModal.data.imageSrc) {
                      return <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No Image</span>;
                    }
                    const { isSvg, src } = getCleanImage(productModal.data.imageSrc);
                    if (isSvg) {
                      return <span dangerouslySetInnerHTML={{ __html: src }} />;
                    }
                    return <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />;
                  })()}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    id="prod-image-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await compressAndUpload(file, 400);
                        setProductModal({ ...productModal, data: { ...productModal.data, imageSrc: url } });
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => document.getElementById('prod-image-file').click()}
                    style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', height: 'auto', lineLength: 1 }}
                  >
                    <Upload style={{ width: '14px', height: '14px' }} /> Upload Image
                  </button>
                </div>
              </div>
              <label htmlFor="prod-image-url" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Or enter Image URL / Local Path manually
              </label>
              <input
                type="text"
                id="prod-image-url"
                placeholder="assets/my_product.png or https://example.com/image.jpg"
                value={productModal.data.imageSrc || ''}
                onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, imageSrc: e.target.value } })}
              />
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'var(--bg-surface-alt)', marginTop: '15px' }}>
              <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>Specifications (Specs Table)</strong>
              <div className="form-row">
                <div className="input-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem' }}>Spec 1: Grade/Class</label>
                  <input
                    type="text"
                    value={productModal.data.specGrade || ''}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, specGrade: e.target.value } })}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem' }}>Spec 2: Standard/Size</label>
                  <input
                    type="text"
                    value={productModal.data.specSize || ''}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, specSize: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={() => setProductModal({ open: false, editId: null, data: {} })}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
