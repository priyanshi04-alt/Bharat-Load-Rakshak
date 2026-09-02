import React, { useState } from 'react';
import { Telemetry, Truck } from '../types';
import { LiveFleetMap } from '../components/LiveFleetMap';
import { Gauge, MapPin, Radio } from 'lucide-react';
import { Language, translations } from '../translations';

interface LiveTrackingPageProps {
  telemetry: Telemetry[];
  trucks: Truck[];
  lang?: Language;
}

export const LiveTrackingPage: React.FC<LiveTrackingPageProps> = ({ telemetry, trucks, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];
  const [selectedTruckId, setSelectedTruckId] = useState<string>(trucks[0]?.truckId || 'BLR-TRK-001');

  const selectedTruck = trucks.find(tr => tr.truckId === selectedTruckId);
  const truckTelemetry = telemetry.filter(tr => tr.truckId === selectedTruckId);
  const latestTelemetry = truckTelemetry[0] || telemetry[0];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.liveTrackingTitle}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.liveTrackingSubtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        <div>
          <LiveFleetMap
            telemetryList={telemetry}
            trucks={trucks}
            selectedTruckId={selectedTruckId}
            onSelectTruck={(id) => setSelectedTruckId(id)}
          />

          {/* Telemetry History Breadcrumbs Table */}
          <div className="glass-panel" style={{ marginTop: '20px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>{t.gpsBreadcrumbHistory}: {selectedTruck?.registrationNumber || selectedTruckId}</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>{t.timestamp}</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>{t.currentSpeed}</th>
                    <th>{t.currentWeight}</th>
                    <th>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {truckTelemetry.slice(0, 10).map((tel, idx) => (
                    <tr key={idx}>
                      <td style={{ color: 'var(--text-secondary)' }}>{new Date(tel.timestamp).toLocaleTimeString()}</td>
                      <td>{tel.latitude.toFixed(4)}° N</td>
                      <td>{tel.longitude.toFixed(4)}° E</td>
                      <td style={{ fontWeight: 600, color: tel.speedKmph > 80 ? '#f87171' : '#34d399' }}>{tel.speedKmph} km/h</td>
                      <td>{tel.weightKg} kg</td>
                      <td>
                        <span className="badge badge-safe">{t.valid}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Gauges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>{t.selectTruck}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {trucks.map(tr => (
                <button
                  key={tr.truckId}
                  onClick={() => setSelectedTruckId(tr.truckId)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: selectedTruckId === tr.truckId ? '1px solid #3b82f6' : '1px solid var(--border-color)',
                    background: selectedTruckId === tr.truckId ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                    color: selectedTruckId === tr.truckId ? '#60a5fa' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{tr.registrationNumber}</span>
                  <span className={`badge ${tr.currentStatus === 'ALERT' ? 'badge-danger' : 'badge-safe'}`} style={{ fontSize: '0.6rem' }}>
                    {tr.currentStatus}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Truck Telemetry Details */}
          {latestTelemetry && (
            <div className="glass-panel" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>{t.liveVehicleReadings}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Gauge size={20} color="#3b82f6" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.currentSpeed}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{latestTelemetry.speedKmph} km/h</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={20} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.coordinates}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{latestTelemetry.latitude.toFixed(4)}°, {latestTelemetry.longitude.toFixed(4)}°</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Radio size={20} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.lastConnection}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{new Date(latestTelemetry.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
