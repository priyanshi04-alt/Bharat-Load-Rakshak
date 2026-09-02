import React, { useState } from 'react';
import { Trip, Truck, Driver } from '../types';
import { Navigation, X, Plus } from 'lucide-react';
import { Language, translations } from '../translations';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (trip: Trip) => void;
  trucks: Truck[];
  drivers: Driver[];
  lang?: Language;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onCreateTrip,
  trucks,
  drivers,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];

  const [truckId, setTruckId] = useState(trucks[0]?.truckId || 'BLR-TRK-001');
  const [driverId, setDriverId] = useState(drivers[0]?.driverId || 'DRV-101');
  const [origin, setOrigin] = useState('Delhi ICD Tughlakabad');
  const [destination, setDestination] = useState('Mumbai Port Trust');
  const [cargoId, setCargoId] = useState('CRG-8899');
  const [cargoType, setCargoType] = useState('HIGH_VALUE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError('Please provide origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const now = new Date();
      const eta = new Date(now.getTime() + 18 * 3600 * 1000); // 18 hours ETA

      const selectedDrv = drivers.find(d => d.driverId === driverId);

      const newTrip: Trip = {
        tripId: `TRIP-${Date.now().toString().slice(-4)}`,
        truckId,
        driverId: selectedDrv ? selectedDrv.name : driverId,
        cargoId: cargoId || `CRG-${Math.floor(1000 + Math.random() * 9000)}`,
        origin,
        destination,
        startTime: now.toISOString(),
        eta: eta.toISOString(),
        status: 'IN_TRANSIT',
        routeToleranceKm: 5.0
      };

      onCreateTrip(newTrip);
      setOrigin('Delhi ICD Tughlakabad');
      setDestination('Mumbai Port Trust');
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
          <Navigation size={24} color="var(--accent-blue)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dispatch & Start New Trip</h3>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>FLEET MANAGEMENT PRIVILEGE</span>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Select Vehicle Truck *</label>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Assign Driver *</label>
              <select value={driverId} onChange={e => setDriverId(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                {drivers.length > 0 ? (
                  drivers.map(d => (
                    <option key={d.driverId} value={d.driverId}>{d.name} (Score: {d.overallTrustScore})</option>
                  ))
                ) : (
                  <>
                    <option value="DRV-101">Rajesh Kumar (Score: 94.2)</option>
                    <option value="DRV-102">Vikram Singh (Score: 86.5)</option>
                    <option value="DRV-103">Amit Sharma (Score: 78.0)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Origin / Start Location *</label>
              <input
                type="text"
                placeholder="e.g. Delhi NCR Depot"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Destination / Unloading Point *</label>
              <input
                type="text"
                placeholder="e.g. Mumbai JNPT Port"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                required
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Cargo Reference ID</label>
              <input
                type="text"
                placeholder="e.g. CRG-9021"
                value={cargoId}
                onChange={e => setCargoId(e.target.value)}
                style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Cargo Category</label>
              <select value={cargoType} onChange={e => setCargoType(e.target.value)} style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px' }}>
                <option value="HIGH_VALUE">High Value Electronics / Gems</option>
                <option value="GENERAL_FREIGHT">General Freight / FMCG</option>
                <option value="HAZARDOUS">Hazardous Chemical / Fuel</option>
                <option value="PERISHABLE">Perishable Cold Chain Food</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Plus size={16} /> {loading ? 'Dispatching...' : 'Dispatch Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
