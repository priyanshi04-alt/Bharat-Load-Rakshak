import React from 'react';
import { Telemetry, Truck } from '../types';
import { Weight, CloudRain, Wind, Droplets, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CargoMonitoringPageProps {
  telemetry: Telemetry[];
  trucks: Truck[];
}

export const CargoMonitoringPage: React.FC<CargoMonitoringPageProps> = ({ telemetry, trucks }) => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cargo Load & Container Environment Monitoring</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Real-time telemetry for HX711 Load Cell, MQ135 Air Quality/Gas Sensor, Rain Ingress, and Container Humidity
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {trucks.map(truck => {
          const latest = telemetry.find(t => t.truckId === truck.truckId) || telemetry[0];
          if (!latest) return null;

          const maxWeight = truck.maximumAllowedWeightKg;
          const currentWeight = latest.weightKg;
          const percentage = Math.min(100, Math.round((currentWeight / maxWeight) * 100));
          const isOverload = currentWeight > maxWeight;

          const gasSpike = latest.gasValue > 300;
          const rainDetected = latest.rainDetected;

          return (
            <div key={truck.truckId} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{truck.registrationNumber}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{truck.model}</div>
                </div>
                <span className={`badge ${isOverload ? 'badge-danger' : 'badge-safe'}`}>
                  {isOverload ? 'OVERLOAD DETECTED' : 'SAFE CAPACITY'}
                </span>
              </div>

              {/* Weight Load Bar Gauge */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 600 }}>
                  <span>Weight Load Gauge</span>
                  <span style={{ color: isOverload ? '#f87171' : '#34d399' }}>{currentWeight} / {maxWeight} kg ({percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: isOverload ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #10b981)', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Sensor Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* MQ135 Gas Sensor Card */}
                <div style={{ background: gasSpike ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.03)', border: gasSpike ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Wind size={16} color={gasSpike ? '#f87171' : '#60a5fa'} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MQ135 Gas Sensor</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: gasSpike ? '#f87171' : '#ffffff' }}>
                    {latest.gasValue} PPM
                  </div>
                  <div style={{ fontSize: '0.65rem', color: gasSpike ? '#f87171' : 'var(--text-muted)', marginTop: '4px' }}>
                    {gasSpike ? 'Abnormal Gas Concentration Detected — Inspection Required.' : 'Normal Air Quality'}
                  </div>
                </div>

                {/* Rain / Water Ingress Card */}
                <div style={{ background: rainDetected ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.03)', border: rainDetected ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <CloudRain size={16} color={rainDetected ? '#fbbf24' : '#34d399'} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rain / Water Ingress</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: rainDetected ? '#fbbf24' : '#34d399' }}>
                    {rainDetected ? 'DETECTED' : 'DRY SEAL'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {rainDetected ? 'Water Ingress Warning on Cover' : 'Container Tarpaulin Secure'}
                  </div>
                </div>

                {/* Humidity Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Droplets size={16} color="#06b6d4" />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Humidity Sensor</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {latest.humidityPercent}% RH
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
