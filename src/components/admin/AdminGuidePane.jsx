import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function AdminGuidePane({
  guides,
  onAddGuide,
  onEditGuide,
  onDeleteGuide
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Buying Guides & Blogs</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddGuide}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Guide Post
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => {
              return (
                <tr key={g.id || g._id}>
                  <td>
                    {g.imageSrc?.startsWith('<svg') ? (
                      <div style={{ width: '50px', height: '35px', overflow: 'hidden', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: g.imageSrc }} />
                    ) : (
                      <img src={g.imageSrc} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} alt={g.title} />
                    )}
                  </td>
                  <td>
                    <strong>{g.title}</strong>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {g.id}</div>
                  </td>
                  <td>{g.date}</td>
                  <td>
                    <div className="admin-actions-cell">
                      <button
                        className="btn-icon-action edit"
                        title="Edit Guide"
                        onClick={() => onEditGuide(g)}
                      >
                        <Edit3 style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button className="btn-icon-action delete" title="Delete Guide" onClick={() => onDeleteGuide(g.id)}>
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
