import React from 'react';
import { X } from 'lucide-react';

export default function GuideModal({
  guideModal,
  setGuideModal,
  onSubmit
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3>{guideModal.editId ? 'Edit Buying Guide' : 'Add New Buying Guide / Blog'}</h3>
          <button type="button" className="btn-close-modal" onClick={() => setGuideModal({ open: false, editId: null, data: {} })}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label>Guide Title</label>
              <input
                type="text"
                value={guideModal.data.title || ''}
                placeholder="e.g. The Latest Trends in Sustainable Building Materials"
                onChange={(e) => setGuideModal({ ...guideModal, data: { ...guideModal.data, title: e.target.value } })}
                required
              />
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Date (YYYY-MM-DD HH:MM:SS)</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-06-17 11:28:40"
                  value={guideModal.data.date || ''}
                  onChange={(e) => setGuideModal({ ...guideModal, data: { ...guideModal.data, date: e.target.value } })}
                />
              </div>
              <div className="input-group">
                <label>Cover Image URL / SVG Code</label>
                <input
                  type="text"
                  placeholder="e.g. assets/guide_trends.png"
                  value={guideModal.data.imageSrc || ''}
                  onChange={(e) => setGuideModal({ ...guideModal, data: { ...guideModal.data, imageSrc: e.target.value } })}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Blog Content (Markdown Formatted)</label>
              <textarea
                rows="10"
                placeholder="# Blog Heading&#10;&#10;Use standard markdown here..."
                value={guideModal.data.content || ''}
                onChange={(e) => setGuideModal({ ...guideModal, data: { ...guideModal.data, content: e.target.value } })}
                required
                style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5' }}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={() => setGuideModal({ open: false, editId: null, data: {} })}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Guide Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
