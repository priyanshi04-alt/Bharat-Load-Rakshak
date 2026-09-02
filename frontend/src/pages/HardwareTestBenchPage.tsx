import React, { useState } from 'react';
import { sendSimulatedTelemetry } from '../services/api';
import { Cpu, AlertTriangle, ShieldCheck, Wind, CloudRain, Navigation, Zap } from 'lucide-react';

interface HardwareTestBenchPageProps {
  onRefresh: () => void;
}

export const HardwareTestBenchPage: React.FC<HardwareTestBenchPageProps> = ({ onRefresh }) => {
  const [truckId, setTruckId] = useState('BLR-TRK-001');
  const [deviceId, setDeviceId] = useState('BLR-DEV-001');
  const [weightKg, setWeightKg] = useState(8450);
  const [humidityPercent, setHumidityPercent] = useState(60);
  const [rainDetected, setRainDetected] = useState(false);
  const [gasValue, setGasValue] = useState(110);
  const [alcoholValue, setAlcoholValue] = useState(0);
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [speedKmph, setSpeedKmph] = useState(60);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTransmit = async (overrides: any = {}) => {
    setLoading(true);
    setFeedback(null);

    const payload = {
      deviceId,
      truckId,
      timestamp: new Date().toISOString(),
      weightKg: overrides.weightKg !== undefined ? overrides.weightKg : Number(weightKg),
      humidityPercent: overrides.humidityPercent !== undefined ? overrides.humidityPercent : Number(humidityPercent),
      rainDetected: overrides.rainDetected !== undefined ? overrides.rainDetected : rainDetected,
      gasValue: overrides.gasValue !== undefined ? overrides.gasValue : Number(gasValue),
      alcoholValue: overrides.alcoholValue !== undefined ? overrides.alcoholValue : Number(alcoholValue),
      latitude: overrides.latitude !== undefined ? overrides.latitude : Number(latitude),
      longitude: overrides.longitude !== undefined ? overrides.longitude : Number(longitude),
      speedKmph: overrides.speedKmph !== undefined ? overrides.speedKmph : Number(speedKmph),
      isDemoData: false
    };

    try {
      const res = await sendSimulatedTelemetry(payload);
      setFeedback(`✓ Telemetry Ingested! Alerts Generated: ${res.data?.alertsGenerated || 0}`);
      onRefresh();
    } catch (err: any) {
      setFeedback(`❌ Ingestion Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>ESP32 Hardware Test Bench & Real-Time Pipeline Injector</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Simulate physical ESP32 sensor hardware readings to test the backend validation, alert engine, database persistence, and WebSocket updates
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Quick Trigger Preset Buttons */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Zap size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>One-Click Hardware Event Presets</h3>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Click any event preset to instantly publish simulated ESP32 hardware telemetry over the REST/MQTT pipeline:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={() => handleTransmit({ weightKg: 12500, alcoholValue: 0, rainDetected: false, gasValue: 110 })}
              disabled={loading}
            >
              <AlertTriangle size={20} color="#f87171" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#f87171' }}>Inject Weight Overload Event</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sets weight to 12,500 kg (Limit: 10,000 kg). Triggers OVERLOAD Alert & BUZZER_ON command.</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={() => handleTransmit({ alcoholValue: 380, weightKg: 8450, rainDetected: false, gasValue: 110 })}
              disabled={loading}
            >
              <AlertTriangle size={20} color="#f87171" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#f87171' }}>Inject Alcohol Threshold Event</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sets MQ3 sensor reading to 380. Message: "Alcohol sensor threshold exceeded — verification required."</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              onClick={() => handleTransmit({ gasValue: 480, weightKg: 8450, alcoholValue: 0, rainDetected: false })}
              disabled={loading}
            >
              <Wind size={20} color="#fbbf24" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#fbbf24' }}>Inject MQ135 Abnormal Gas Concentration</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sets MQ135 reading to 480 PPM. Message: "Abnormal Gas Concentration Detected — Inspection Required."</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}
              onClick={() => handleTransmit({ rainDetected: true, humidityPercent: 92, weightKg: 8450, alcoholValue: 0 })}
              disabled={loading}
            >
              <CloudRain size={20} color="#60a5fa" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#60a5fa' }}>Inject Rain / Water Ingress Event</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sets rainDetected = true and Humidity = 92%. Triggers WATER_INGRESS Alert.</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              onClick={() => handleTransmit({ weightKg: 8450, alcoholValue: 0, rainDetected: false, gasValue: 110, humidityPercent: 58 })}
              disabled={loading}
            >
              <ShieldCheck size={20} color="#34d399" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#34d399' }}>Reset Normal Telemetry Parameters</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Returns all sensor values to safe baseline levels.</div>
              </div>
            </button>
          </div>
        </div>

        {/* Manual Input Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Cpu size={22} color="#3b82f6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Custom Telemetry Payload Generator</h3>
          </div>

          {feedback && (
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '16px', color: '#60a5fa' }}>
              {feedback}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Truck ID</label>
              <input type="text" value={truckId} onChange={e => setTruckId(e.target.value)} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Weight (kg)</label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MQ135 Gas Reading</label>
              <input type="number" value={gasValue} onChange={e => setGasValue(Number(e.target.value))} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MQ3 Alcohol Reading</label>
              <input type="number" value={alcoholValue} onChange={e => setAlcoholValue(Number(e.target.value))} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Humidity (%)</label>
              <input type="number" value={humidityPercent} onChange={e => setHumidityPercent(Number(e.target.value))} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Speed (km/h)</label>
              <input type="number" value={speedKmph} onChange={e => setSpeedKmph(Number(e.target.value))} style={{ width: '100%', background: '#111827', border: '1px solid var(--border-color)', color: '#fff', padding: '8px', borderRadius: '6px' }} />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleTransmit()} disabled={loading}>
            Transmit Telemetry to Backend Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
