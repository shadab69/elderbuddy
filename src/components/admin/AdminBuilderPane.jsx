import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function AdminBuilderPane({
  builders,
  onAddBuilder,
  onEditBuilder,
  onDeleteBuilder
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Builders Portfolio Management</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddBuilder}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Builder
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Builder</th>
              <th>Firm</th>
              <th>Experience</th>
              <th>Rating</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {builders.map((b) => (
              <tr key={b.id || b._id}>
                <td>
                  <div className="admin-prod-cell">
                    <div
                      className="designer-avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '1rem',
                        flexShrink: 0,
                        background: b.avatarBg || 'var(--primary-light)',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700
                      }}
                    >
                      {b.avatarImg ? (
                        <img src={b.avatarImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={b.name} />
                      ) : (
                        b.avatarText || b.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong>{b.name}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {b.id}</div>
                    </div>
                  </div>
                </td>
                <td>{b.firm}</td>
                <td>{b.experience}</td>
                <td>
                  <strong>{b.rating}</strong> ({b.reviewsCount} reviews)
                </td>
                <td>{b.projects ? b.projects.length : 0} projects</td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="btn-icon-action edit"
                      title="Edit Builder"
                      onClick={() => onEditBuilder(b)}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button className="btn-icon-action delete" title="Delete Builder" onClick={() => onDeleteBuilder(b.id)}>
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
