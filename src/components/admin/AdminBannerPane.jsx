import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function AdminBannerPane({
  banners,
  onAddBanner,
  onEditBanner,
  onDeleteBanner
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Manage Carousel Banners</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddBanner}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Banner
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Banner Image URL/Path</th>
              <th>Link (URL/Hash)</th>
              <th>Fitting Style</th>
              <th>Bg Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id}>
                <td>
                  <div
                    style={{
                      width: '120px',
                      height: '42px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      position: 'relative',
                      background: b.bgColor || 'var(--bg-surface-alt)'
                    }}
                  >
                    {b.styleType === 'dual' ? (
                      <>
                        <div style={{ backgroundImage: `url('${b.imageSrc}')`, top: '-10%', left: '-10%', width: '120%', height: '120%', filter: 'blur(4px)', opacity: 0.45, position: 'absolute', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div style={{ backgroundImage: `url('${b.imageSrc}')`, backgroundSize: 'contain', backgroundPosition: `center ${b.position || 'center'}`, backgroundRepeat: 'no-repeat', width: '100%', height: '100%', position: 'absolute', zIndex: 2 }}></div>
                      </>
                    ) : b.styleType === 'contain' ? (
                      <div style={{ backgroundImage: `url('${b.imageSrc}')`, backgroundSize: 'contain', backgroundPosition: `center ${b.position || 'center'}`, backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}></div>
                    ) : b.styleType === 'stretch' ? (
                      <div style={{ backgroundImage: `url('${b.imageSrc}')`, backgroundSize: '100% 100%', width: '100%', height: '100%' }}></div>
                    ) : (
                      <div style={{ backgroundImage: `url('${b.imageSrc}')`, backgroundSize: 'cover', backgroundPosition: `center ${b.position || 'center'}`, width: '100%', height: '100%' }}></div>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  <code>{b.imageSrc}</code>
                </td>
                <td style={{ fontSize: '0.8rem' }}>
                  <code>{b.link}</code>
                </td>
                <td>
                  <span className={`badge ${b.styleType === 'dual' ? 'badge-primary' : b.styleType === 'contain' ? 'badge-info' : b.styleType === 'stretch' ? 'badge-warning' : 'badge-success'}`}>
                    {b.styleType === 'dual' ? 'Dual-Layer' : b.styleType === 'contain' ? 'Fit Inside' : b.styleType === 'stretch' ? 'Stretch' : 'Full Cover'}
                  </span>
                </td>
                <td>
                  <code style={{ fontSize: '0.75rem' }}>{b.bgColor || '#ffffff'}</code>
                </td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="btn-icon-action edit"
                      title="Edit Banner"
                      onClick={() => onEditBanner(b)}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button className="btn-icon-action delete" title="Delete Banner" onClick={() => onDeleteBanner(b.id)}>
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
