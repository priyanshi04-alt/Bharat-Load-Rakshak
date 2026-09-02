import React, { useState } from 'react';
import { sendSimulatedTelemetry } from '../services/api';
import { Cpu, AlertTriangle, Wind, CloudRain, Zap, Volume2, Radio, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../translations';

interface HardwareTestBenchPageProps {
  onRefresh: () => void;
  lang?: Language;
}

export const HardwareTestBenchPage: React.FC<HardwareTestBenchPageProps> = ({ onRefresh, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];

  // Current Active Testbench State
  const [truckId, setTruckId] = useState('BLR-TRK-001');
  const [deviceId] = useState('BLR-DEV-001');
  const [weightKg, setWeightKg] = useState(8450);
  const [humidityPercent, setHumidityPercent] = useState(58);
  const [rainDetected, setRainDetected] = useState(false);
  const [gasValue, setGasValue] = useState(110);
  const [alcoholValue, setAlcoholValue] = useState(0);
  const [latitude] = useState(28.6139);
  const [longitude] = useState(77.2090);
  const [speedKmph, setSpeedKmph] = useState(60);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived Circuit Hardware State for Visual Simulation Widget
  const isOverload = weightKg > 10000;
  const isAlcoholAlert = alcoholValue > 150;
  const isGasAlert = gasValue > 300;
  const isBuzzerActive = isOverload || isAlcoholAlert || isGasAlert;

  let currentStatus = "NORMAL";
  if (isOverload) currentStatus = "OVERLOAD";
  else if (isAlcoholAlert) currentStatus = "ALCOHOL ALERT";
  else if (isGasAlert) currentStatus = "GAS LEAK";
  else if (rainDetected) currentStatus = "WATER INGRESS";

  const handleTransmit = async (overrides: any = {}) => {
    setLoading(true);
    setFeedback(null);

    const newWeight = overrides.weightKg !== undefined ? overrides.weightKg : Number(weightKg);
    const newHumidity = overrides.humidityPercent !== undefined ? overrides.humidityPercent : Number(humidityPercent);
    const newRain = overrides.rainDetected !== undefined ? overrides.rainDetected : rainDetected;
    const newGas = overrides.gasValue !== undefined ? overrides.gasValue : Number(gasValue);
    const newAlcohol = overrides.alcoholValue !== undefined ? overrides.alcoholValue : Number(alcoholValue);
    const newSpeed = overrides.speedKmph !== undefined ? overrides.speedKmph : Number(speedKmph);

    // Update local simulated state immediately
    setWeightKg(newWeight);
    setHumidityPercent(newHumidity);
    setRainDetected(newRain);
    setGasValue(newGas);
    setAlcoholValue(newAlcohol);
    setSpeedKmph(newSpeed);

    const payload = {
      deviceId,
      truckId,
      timestamp: new Date().toISOString(),
      weightKg: newWeight,
      humidityPercent: newHumidity,
      rainDetected: newRain,
      gasValue: newGas,
      alcoholValue: newAlcohol,
      latitude: overrides.latitude !== undefined ? overrides.latitude : Number(latitude),
      longitude: overrides.longitude !== undefined ? overrides.longitude : Number(longitude),
      speedKmph: newSpeed,
      isDemoData: false
    };

    try {
      const res = await sendSimulatedTelemetry(payload);
      setFeedback(`✓ Telemetry Transmitted to Backend! Alerts Generated: ${res.data?.alertsGenerated || 0}`);
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.testbenchTitle}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t.testbenchSubtitle}
        </p>
      </div>

      {/* HARDWARE CIRCUIT & OLED DISPLAY WIDGET (IN-PLACE REALTIME FEEDBACK) */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={20} color="#60a5fa" className="pulse-dot-active" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.circuitScreenTitle}</h3>
          </div>
          <span className="badge badge-info">MCU: ESP32-WROOM-32</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'center' }}>
          {/* Simulated 16x2 OLED LCD Screen */}
          <div style={{ background: '#020617', border: '3px solid #1e293b', borderRadius: '12px', padding: '16px', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8), 0 4px 20px rgba(59, 130, 246, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>16x2 I2C LCD DISPLAY (0x27)</span>
              <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 600 }}>● POWER ON</span>
            </div>
            
            {/* Screen Line 1 */}
            <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '8px 12px', borderRadius: '6px', fontFamily: 'Courier New, monospace', fontSize: '1rem', fontWeight: 700, color: isBuzzerActive ? '#ef4444' : '#38bdf8', letterSpacing: '1px', textShadow: '0 0 8px rgba(56, 189, 248, 0.5)', marginBottom: '6px' }}>
              Line 1: {isBuzzerActive ? `! ${currentStatus} !` : "BHARAT LOAD v2.1"}
            </div>
            {/* Screen Line 2 */}
            <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '8px 12px', borderRadius: '6px', fontFamily: 'Courier New, monospace', fontSize: '0.9rem', fontWeight: 700, color: '#facc15', letterSpacing: '1px', textShadow: '0 0 8px rgba(250, 204, 21, 0.5)' }}>
              Line 2: W:{weightKg}kg H:{humidityPercent}% G:{gasValue} A:{alcoholValue}
            </div>
          </div>

          {/* LED Signal Lights & Buzzer Status */}
          <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.physicalHardwareSignals}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: isBuzzerActive ? '#ef4444' : '#334155', boxShadow: isBuzzerActive ? '0 0 12px #ef4444' : 'none' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isBuzzerActive ? '#f87171' : 'var(--text-secondary)' }}>{t.redAlertLed}</span>
              </div>
              <span className={`badge ${isBuzzerActive ? 'badge-danger' : 'badge-safe'}`}>{isBuzzerActive ? 'ON 🔴' : 'OFF'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: (!isBuzzerActive && currentStatus === 'NORMAL') ? '#10b981' : '#334155', boxShadow: (!isBuzzerActive && currentStatus === 'NORMAL') ? '0 0 12px #10b981' : 'none' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: (!isBuzzerActive && currentStatus === 'NORMAL') ? '#34d399' : 'var(--text-secondary)' }}>{t.greenSafeLed}</span>
              </div>
              <span className={`badge ${(!isBuzzerActive && currentStatus === 'NORMAL') ? 'badge-safe' : 'badge-info'}`}>{(!isBuzzerActive && currentStatus === 'NORMAL') ? 'ON 🟢' : 'OFF'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Volume2 size={16} color={isBuzzerActive ? '#ef4444' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isBuzzerActive ? '#f87171' : 'var(--text-secondary)' }}>{t.activeBuzzer}</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isBuzzerActive ? '#f87171' : 'var(--text-muted)' }}>
                {isBuzzerActive ? `🔊 ${t.alarmActiveText}` : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INJECTORS & CUSTOM FORM */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Quick Trigger Preset Buttons */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Zap size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>One-Click Hardware Event Presets</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={() => handleTransmit({ weightKg: 12500, alcoholValue: 0, rainDetected: false, gasValue: 110 })}
              disabled={loading}
            >
              <AlertTriangle size={20} color="#f87171" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#f87171' }}>{t.injectOverload}</div>
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
                <div style={{ fontWeight: 700, color: '#f87171' }}>{t.injectAlcohol}</div>
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
                <div style={{ fontWeight: 700, color: '#fbbf24' }}>{t.injectGas}</div>
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
                <div style={{ fontWeight: 700, color: '#60a5fa' }}>{t.injectRain}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sets rainDetected = true and Humidity = 92%. Triggers WATER_INGRESS Alert.</div>
              </div>
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              onClick={() => handleTransmit({ weightKg: 8450, alcoholValue: 0, rainDetected: false, gasValue: 110, humidityPercent: 58 })}
              disabled={loading}
            >
              <CheckCircle2 size={20} color="#34d399" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#34d399' }}>{t.resetNormal}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Returns all sensor values to safe baseline levels.</div>
              </div>
            </button>
          </div>
        </div>

        {/* Manual Input Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Cpu size={22} color="#3b82f6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.customPayloadTitle}</h3>
          </div>

          {feedback && (
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '16px', color: '#60a5fa' }}>
              {feedback}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Truck ID</label>
              <input type="text" value={truckId} onChange={e => setTruckId(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.currentWeight}</label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MQ135 Gas Reading</label>
              <input type="number" value={gasValue} onChange={e => setGasValue(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MQ3 Alcohol Reading</label>
              <input type="number" value={alcoholValue} onChange={e => setAlcoholValue(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Humidity (%)</label>
              <input type="number" value={humidityPercent} onChange={e => setHumidityPercent(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.currentSpeed}</label>
              <input type="number" value={speedKmph} onChange={e => setSpeedKmph(Number(e.target.value))} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px' }} />
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleTransmit()} disabled={loading}>
            {t.transmitTelemetryBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardwareTestBenchPage;
