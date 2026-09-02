import React, { useState } from 'react';
import { Truck, Device } from '../types';
import { sendHardwareCommandApi } from '../services/api';
import { Cpu, Volume2, Lightbulb, Monitor } from 'lucide-react';
import { Language, translations } from '../translations';

interface FleetManagementPageProps {
  trucks: Truck[];
  devices: Device[];
  lang?: Language;
}

export const FleetManagementPage: React.FC<FleetManagementPageProps> = ({ trucks, devices, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(trucks[0] || null);
  const [cmdFeedback, setCmdFeedback] = useState<string | null>(null);

  const handleDispatchCmd = async (commandType: string, parameter: string = 'ACTIVE') => {
    if (!selectedTruck) return;
    setCmdFeedback(`Dispatching ${commandType} to Device ${selectedTruck.deviceId}...`);
    try {
      await sendHardwareCommandApi({
        deviceId: selectedTruck.deviceId,
        truckId: selectedTruck.truckId,
        commandType,
        parameter
      });
      setCmdFeedback(`✓ Command ${commandType} dispatched over MQTT!`);
      setTimeout(() => setCmdFeedback(null), 3000);
    } catch (err) {
      setCmdFeedback(`❌ Error sending command`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.fleetManagementTitle}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t.fleetManagementSubtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Fleet Table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{t.tabFleet}</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{t.registration}</th>
                  <th>{t.deviceId}</th>
                  <th>{t.firmwareVersion}</th>
                  <th>{t.status}</th>
                  <th>{t.batteryVoltage}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map(tr => {
                  const dev = devices.find(d => d.deviceId === tr.deviceId);
                  return (
                    <tr key={tr.truckId} style={{ background: selectedTruck?.truckId === tr.truckId ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{tr.registrationNumber}</td>
                      <td>{tr.deviceId}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{dev?.firmwareVersion || 'v2.1.0-ESP32'}</td>
                      <td>
                        <span className={`badge ${dev?.connectionStatus === 'ONLINE' ? 'badge-safe' : 'badge-danger'}`}>
                          {dev?.connectionStatus || 'ONLINE'}
                        </span>
                      </td>
                      <td>{dev?.batteryVoltage || 5.0} V</td>
                      <td>
                        <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setSelectedTruck(tr)}>
                          Control Hardware
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hardware Command Channel Dispatcher */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <Cpu size={20} color="#60a5fa" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Hardware Command Dispatcher</h3>
          </div>

          {selectedTruck ? (
            <div>
              <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
                <div><b>Target Truck:</b> {selectedTruck.registrationNumber}</div>
                <div style={{ color: 'var(--text-secondary)' }}><b>Device ID:</b> {selectedTruck.deviceId}</div>
              </div>

              {cmdFeedback && (
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '16px', color: '#60a5fa' }}>
                  {cmdFeedback}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-secondary" onClick={() => handleDispatchCmd('BUZZER_ON', 'REMOTE_ALARM')}>
                  <Volume2 size={16} color="#ef4444" /> Trigger Buzzer Alarm (BUZZER_ON)
                </button>
                <button className="btn-secondary" onClick={() => handleDispatchCmd('BUZZER_OFF', 'SILENCE')}>
                  <Volume2 size={16} color="#10b981" /> Silence Buzzer (BUZZER_OFF)
                </button>
                <button className="btn-secondary" onClick={() => handleDispatchCmd('LED_RED', 'ON')}>
                  <Lightbulb size={16} color="#ef4444" /> Set Status LED RED
                </button>
                <button className="btn-secondary" onClick={() => handleDispatchCmd('LED_GREEN', 'ON')}>
                  <Lightbulb size={16} color="#10b981" /> Set Status LED GREEN
                </button>
                <button className="btn-secondary" onClick={() => handleDispatchCmd('LCD_ALERT', 'ALERT: CHECK LOAD')}>
                  <Monitor size={16} color="#f59e0b" /> Display LCD Alert Message
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select a truck to dispatch hardware commands over MQTT.</div>
          )}
        </div>
      </div>
    </div>
  );
};
