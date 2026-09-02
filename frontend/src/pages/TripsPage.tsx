import React from 'react';
import { Trip, UserRole } from '../types';
import { MapPin } from 'lucide-react';
import { Language, translations } from '../translations';

interface TripsPageProps {
  trips: Trip[];
  currentRole: UserRole;
  lang?: Language;
}

export const TripsPage: React.FC<TripsPageProps> = ({ trips, currentRole, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.tripsTitle}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t.tripsSubtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {trips.map(trip => (
          <div key={trip.tripId} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trip #{trip.tripId}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cargo ID: {trip.cargoId}</div>
              </div>
              <span className={`badge ${trip.status === 'IN_TRANSIT' ? 'badge-info' : 'badge-safe'}`}>
                {trip.status === 'IN_TRANSIT' ? t.inTransit : trip.status === 'PLANNED' ? t.planned : t.completed}
              </span>
            </div>

            {/* Route Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#3b82f6" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.origin}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{trip.origin}</div>
                </div>
              </div>

              <div style={{ borderLeft: '2px dashed var(--border-highlight)', marginLeft: '8px', paddingLeft: '20px', margin: '-4px 0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Corridor (Tolerance: {trip.routeToleranceKm || 5} km)</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#10b981" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.destination}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{trip.destination}</div>
                </div>
              </div>
            </div>

            {/* Trip Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Truck Reg:</span>
                <div style={{ fontWeight: 700 }}>{trip.truckId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>{t.driver}:</span>
                <div style={{ fontWeight: 700 }}>{trip.driverId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Start Time:</span>
                <div>{new Date(trip.startTime).toLocaleTimeString()}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>{t.eta}:</span>
                <div style={{ color: '#60a5fa', fontWeight: 600 }}>{new Date(trip.eta).toLocaleString()}</div>
              </div>
            </div>

            {/* Role-Specific Visibility Notes */}
            <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              {currentRole === 'WAREHOUSE_USER' && '📦 Warehouse View: Cargo dispatch verified. Preparing receiving bay at destination.'}
              {currentRole === 'DRIVER' && '🚚 Driver View: Follow designated NH-48 corridor. Maintain speed within 80 km/h.'}
              {currentRole === 'OWNER' && '💼 Owner View: Fuel efficiency proxy normal. Vehicle operating within weight capacity.'}
              {currentRole === 'LOGISTICS_MANAGER' && '📊 Manager View: ETA on schedule. No active route deviations detected.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
