import React from 'react';
import { X, Upload } from 'lucide-react';

export default function BannerModal({
  bannerModal,
  setBannerModal,
  onSubmit,
  compressAndUpload
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>{bannerModal.editId ? 'Edit Carousel Banner' : 'Add Carousel Banner'}</h3>
          <button type="button" className="btn-close-modal" onClick={() => setBannerModal({ open: false, editId: null, data: {} })}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label>Banner Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '120px',
                    height: '50px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bannerModal.data.bgColor || 'var(--bg-surface-alt)',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {bannerModal.data.imageSrc ? (
                    <img src={bannerModal.data.imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No Preview</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    id="banner-image-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await compressAndUpload(file, 800);
                        setBannerModal({ ...bannerModal, data: { ...bannerModal.data, imageSrc: url } });
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => document.getElementById('banner-image-file').click()}
                    style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', height: 'auto', lineLength: 1 }}
                  >
                    <Upload style={{ width: '14px', height: '14px' }} /> Upload Image
                  </button>
                </div>
              </div>
              <label htmlFor="banner-img-path" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                Or enter Banner Image URL / Local Path manually
              </label>
              <input
                type="text"
                id="banner-img-path"
                placeholder="assets/banner1.png or https://site.com/image.jpg"
                value={bannerModal.data.imageSrc || ''}
                onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, imageSrc: e.target.value } })}
                required
              />
            </div>
            <div className="input-group">
              <label>Click Redirect Link / Hash</label>
              <input
                type="text"
                value={bannerModal.data.link || ''}
                placeholder="#/products"
                onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, link: e.target.value } })}
              />
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Fitting Style</label>
                <select
                  value={bannerModal.data.styleType || 'cover'}
                  onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, styleType: e.target.value } })}
                >
                  <option value="cover">Full Cover (Scale & Crop)</option>
                  <option value="dual">Dual-Layer Blur Backdrop</option>
                  <option value="contain">Fit Inside (Letterbox)</option>
                  <option value="stretch">Stretch to Fill</option>
                </select>
              </div>
              <div className="input-group">
                <label>Vertical Position</label>
                <select
                  value={bannerModal.data.position || 'center'}
                  onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, position: e.target.value } })}
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Slide Background Color (Optional)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={bannerModal.data.bgColor || '#ffffff'}
                  style={{ width: '40px', height: '36px', padding: 0, borderRadius: '4px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, bgColor: e.target.value } })}
                />
                <input
                  type="text"
                  value={bannerModal.data.bgColor || '#ffffff'}
                  onChange={(e) => setBannerModal({ ...bannerModal, data: { ...bannerModal.data, bgColor: e.target.value } })}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={() => setBannerModal({ open: false, editId: null, data: {} })}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Banner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
