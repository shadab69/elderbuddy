import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function AdminUnitPane({
  units,
  onAddUnit,
  onDeleteUnit
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Manage Measurement Units</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddUnit}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Unit
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Unit ID</th>
              <th>Unit Name / Label</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td>
                  <code>{u.id}</code>
                </td>
                <td>
                  <strong>{u.name}</strong>
                </td>
                <td>
                  <button className="btn-icon-action delete" title="Delete Unit" onClick={() => onDeleteUnit(u.id)}>
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
