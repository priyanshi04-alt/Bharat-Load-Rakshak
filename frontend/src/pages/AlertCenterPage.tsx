import React, { useState } from 'react';
import { Alert } from '../types';
import { acknowledgeAlertApi, resolveAlertApi } from '../services/api';
import { Filter } from 'lucide-react';
import { Language, translations } from '../translations';

interface AlertCenterPageProps {
  alerts: Alert[];
  onRefresh: () => void;
  lang?: Language;
}

export const AlertCenterPage: React.FC<AlertCenterPageProps> = ({ alerts, onRefresh, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const handleAcknowledge = async (alertId: string) => {
    try {
      await acknowledgeAlertApi(alertId, 'Manager_Admin');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlertApi(alertId);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAlerts = severityFilter === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity === severityFilter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.alertEngineTitle}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t.alertEngineSubtitle}
          </p>
        </div>

        {/* Severity Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} color="var(--text-secondary)" />
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={{ background: 'transparent', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
            <option value="ALL" style={{ background: '#111827' }}>{t.allSeverities}</option>
            <option value="CRITICAL" style={{ background: '#111827' }}>{t.criticalOnly}</option>
            <option value="HIGH" style={{ background: '#111827' }}>{t.highOnly}</option>
            <option value="MEDIUM" style={{ background: '#111827' }}>{t.mediumOnly}</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t.severity}</th>
                <th>{t.alertType}</th>
                <th>{t.truckDriver}</th>
                <th>{t.message}</th>
                <th>{t.timestamp}</th>
                <th>{t.status}</th>
                <th>{t.resolutionAction}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    {t.noAlertsFound}
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr key={alert.ID}>
                    <td>
                      <span className={`badge ${alert.severity === 'CRITICAL' ? 'badge-danger' : alert.severity === 'HIGH' ? 'badge-warning' : 'badge-info'}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{alert.type}</td>
                    <td>{alert.truckId}</td>
                    <td style={{ maxWidth: '350px' }}>{alert.message}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(alert.timestamp).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${alert.status === 'OPEN' ? 'badge-danger' : alert.status === 'ACKNOWLEDGED' ? 'badge-warning' : 'badge-safe'}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      {alert.status === 'OPEN' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleAcknowledge(alert.ID)}>
                            {t.acknowledgeBtn}
                          </button>
                          <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleResolve(alert.ID)}>
                            {t.resolveBtn}
                          </button>
                        </div>
                      )}
                      {alert.status === 'ACKNOWLEDGED' && (
                        <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleResolve(alert.ID)}>
                          {t.resolveBtn}
                        </button>
                      )}
                      {alert.status === 'RESOLVED' && (
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>✓ Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
