import React from 'react';
import { FileText } from 'lucide-react';

export default function AdminLeadPane({ leads }) {
  return (
    <>
      <div className="admin-pane-header">
        <h3>Construction Service Inquiries</h3>
      </div>

      {leads.length === 0 ? (
        <div className="no-results" style={{ padding: '40px 0' }}>
          <FileText style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }} />
          <h4>No custom service quote inquiries received.</h4>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Inquiry ID</th>
                <th>Service Requested</th>
                <th>Contact Info</th>
                <th>Project Details</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id || l._id}>
                  <td>
                    <strong>#{l.id || l._id}</strong>
                  </td>
                  <td>
                    <span className="badge badge-primary">{l.service}</span>
                  </td>
                  <td>
                    <strong>{l.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.phone}</span>
                    <br />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.email}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', maxWidth: '250px' }}>
                      <strong>Location:</strong> {l.location}
                      <br />
                      <strong>Details:</strong> {l.details}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.date ? new Date(l.date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
