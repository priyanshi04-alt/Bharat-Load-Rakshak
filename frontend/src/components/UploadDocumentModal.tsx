import React, { useState } from 'react';
import { VehicleDocument } from '../types';
import { UploadCloud, FileText, X, CheckCircle } from 'lucide-react';
import { Language, translations } from '../translations';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadDocument: (doc: VehicleDocument) => void;
  trucks: { truckId: string; registrationNumber: string }[];
  lang?: Language;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadDocument,
  trucks,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];

  const [truckId, setTruckId] = useState(trucks[0]?.truckId || 'BLR-TRK-001');
  const [documentType, setDocumentType] = useState<'RC' | 'INSURANCE' | 'PUC' | 'FITNESS' | 'PERMIT' | 'DRIVER_LICENSE'>('INSURANCE');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const calculateStatus = (expiry: string): 'VALID' | 'WARNING_30' | 'WARNING_15' | 'WARNING_7' | 'EXPIRED' => {
    const exp = new Date(expiry).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((exp - now) / (1000 * 3600 * 24));

    if (diffDays <= 0) return 'EXPIRED';
    if (diffDays <= 7) return 'WARNING_7';
    if (diffDays <= 15) return 'WARNING_15';
    if (diffDays <= 30) return 'WARNING_30';
    return 'VALID';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber.trim()) {
      setError('Please enter document number');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const newDoc: VehicleDocument = {
        ID: `DOC-${Date.now().toString().slice(-4)}`,
        truckId,
        documentType,
        documentNumber,
        expiryDate,
        status: calculateStatus(expiryDate)
      };

      onUploadDocument(newDoc);
      setDocumentNumber('');
      setSelectedFile(null);
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '24px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', background: 'var(--bg-card)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <UploadCloud size={24} color="var(--accent-blue)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Upload Vehicle Document</h3>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>ADMIN & OWNER PRIVILEGE</span>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Select Truck *</label>
              <select value={truckId} onChange={e => setTruckId(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                {trucks.length > 0 ? (
                  trucks.map(t => (
                    <option key={t.truckId} value={t.truckId}>{t.registrationNumber} ({t.truckId})</option>
                  ))
                ) : (
                  <>
                    <option value="BLR-TRK-001">HR-55-AB-1234 (BLR-TRK-001)</option>
                    <option value="BLR-TRK-002">DL-01-EA-9988 (BLR-TRK-002)</option>
                    <option value="BLR-TRK-003">UP-14-BT-5544 (BLR-TRK-003)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Document Category *</label>
              <select value={documentType} onChange={e => setDocumentType(e.target.value as any)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                <option value="RC">Vehicle Registration (RC)</option>
                <option value="INSURANCE">Commercial Vehicle Insurance</option>
                <option value="PUC">Pollution Certificate (PUC)</option>
                <option value="FITNESS">Vehicle Fitness Certificate</option>
                <option value="PERMIT">National Goods Transport Permit</option>
                <option value="DRIVER_LICENSE">Driver Commercial License</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Document Reference No. *</label>
              <input
                type="text"
                placeholder="e.g. INS-9988776655"
                value={documentNumber}
                onChange={e => setDocumentNumber(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Document Expiry Date *</label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* File Upload Zone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Attach Scanned Copy (PDF / PNG / JPG)</label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '20px', borderRadius: '8px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }} onClick={() => document.getElementById('doc-file-input')?.click()}>
              <FileText size={28} color="var(--accent-blue)" style={{ margin: '0 auto 8px' }} />
              {selectedFile ? (
                <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Click to Upload or Drag & Drop File</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Supports PDF, JPG, PNG up to 10MB</div>
                </>
              )}
              <input id="doc-file-input" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <UploadCloud size={16} /> {loading ? 'Saving...' : 'Save & Register Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
