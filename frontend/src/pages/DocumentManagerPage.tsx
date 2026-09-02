import React, { useState } from 'react';
import { VehicleDocument, UserRole, Truck } from '../types';
import { FileText, UploadCloud, Trash2, Eye, ShieldCheck, Lock } from 'lucide-react';
import { Language, translations } from '../translations';
import { UploadDocumentModal } from '../components/UploadDocumentModal';

interface DocumentManagerPageProps {
  documents: VehicleDocument[];
  trucks?: Truck[];
  currentRole?: UserRole;
  onUploadDocument?: (doc: VehicleDocument) => void;
  onDeleteDocument?: (docId: string) => void;
  onVerifyDocument?: (docId: string) => void;
  lang?: Language;
}

export const DocumentManagerPage: React.FC<DocumentManagerPageProps> = ({
  documents,
  trucks = [],
  currentRole = 'OWNER',
  onUploadDocument,
  onDeleteDocument,
  onVerifyDocument,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<VehicleDocument | null>(null);

  // RBAC Permission Checks
  const canUploadAndEdit = currentRole === 'ADMIN' || currentRole === 'OWNER';
  const canVerify = currentRole === 'ADMIN' || currentRole === 'OWNER' || currentRole === 'LOGISTICS_MANAGER' || currentRole === 'WAREHOUSE_USER';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.documentsTitle}</h2>
            <span className={`badge ${canUploadAndEdit ? 'badge-info' : 'badge-safe'}`} style={{ fontSize: '0.65rem' }}>
              ROLE: {currentRole}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {canUploadAndEdit
              ? 'Full Owner/Admin Legal Vault: Upload, Edit, Renew & Manage Vehicle Compliance'
              : canVerify
              ? 'Logistics Verification View: Review Vehicle Compliance before Freight Dispatch'
              : 'Driver Digital License & RC Wallet: Roadside Inspection View'}
          </p>
        </div>

        {canUploadAndEdit ? (
          <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UploadCloud size={18} /> Upload New Document
          </button>
        ) : (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <Lock size={14} /> Upload Privileges Reserved for Owner & Admin
          </div>
        )}
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
                <th>Compliance Status</th>
                <th style={{ textAlign: 'right' }}>Role Actions</th>
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
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{doc.documentNumber}</td>
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="View Digital Copy"
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye size={14} /> View
                        </button>

                        {canVerify && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}
                            title="Verify Compliance"
                            onClick={() => {
                              if (onVerifyDocument) onVerifyDocument(doc.ID);
                            }}
                          >
                            <ShieldCheck size={14} /> Verify
                          </button>
                        )}

                        {canUploadAndEdit && (
                          <button
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            title="Delete Document (Owner/Admin)"
                            onClick={() => {
                              if (onDeleteDocument) onDeleteDocument(doc.ID);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2200, background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '24px', position: 'relative', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Digital Document Viewer</h3>
              </div>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Document Category</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>{viewingDoc.documentType}</div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Document Number</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'monospace', marginBottom: '12px' }}>{viewingDoc.documentNumber}</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Truck</div>
                  <div style={{ fontWeight: 600 }}>{viewingDoc.truckId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expiry Date</div>
                  <div style={{ fontWeight: 600 }}>{viewingDoc.expiryDate}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setViewingDoc(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {canUploadAndEdit && (
        <UploadDocumentModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadDocument={(newDoc) => {
            if (onUploadDocument) onUploadDocument(newDoc);
          }}
          trucks={trucks}
          lang={lang}
        />
      )}
    </div>
  );
};
