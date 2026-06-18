import React from 'react';
import { X, Upload, Plus } from 'lucide-react';

export default function BuilderModal({
  builderModal,
  setBuilderModal,
  onSubmit,
  compressAndUpload,
  addBuilderProject,
  removeBuilderProject,
  updateBuilderProjectField,
  handleBuilderProjectPhotoUpload,
  removeBuilderProjectImage
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3>{builderModal.editId ? 'Edit Builder Profile' : 'Add New Builder'}</h3>
          <button type="button" className="btn-close-modal" onClick={() => setBuilderModal({ open: false, editId: null, data: {} })}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
            <div className="form-row">
              <div className="input-group">
                <label>Builder Name</label>
                <input
                  type="text"
                  value={builderModal.data.name || ''}
                  placeholder="e.g. Rajesh Kumar"
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, name: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Firm Name</label>
                <input
                  type="text"
                  value={builderModal.data.firm || ''}
                  placeholder="e.g. Kumar Construction Corp"
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, firm: e.target.value } })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Experience</label>
                <input
                  type="text"
                  value={builderModal.data.experience || ''}
                  placeholder="e.g. 15+ Years"
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, experience: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Rating</label>
                <input
                  type="text"
                  value={builderModal.data.rating || '5.0'}
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, rating: e.target.value } })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Reviews Count</label>
                <input
                  type="number"
                  value={builderModal.data.reviewsCount}
                  min="0"
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, reviewsCount: parseInt(e.target.value || '0') } })}
                />
              </div>
              <div className="input-group">
                <label>Completed Projects</label>
                <input
                  type="number"
                  value={builderModal.data.completedProjects}
                  min="0"
                  onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, completedProjects: parseInt(e.target.value || '0') } })}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Specialties (Comma-separated)</label>
              <input
                type="text"
                value={builderModal.data.specialties || ''}
                placeholder="Eco-Friendly Construction, High-Rise Residential, Steel Structures"
                onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, specialties: e.target.value } })}
                required
              />
            </div>
            <div className="input-group">
              <label>Bio (Short summary for list card)</label>
              <textarea
                rows="2"
                value={builderModal.data.bio || ''}
                placeholder="Short bio..."
                onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, bio: e.target.value } })}
                required
              ></textarea>
            </div>
            <div className="input-group">
              <label>Full Bio (Detailed description for profile page)</label>
              <textarea
                rows="4"
                value={builderModal.data.fullBio || ''}
                placeholder="Full bio..."
                onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, fullBio: e.target.value } })}
                required
              ></textarea>
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'var(--bg-surface-alt)', marginTop: '15px', marginBottom: '15px' }}>
              <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '10px' }}>Profile Picture / Avatar Settings</strong>
              <div className="form-row" style={{ alignItems: 'center', gap: '15px' }}>
                <div
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-surface-alt)',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {builderModal.data.avatarImg ? (
                    <img src={builderModal.data.avatarImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No Photo</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    id="builder-avatar-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await compressAndUpload(file, 200);
                        setBuilderModal({ ...builderModal, data: { ...builderModal.data, avatarImg: url } });
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => document.getElementById('builder-avatar-file').click()}
                    style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', height: 'auto', lineLength: 1, marginBottom: '5px' }}
                  >
                    <Upload style={{ width: '14px', height: '14px' }} /> Upload Profile Photo
                  </button>
                  <input
                    type="text"
                    placeholder="Or enter manual Photo URL / Path"
                    value={builderModal.data.avatarImg || ''}
                    onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, avatarImg: e.target.value } })}
                    style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '12px' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem' }}>Fallback Initials (e.g. RK)</label>
                  <input
                    type="text"
                    placeholder="RK"
                    value={builderModal.data.avatarText || ''}
                    onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, avatarText: e.target.value } })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem' }}>Fallback Background Gradient/Color</label>
                  <input
                    type="text"
                    value={builderModal.data.avatarBg || ''}
                    onChange={(e) => setBuilderModal({ ...builderModal, data: { ...builderModal.data, avatarBg: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Nested Projects Form */}
            <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '6px', background: 'var(--bg-surface-alt)', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.9rem' }}>Builder Projects Portfolio</strong>
                <button type="button" className="btn-secondary" onClick={addBuilderProject} style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', height: 'auto', lineLength: 1 }}>
                  <Plus style={{ width: '14px', height: '14px' }} /> Add Project
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {(!builderModal.data.projects || builderModal.data.projects.length === 0) ? (
                  <div style={{ padding: '15px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No projects added to portfolio yet. Click "Add Project" to begin.
                  </div>
                ) : (
                  builderModal.data.projects.map((proj, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => removeBuilderProject(idx)}
                        style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-red)', background: 'transparent', border: '1px solid var(--accent-red)', borderRadius: '4px', cursor: 'pointer', height: 'auto', lineLength: 1 }}
                      >
                        Delete Project
                      </button>
                      <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: 'var(--primary)' }}>Project #{idx + 1}</strong>
                      <div className="form-row">
                        <div className="input-group">
                          <label style={{ fontSize: '0.75rem' }}>Project Title</label>
                          <input
                            type="text"
                            value={proj.title || ''}
                            onChange={(e) => updateBuilderProjectField(idx, 'title', e.target.value)}
                            placeholder="e.g. Commercial Complex"
                            required
                            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                          />
                        </div>
                        <div className="input-group">
                          <label style={{ fontSize: '0.75rem' }}>Location</label>
                          <input
                            type="text"
                            value={proj.location || ''}
                            onChange={(e) => updateBuilderProjectField(idx, 'location', e.target.value)}
                            placeholder="e.g. Delhi"
                            required
                            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label style={{ fontSize: '0.75rem' }}>Year Completed</label>
                          <input
                            type="text"
                            value={proj.year || ''}
                            onChange={(e) => updateBuilderProjectField(idx, 'year', e.target.value)}
                            placeholder="e.g. 2025"
                            required
                            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                          />
                        </div>
                        <div className="input-group">
                          <label style={{ fontSize: '0.75rem' }}>Description</label>
                          <input
                            type="text"
                            value={proj.desc || ''}
                            onChange={(e) => updateBuilderProjectField(idx, 'desc', e.target.value)}
                            placeholder="Short project summary..."
                            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                          />
                        </div>
                      </div>
                      <div className="input-group" style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '0.75rem' }}>Project Photos</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          {(proj.images || []).map((img, imgIdx) => (
                            <div key={imgIdx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                              <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="slide" />
                              <button
                                type="button"
                                onClick={() => removeBuilderProjectImage(idx, imgIdx)}
                                style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(239,68,68,0.9)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', padding: 0 }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <div>
                            <input
                              type="file"
                              id={`builder-proj-photos-${idx}`}
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleBuilderProjectPhotoUpload(idx, e.target.files)}
                            />
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => document.getElementById(`builder-proj-photos-${idx}`).click()}
                              style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', height: 'auto', lineLength: 1 }}
                            >
                              Upload Photos
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={() => setBuilderModal({ open: false, editId: null, data: {} })}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Builder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
