import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function AdminDesignerPane({
  designers,
  onAddDesigner,
  onEditDesigner,
  onDeleteDesigner
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Interior Designers Management</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddDesigner}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Designer
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Designer</th>
              <th>Firm</th>
              <th>Experience</th>
              <th>Rating</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (
              <tr key={d.id || d._id}>
                <td>
                  <div className="admin-prod-cell">
                    <div
                      className="designer-avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '1rem',
                        flexShrink: 0,
                        background: d.avatarBg || 'var(--primary-light)',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700
                      }}
                    >
                      {d.avatarImg ? (
                        <img src={d.avatarImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={d.name} />
                      ) : (
                        d.avatarText || d.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <strong>{d.name}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {d.id}</div>
                    </div>
                  </div>
                </td>
                <td>{d.firm}</td>
                <td>{d.experience}</td>
                <td>
                  <strong>{d.rating}</strong> ({d.reviewsCount} reviews)
                </td>
                <td>{d.projects ? d.projects.length : 0} projects</td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="btn-icon-action edit"
                      title="Edit Designer"
                      onClick={() => onEditDesigner(d)}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button className="btn-icon-action delete" title="Delete Designer" onClick={() => onDeleteDesigner(d.id)}>
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
