import React from 'react';
import { X, Upload, Plus } from 'lucide-react';

export default function DesignerModal({
  designerModal,
  setDesignerModal,
  onSubmit,
  compressAndUpload,
  addDesignerProject,
  removeDesignerProject,
  updateDesignerProjectField,
  handleDesignerProjectPhotoUpload,
  removeDesignerProjectImage
}) {
  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3>{designerModal.editId ? 'Edit Designer Profile' : 'Add New Interior Designer'}</h3>
          <button type="button" className="btn-close-modal" onClick={() => setDesignerModal({ open: false, editId: null, data: {} })}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
            <div className="form-row">
              <div className="input-group">
                <label>Designer Name</label>
                <input
                  type="text"
                  value={designerModal.data.name || ''}
                  placeholder="e.g. Priya Nair"
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, name: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Firm / Studio Name</label>
                <input
                  type="text"
                  value={designerModal.data.firm || ''}
                  placeholder="e.g. GreenSpace Interiors"
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, firm: e.target.value } })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Experience</label>
                <input
                  type="text"
                  value={designerModal.data.experience || ''}
                  placeholder="e.g. 8+ Years"
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, experience: e.target.value } })}
                  required
                />
              </div>
              <div className="input-group">
                <label>Rating</label>
                <input
                  type="text"
                  value={designerModal.data.rating || '5.0'}
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, rating: e.target.value } })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="input-group">
                <label>Reviews Count</label>
                <input
                  type="number"
                  value={designerModal.data.reviewsCount}
                  min="0"
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, reviewsCount: parseInt(e.target.value || '0') } })}
                />
              </div>
              <div className="input-group">
                <label>Completed Projects</label>
                <input
                  type="number"
                  value={designerModal.data.completedProjects}
                  min="0"
                  onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, completedProjects: parseInt(e.target.value || '0') } })}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Specialties (Comma-separated)</label>
              <input
                type="text"
                value={designerModal.data.specialties || ''}
                placeholder="Contemporary Kitchens, Smart Storage, Modular Wardrobes"
                onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, specialties: e.target.value } })}
                required
              />
            </div>
            <div className="input-group">
              <label>Bio (Short summary for list card)</label>
              <textarea
                rows="2"
                value={designerModal.data.bio || ''}
                placeholder="Short bio..."
                onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, bio: e.target.value } })}
                required
              ></textarea>
            </div>
            <div className="input-group">
              <label>Full Bio (Detailed description for profile page)</label>
              <textarea
                rows="4"
                value={designerModal.data.fullBio || ''}
                placeholder="Full bio..."
                onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, fullBio: e.target.value } })}
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
                  {designerModal.data.avatarImg ? (
                    <img src={designerModal.data.avatarImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>No Photo</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    id="designer-avatar-file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await compressAndUpload(file, 200);
                        setDesignerModal({ ...designerModal, data: { ...designerModal.data, avatarImg: url } });
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => document.getElementById('designer-avatar-file').click()}
                    style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', height: 'auto', lineLength: 1, marginBottom: '5px' }}
                  >
                    <Upload style={{ width: '14px', height: '14px' }} /> Upload Profile Photo
                  </button>
                  <input
                    type="text"
                    placeholder="Or enter manual Photo URL / Path"
                    value={designerModal.data.avatarImg || ''}
                    onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, avatarImg: e.target.value } })}
                    style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: '12px' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem' }}>Fallback Initials (e.g. PN)</label>
                  <input
                    type="text"
                    placeholder="PN"
                    value={designerModal.data.avatarText || ''}
                    onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, avatarText: e.target.value } })}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem' }}>Fallback Background Gradient/Color</label>
                  <input
                    type="text"
                    value={designerModal.data.avatarBg || ''}
                    onChange={(e) => setDesignerModal({ ...designerModal, data: { ...designerModal.data, avatarBg: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Nested Projects Form */}
            <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '6px', background: 'var(--bg-surface-alt)', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.9rem' }}>Designer Projects Portfolio</strong>
                <button type="button" className="btn-secondary" onClick={addDesignerProject} style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', height: 'auto', lineLength: 1 }}>
                  <Plus style={{ width: '14px', height: '14px' }} /> Add Project
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {(!designerModal.data.projects || designerModal.data.projects.length === 0) ? (
                  <div style={{ padding: '15px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No projects added to portfolio yet. Click "Add Project" to begin.
                  </div>
                ) : (
                  designerModal.data.projects.map((proj, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'var(--bg-surface)', position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => removeDesignerProject(idx)}
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
                            onChange={(e) => updateDesignerProjectField(idx, 'title', e.target.value)}
                            placeholder="e.g. Modern Living Room"
                            required
                            style={{ fontSize: '0.8rem', padding: '6px 10px', width: '100%' }}
                          />
                        </div>
                        <div className="input-group">
                          <label style={{ fontSize: '0.75rem' }}>Location</label>
                          <input
                            type="text"
                            value={proj.location || ''}
                            onChange={(e) => updateDesignerProjectField(idx, 'location', e.target.value)}
                            placeholder="e.g. Mumbai"
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
                            onChange={(e) => updateDesignerProjectField(idx, 'year', e.target.value)}
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
                            onChange={(e) => updateDesignerProjectField(idx, 'desc', e.target.value)}
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
                                onClick={() => removeDesignerProjectImage(idx, imgIdx)}
                                style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(239,68,68,0.9)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px', padding: 0 }}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                          <div>
                            <input
                              type="file"
                              id={`designer-proj-photos-${idx}`}
                              accept="image/*"
                              multiple
                              style={{ display: 'none' }}
                              onChange={(e) => handleDesignerProjectPhotoUpload(idx, e.target.files)}
                            />
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => document.getElementById(`designer-proj-photos-${idx}`).click()}
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
            <button type="button" className="btn-cancel" onClick={() => setDesignerModal({ open: false, editId: null, data: {} })}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Designer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
