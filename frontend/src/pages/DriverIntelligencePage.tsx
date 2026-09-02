import React, { useState } from 'react';
import { Driver, UserRole } from '../types';
import { ShieldCheck, Navigation, Gauge, CheckCircle2, Sparkles, UserPlus, Trash2 } from 'lucide-react';
import { Language, translations } from '../translations';
import { AddDriverModal } from '../components/AddDriverModal';

interface DriverIntelligencePageProps {
  drivers: Driver[];
  onOpenModal: () => void;
  onAddDriver?: (driver: Driver) => void;
  onDeleteDriver?: (driverId: string) => void;
  currentRole?: UserRole;
  lang?: Language;
}

export const DriverIntelligencePage: React.FC<DriverIntelligencePageProps> = ({
  drivers,
  onOpenModal,
  onAddDriver,
  onDeleteDriver,
  currentRole = 'OWNER',
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const canAddDriver = currentRole === 'ADMIN' || currentRole === 'OWNER';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.tabDriver} & {t.trustScore} Center</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Transparent explainable scoring model evaluating safety, route compliance, driving efficiency, and delivery reliability
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canAddDriver && (
            <button className="btn-secondary" onClick={() => setIsAddDriverOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={18} color="var(--accent-blue)" /> Register New Driver
            </button>
          )}
          <button className="btn-primary" onClick={onOpenModal}>
            <Sparkles size={18} /> {t.aiDispatchWizard}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {drivers.map(driver => (
          <div key={driver.driverId} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{driver.name}</h3>
                  {canAddDriver && (
                    <button
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                      title="Remove Driver"
                      onClick={() => {
                        if (onDeleteDriver) onDeleteDriver(driver.driverId);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t.licenseNumber}: {driver.licenseNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#3b82f6' }}>{driver.overallTrustScore}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.trustScore}</div>
              </div>
            </div>

            {/* Score Breakdown Bar Gauges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {/* Safety Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="#10b981" /> {t.safetyScoreLabel}</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>{driver.safetyScore}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${driver.safetyScore}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>

              {/* Route Compliance Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={14} color="#3b82f6" /> {t.routeComplianceLabel}</span>
                  <span style={{ fontWeight: 700, color: '#60a5fa' }}>{driver.routeComplianceScore}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${driver.routeComplianceScore}%`, height: '100%', background: '#3b82f6' }} />
                </div>
              </div>

              {/* Driving Efficiency Score (Proxy) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Gauge size={14} color="#f59e0b" /> {t.drivingEfficiencyLabel}</span>
                  <span style={{ fontWeight: 700, color: '#fbbf24' }}>{driver.drivingEfficiencyScore}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${driver.drivingEfficiencyScore}%`, height: '100%', background: '#f59e0b' }} />
                </div>
              </div>

              {/* Reliability Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="#8b5cf6" /> {t.reliabilityLabel}</span>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>{driver.reliabilityScore}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${driver.reliabilityScore}%`, height: '100%', background: '#8b5cf6' }} />
                </div>
              </div>
            </div>

            {/* Note on Driving Efficiency Proxy */}
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              {t.drivingEfficiencyNote}
            </div>
          </div>
        ))}
      </div>

      {canAddDriver && (
        <AddDriverModal
          isOpen={isAddDriverOpen}
          onClose={() => setIsAddDriverOpen(false)}
          onAddDriver={(newDriver) => {
            if (onAddDriver) onAddDriver(newDriver);
          }}
          lang={lang}
        />
      )}
    </div>
  );
};
