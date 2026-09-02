import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Telemetry, Truck, Trip, Alert } from '../types';
import { Language, translations } from '../translations';
import { Crosshair, Truck as TruckIcon } from 'lucide-react';

interface LiveFleetMapProps {
  telemetryList: Telemetry[];
  trucks: Truck[];
  alerts?: Alert[];
  trips?: Trip[];
  selectedTruckId?: string;
  onSelectTruck?: (truckId: string) => void;
  theme?: 'dark' | 'light';
  lang?: Language;
}

// NH-48 Active Logistics Highway Corridor (Delhi-NCR -> Mumbai)
const NH48_CORRIDOR_WAYPOINTS: [number, number][] = [
  [28.4595, 77.0266], // Gurugram
  [28.1800, 76.6172], // Rewari
  [27.9890, 76.3812], // Neemrana
  [27.7024, 76.2008], // Kotputli
  [26.9124, 75.7873], // Jaipur
  [26.4499, 74.6399], // Ajmer
  [24.5854, 73.7125], // Udaipur
  [23.0225, 72.5714], // Ahmedabad
  [19.2812, 73.0482]  // Bhiwandi / Mumbai Hub
];

// Logistics Maintenance Depot fallback coordinates
const DEPOT_COORDS: [number, number] = [28.5355, 77.2624];

