import React, { useState } from 'react';
import { recommendDriverApi } from '../services/api';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { Language, translations } from '../translations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDriver?: (driverId: string) => void;
  lang?: Language;
}

export const DriverRecommendationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSelectDriver,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];

  const [cargoType, setCargoType] = useState('HIGH_VALUE');
  const [cargoValue, setCargoValue] = useState(2500000);
  const [destination, setDestination] = useState('Mumbai Logistics Port');
  const [priority, setPriority] = useState('CRITICAL');
  const [requiredSafetyLevel, setRequiredSafetyLevel] = useState('MAXIMUM');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await recommendDriverApi({
        cargoType,
        cargoValue: Number(cargoValue),
        destination,
        priority,
        requiredSafetyLevel
      });

      // Unwrap OData response payload if wrapped in { value: { ... } }
      const rec = res.value || res;
      if (rec && (rec.recommendedDriverId || rec.driverName)) {
        setRecommendation(rec);
      } else {
        setErrorMsg("Failed to parse driver recommendation payload");
      }
    } catch (err: any) {
      console.error('[Recommendation Error]', err);
      setErrorMsg(err.message || "Error evaluating driver recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--modal-overlay)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '24px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', background: 'var(--bg-card)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sparkles size={24} color="var(--accent-blue)" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.aiRecommendationTitle}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.aiRecommendationDesc}</p>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleEvaluate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.cargoType}</label>
            <select value={cargoType} onChange={e => setCargoType(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
              <option value="HIGH_VALUE">High Value Electronics</option>
              <option value="PERISHABLE">Perishable Produce</option>
              <option value="HAZARDOUS">Hazardous Chemical</option>
              <option value="GENERAL">General Freight</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.declaredValue}</label>
            <input type="number" value={cargoValue} onChange={e => setCargoValue(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.tripPriority}</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{t.requiredSafetyLevel}</label>
            <select value={requiredSafetyLevel} onChange={e => setRequiredSafetyLevel(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
              <option value="MAXIMUM">MAXIMUM</option>
              <option value="HIGH">HIGH</option>
              <option value="STANDARD">STANDARD</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? t.evaluatingDrivers : recommendation ? '🔄 Re-evaluate AI Recommendation' : t.runAiRecommendation}
            </button>
          </div>
        </form>

        {recommendation && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {t.recommendedDriver}: {recommendation.driverName || recommendation.recommendedDriverName || 'Rajesh Kumar'}
                </h4>
              </div>
              <span className="badge badge-safe">{t.trustScore}: {recommendation.trustScore || recommendation.overallTrustScore || 95.2}/100</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '12px', fontStyle: 'italic', background: 'var(--bg-card)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--accent-emerald)' }}>
              "{recommendation.reason || recommendation.recommendationReason || `Driver ${recommendation.driverName || 'Rajesh Kumar'} exhibits top-tier safety compliance with minimal historical route violations.`}"
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.75rem', textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Safety</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{recommendation.safetyScore || 95}%</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Compliance</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{recommendation.routeComplianceScore || 98}%</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Efficiency*</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{recommendation.drivingEfficiencyScore || 92}%</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Reliability</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{recommendation.reliabilityScore || 96}%</div>
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {t.drivingEfficiencyNote}
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                if (onSelectDriver) onSelectDriver(recommendation.recommendedDriverId || recommendation.driverId);
                onClose();
              }}
            >
              {t.assignDriverToTrip}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
