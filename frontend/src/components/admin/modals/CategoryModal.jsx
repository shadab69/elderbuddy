import React from 'react';
import { X } from 'lucide-react';

export default function CategoryModal({
  categoryModal,
  setCategoryModal,
  onSubmit
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>{categoryModal.editId ? 'Edit Product Category' : 'Add Product Category'}</h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={() => setCategoryModal({ open: false, editId: null, data: {} })}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label>Category Name</label>
              <input
                type="text"
                required
                value={categoryModal.data.name || ''}
                placeholder="e.g. Tiles & Flooring"
                onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, name: e.target.value } })}
              />
            </div>
            
            <div className="input-group">
              <label>Lucide Icon Name</label>
              <input
                type="text"
                value={categoryModal.data.icon || 'boxes'}
                placeholder="e.g. wrench, bath, boxes"
                onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, icon: e.target.value } })}
              />
            </div>

            <div className="input-group">
              <label>Category Description (Optional)</label>
              <textarea
                rows="3"
                value={categoryModal.data.desc || ''}
                placeholder="Brief description of the category..."
                onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, desc: e.target.value } })}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setCategoryModal({ open: false, editId: null, data: {} })}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
