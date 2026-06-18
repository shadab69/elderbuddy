import React from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';

export default function AdminCategoryPane({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Manage Product Categories</h3>
        <button
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onAddCategory}
        >
          <PlusCircle style={{ width: '16px', height: '16px' }} /> Add Category
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Category Name</th>
              <th>Icon</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <code>{c.id}</code>
                </td>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>
                  <code>{c.icon || 'boxes'}</code>
                </td>
                <td>{c.desc || '-'}</td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="btn-icon-action edit"
                      title="Edit Category"
                      onClick={() => onEditCategory(c)}
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      className="btn-icon-action delete"
                      title="Delete Category"
                      onClick={() => onDeleteCategory(c.id)}
                    >
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
