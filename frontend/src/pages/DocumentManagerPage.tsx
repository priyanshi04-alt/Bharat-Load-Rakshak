import React from 'react';
import { VehicleDocument } from '../types';
import { FileText } from 'lucide-react';
import { Language, translations } from '../translations';

interface DocumentManagerPageProps {
  documents: VehicleDocument[];
  lang?: Language;
}

export const DocumentManagerPage: React.FC<DocumentManagerPageProps> = ({ documents, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.documentsTitle}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t.documentsSubtitle}
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t.docType}</th>
                <th>Truck ID</th>
                <th>{t.docNumber}</th>
                <th>{t.expiryDate}</th>
                <th>{t.status}</th>
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
                        {doc.status === 'EXPIRED' ? t.expired : doc.status.startsWith('WARNING') ? t.warning : t.valid}
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
