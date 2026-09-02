import React from 'react';
import { VehicleDocument } from '../types';
import { FileText, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface DocumentManagerPageProps {
  documents: VehicleDocument[];
}

export const DocumentManagerPage: React.FC<DocumentManagerPageProps> = ({ documents }) => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Vehicle & Driver Compliance Documents</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Automated compliance monitor issuing warnings at 30-day, 15-day, 7-day, and expired thresholds
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Truck ID</th>
                <th>Document Number</th>
                <th>Expiration Date</th>
                <th>Compliance Status</th>
                <th>Action Required</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => {
                let badgeClass = 'badge-safe';
                if (doc.status === 'EXPIRED') badgeClass = 'badge-danger';
                if (doc.status === 'WARNING_7' || doc.status === 'WARNING_15') badgeClass = 'badge-warning';
                if (doc.status === 'WARNING_30') badgeClass = 'badge-info';

                return (
                  <tr key={doc.ID}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#60a5fa" />
                        <span>{doc.documentType}</span>
                      </div>
                    </td>
                    <td>{doc.truckId}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{doc.documentNumber}</td>
                    <td>{doc.expiryDate}</td>
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      {doc.status === 'EXPIRED' ? (
                        <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.8rem' }}>⚠️ RENEW IMMEDIATELY</span>
                      ) : doc.status.startsWith('WARNING') ? (
                        <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '0.8rem' }}>Renewal Pending</span>
                      ) : (
                        <span style={{ color: '#34d399', fontSize: '0.8rem' }}>✓ Compliant</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
