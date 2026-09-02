import React, { useState } from 'react';
import { Driver } from '../types';
import { createDriverApi } from '../services/api';
import { UserCheck, X, Plus } from 'lucide-react';
import { Language, translations } from '../translations';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDriver: (driver: Driver) => void;
  lang?: Language;
}

export const AddDriverModal: React.FC<AddDriverModalProps> = ({
  isOpen,
  onClose,
  onAddDriver,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];

  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [safetyScore, setSafetyScore] = useState(92);
  const [routeComplianceScore, setRouteComplianceScore] = useState(95);
  const [drivingEfficiencyScore, setDrivingEfficiencyScore] = useState(88);
  const [reliabilityScore, setReliabilityScore] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !licenseNumber.trim()) {
      setError('Please provide Driver Name and License Number');
      return;
    }

    setLoading(true);
    setError(null);

    const overallTrustScore = Number(
      ((safetyScore + routeComplianceScore + reliabilityScore + drivingEfficiencyScore) / 4).toFixed(1)
    );

    const driverPayload: Partial<Driver> = {
      name,
      licenseNumber,
      phone: phone || '+91 98000 00000',
      status: 'AVAILABLE',
      safetyScore,
      routeComplianceScore,
      drivingEfficiencyScore,
      reliabilityScore,
      overallTrustScore,
      tripsCompleted: 0,
      totalViolations: 0
    };

    try {
      const created = await createDriverApi(driverPayload);
      onAddDriver(created);
      setName('');
      setLicenseNumber('');
      setPhone('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', padding: '24px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', background: 'var(--bg-card)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <UserCheck size={24} color="var(--accent-blue)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register New Fleet Driver</h3>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Driver Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Singh"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>License Number *</label>
              <input
                type="text"
                placeholder="e.g. DL-1420230098765"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Contact Phone Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
            />
          </div>

          {/* Metric Initial Scores */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Initial Baseline Safety Ratings</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  <span>Safety Compliance Score</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>{safetyScore}%</span>
                </label>
                <input type="range" min="50" max="100" value={safetyScore} onChange={e => setSafetyScore(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  <span>Route Compliance Score</span>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>{routeComplianceScore}%</span>
                </label>
                <input type="range" min="50" max="100" value={routeComplianceScore} onChange={e => setRouteComplianceScore(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  <span>Driving Efficiency Score</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{drivingEfficiencyScore}%</span>
                </label>
                <input type="range" min="50" max="100" value={drivingEfficiencyScore} onChange={e => setDrivingEfficiencyScore(Number(e.target.value))} style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  <span>Reliability Score</span>
                  <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{reliabilityScore}%</span>
                </label>
                <input type="range" min="50" max="100" value={reliabilityScore} onChange={e => setReliabilityScore(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Plus size={16} /> {loading ? 'Registering...' : 'Register Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
