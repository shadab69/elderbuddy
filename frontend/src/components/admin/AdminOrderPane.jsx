import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrderPane({ orders }) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Customer Orders</h3>
      </div>

      {orders.length === 0 ? (
        <div className="no-results" style={{ padding: '40px 0' }}>
          <ShoppingBag style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }} />
          <h4>No customer orders received yet.</h4>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer & Location</th>
                <th>Materials Ordered</th>
                <th>Total Price</th>
                <th>Date Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id || o._id}>
                  <td>
                    <strong>#{o.id || o._id}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{o.customer?.name}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customer?.phone}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '200px', whiteSpace: 'nowrap' }}>
                      {o.customer?.address}, {o.customer?.city}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem' }}>
                      {o.items?.map((item, idx) => (
                        <div key={idx}>
                          • {item.name} <strong>(x{item.quantity})</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <strong>₹{o.total?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.date ? new Date(o.date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
