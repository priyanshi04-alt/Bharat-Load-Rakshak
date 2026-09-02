import React, { useState } from 'react';
import { Trip, UserRole, Truck, Driver } from '../types';
import { MapPin, Navigation, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../translations';
import { CreateTripModal } from '../components/CreateTripModal';

interface TripsPageProps {
  trips: Trip[];
  trucks?: Truck[];
  drivers?: Driver[];
  currentRole: UserRole;
  onCreateTrip?: (trip: Trip) => void;
  onCompleteTrip?: (tripId: string) => void;
  lang?: Language;
}

export const TripsPage: React.FC<TripsPageProps> = ({
  trips,
  trucks = [],
  drivers = [],
  currentRole,
  onCreateTrip,
  onCompleteTrip,
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const canCreateTrip = currentRole === 'ADMIN' || currentRole === 'OWNER' || currentRole === 'LOGISTICS_MANAGER';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.tripsTitle}</h2>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>ROLE: {currentRole}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {t.tripsSubtitle}
          </p>
        </div>

        {canCreateTrip && (
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Dispatch New Trip
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {trips.map(trip => (
          <div key={trip.tripId} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trip #{trip.tripId}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cargo ID: {trip.cargoId}</div>
              </div>
              <span className={`badge ${trip.status === 'IN_TRANSIT' ? 'badge-info' : trip.status === 'PLANNED' ? 'badge-warning' : 'badge-safe'}`}>
                {trip.status === 'IN_TRANSIT' ? t.inTransit : trip.status === 'PLANNED' ? t.planned : 'COMPLETED'}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
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

            {/* Action Bar for Active Trips */}
            {trip.status === 'IN_TRANSIT' ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    if (onCompleteTrip) onCompleteTrip(trip.tripId);
                  }}
                >
                  <CheckCircle2 size={16} /> Mark Trip Completed
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <ShieldCheck size={16} /> Trip Successfully Delivered & Cargo Verified
              </div>
            )}
          </div>
        ))}
      </div>

      {canCreateTrip && (
        <CreateTripModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTrip={(newTrip) => {
            if (onCreateTrip) onCreateTrip(newTrip);
          }}
          trucks={trucks}
          drivers={drivers}
          lang={lang}
        />
      )}
    </div>
  );
};