export const LiveFleetMap: React.FC<LiveFleetMapProps> = ({
  telemetryList,
  trucks,
  alerts = [],
  selectedTruckId,
  onSelectTruck,
  theme = 'dark',
  lang = 'en'
}) => {
  const t = translations[lang] || translations['en'];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const initialFitDone = useRef(false);

  // Focus map on all fleet trucks
  const handleFocusFleet = () => {
    if (!mapRef.current) return;
    const points: L.LatLngTuple[] = [];

    const latestByTruck: { [key: string]: Telemetry } = {};
    telemetryList.forEach(tr => {
      if (!latestByTruck[tr.truckId] || new Date(tr.timestamp) > new Date(latestByTruck[tr.truckId].timestamp)) {
        latestByTruck[tr.truckId] = tr;
      }
    });

    trucks.forEach(truck => {
      const tr = latestByTruck[truck.truckId];
      if (tr && tr.latitude && tr.longitude) {
        points.push([tr.latitude, tr.longitude]);
      } else {
        points.push(DEPOT_COORDS);
      }
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize Leaflet Map centered on NH-48 Corridor
      const map = L.map(mapContainerRef.current, {
        center: [26.9124, 75.7873],
        zoom: 7,
        zoomControl: true,
        attributionControl: false
      });

      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapRef.current = map;

      // Draw NH-48 Active Logistics Transit Corridor Polyline
      const corridorLine = L.polyline(NH48_CORRIDOR_WAYPOINTS, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '8, 12'
      }).addTo(map);

      polylineRef.current = corridorLine;
    } else {
      if (tileLayerRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const newTileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19
      }).addTo(mapRef.current);

      tileLayerRef.current = newTileLayer;
    }

    const map = mapRef.current;

    // Get latest telemetry for each truck
    const latestByTruck: { [key: string]: Telemetry } = {};
    telemetryList.forEach(tr => {
      if (!latestByTruck[tr.truckId] || new Date(tr.timestamp) > new Date(latestByTruck[tr.truckId].timestamp)) {
        latestByTruck[tr.truckId] = tr;
      }
    });

    const allTruckCoords: L.LatLngTuple[] = [];

    // Render ALL trucks from Manage Fleet list
    trucks.forEach(truckInfo => {
      const truckId = truckInfo.truckId;
      const tr = latestByTruck[truckId];
      
      const lat = (tr && tr.latitude) ? tr.latitude : DEPOT_COORDS[0];
      const lng = (tr && tr.longitude) ? tr.longitude : DEPOT_COORDS[1];
      allTruckCoords.push([lat, lng]);

      // Check open alert for exact misactivity reason
      const truckOpenAlert = alerts.find(a => a.truckId === truckId && a.status === 'OPEN');
      const isOverload = tr && tr.weightKg > truckInfo.maximumAllowedWeightKg;
      const isAlcohol = tr && tr.alcoholValue > 150;
      const isAlertState = truckInfo.currentStatus === 'ALERT' || !!truckOpenAlert || isOverload || isAlcohol;
      const isMaintenance = truckInfo.currentStatus === 'MAINTENANCE' || truckInfo.currentStatus === 'OFFLINE';
      const isSelected = selectedTruckId === truckId;

      // Determine Misactivity Alert Reason
      let misactivityLabel = 'IN TRANSIT';
      let badgeBg = '#10b981';

      if (isMaintenance) {
        misactivityLabel = truckInfo.currentStatus;
        badgeBg = '#6b7280'; // Gray for Maintenance/Offline
      } else if (isAlertState) {
        badgeBg = '#ef4444';
        if (truckOpenAlert) {
          misactivityLabel = `⚠️ ${truckOpenAlert.type.replace(/_/g, ' ')}`;
        } else if (isOverload) {
          misactivityLabel = '⚠️ OVERLOAD VIOLATION';
        } else if (isAlcohol) {
          misactivityLabel = '🚨 ALCOHOL ALCOHOL';
        } else {
          misactivityLabel = '⚠️ HAZARD ALERT';
        }
      }

      const regNo = truckInfo.registrationNumber || truckId;
      const speedDisplay = tr ? `${tr.speedKmph} km/h` : 'OFFLINE';

      // Custom marker card with registration plate & misactivity tag
      const customIcon = L.divIcon({
        className: 'realistic-vehicle-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
            <!-- Reg No & Speed Label Tag -->
            <div style="
              background: ${isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.88)'};
              color: #f8fafc;
              padding: 4px 8px;
              border-radius: 6px;
              border: 1px solid ${isSelected ? '#3b82f6' : badgeBg};
              font-family: Outfit, system-ui, sans-serif;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 4px;
            ">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${badgeBg};"></span>
              <span>${regNo}</span>
              <span style="background: rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 4px; color: ${isAlertState ? '#fca5a5' : '#60a5fa'}; font-size: 10px;">${misactivityLabel}</span>
            </div>

            <!-- Truck Vehicle Icon Badge -->
            <div style="
              background: ${badgeBg};
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 3px solid #ffffff;
              box-shadow: 0 0 20px ${badgeBg};
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 18px;
            ">
              ${isMaintenance ? '🔧' : '🚛'}
            </div>
            
            <!-- Pin Arrow -->
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid ${badgeBg};
              margin-top: -2px;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      if (markersRef.current[truckId]) {
        markersRef.current[truckId].setLatLng([lat, lng]);
        markersRef.current[truckId].setIcon(customIcon);
      } else {
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          if (onSelectTruck) onSelectTruck(truckId);
        });
        markersRef.current[truckId] = marker;
      }

      // Rich Popup Content with Misactivity Details
      const popupHtml = `
        <div style="color: #0f172a; font-family: Outfit, system-ui, sans-serif; padding: 6px; min-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a;">${regNo}</h4>
            <span style="background: ${badgeBg}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">${misactivityLabel}</span>
          </div>
          <div style="font-size: 12px; line-height: 1.6; color: #334155;">
            <b>Model:</b> ${truckInfo.model}<br/>
            <b>Status:</b> ${truckInfo.currentStatus}<br/>
            <b>Live Speed:</b> ${speedDisplay}<br/>
            <b>Weight Payload:</b> ${tr ? `${tr.weightKg.toLocaleString()} kg` : 'No Signal (Parked)'} (Max: ${truckInfo.maximumAllowedWeightKg.toLocaleString()}kg)<br/>
            ${truckOpenAlert ? `<div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 6px; border-radius: 4px; color: #b91c1c; margin-top: 6px; font-weight: 600;">⚠️ Misactivity: ${truckOpenAlert.message}</div>` : ''}
          </div>
        </div>
      `;
      markersRef.current[truckId].bindPopup(popupHtml);
    });

    // Auto-fit bounds on initial load if truck coordinates exist
    if (!initialFitDone.current && allTruckCoords.length > 0) {
      initialFitDone.current = true;
      const bounds = L.latLngBounds(allTruckCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
    }

  }, [telemetryList, trucks, alerts, selectedTruckId, onSelectTruck, theme]);

  return (
    <div className="glass-panel" style={{ height: '440px', width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

      {/* Floating Top Control Panel */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <TruckIcon size={16} color="var(--accent-blue)" />
          <span>Fleet Trucks Map ({trucks.length} Vehicles Plotted)</span>
        </div>

        <button
          onClick={handleFocusFleet}
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-blue)',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
          title="Zoom & fit map to all fleet trucks"
        >
          <Crosshair size={14} />
          <span>Focus All Fleet</span>
        </button>
      </div>

      {/* Floating Legend Badge */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, background: 'var(--bg-card)', backdropFilter: 'blur(10px)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.normalTransit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.alertOverloadEvent}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6b7280' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Maintenance / Offline</span>
        </div>
      </div>
    </div>
  );
};

export default LiveFleetMap;
