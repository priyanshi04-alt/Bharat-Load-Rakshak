import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Telemetry, Truck } from '../types';

interface LiveFleetMapProps {
  telemetryList: Telemetry[];
  trucks: Truck[];
  selectedTruckId?: string;
  onSelectTruck?: (truckId: string) => void;
  theme?: 'dark' | 'light';
}

export const LiveFleetMap: React.FC<LiveFleetMapProps> = ({
  telemetryList,
  trucks,
  selectedTruckId,
  onSelectTruck,
  theme = 'dark'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize Leaflet Map centered on India (Jaipur / NH-48 Hub)
      const map = L.map(mapContainerRef.current, {
        center: [26.9124, 75.7873],
        zoom: 6,
        zoomControl: true
      });

      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapRef.current = map;
    } else {
      // Update Tile Layer if theme changed
      if (tileLayerRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }
      const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const newTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(mapRef.current);

      tileLayerRef.current = newTileLayer;
    }

    const map = mapRef.current;

    // Update truck markers from latest telemetry
    const latestByTruck: { [key: string]: Telemetry } = {};
    telemetryList.forEach(t => {
      if (!latestByTruck[t.truckId] || new Date(t.timestamp) > new Date(latestByTruck[t.truckId].timestamp)) {
        latestByTruck[t.truckId] = t;
      }
    });

    Object.values(latestByTruck).forEach(t => {
      const { truckId, latitude, longitude, speedKmph, weightKg } = t;
      if (!latitude || !longitude) return;

      const truckInfo = trucks.find(tr => tr.truckId === truckId);
      const isAlert = truckInfo?.currentStatus === 'ALERT' || t.alcoholValue > 150 || (truckInfo && weightKg > truckInfo.maximumAllowedWeightKg);

      const markerColor = isAlert ? '#ef4444' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 0 12px ${markerColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
          ">
            🚚
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      if (markersRef.current[truckId]) {
        markersRef.current[truckId].setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          if (onSelectTruck) onSelectTruck(truckId);
        });
        markersRef.current[truckId] = marker;
      }

      // Popup Content
      const popupHtml = `
        <div style="color: #111827; font-family: Outfit, sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700;">${truckInfo?.registrationNumber || truckId}</h4>
          <div style="font-size: 12px; color: #4b5563;">
            <b>Status:</b> ${truckInfo?.currentStatus || 'ACTIVE'}<br/>
            <b>Speed:</b> ${speedKmph} km/h<br/>
            <b>Load Weight:</b> ${weightKg} kg<br/>
            <b>Gas Value:</b> ${t.gasValue}<br/>
            <b>Alcohol Sensor:</b> ${t.alcoholValue}
          </div>
        </div>
      `;
      markersRef.current[truckId].bindPopup(popupHtml);
    });

  }, [telemetryList, trucks, onSelectTruck, theme]);

  return (
    <div className="glass-panel" style={{ height: '420px', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, background: 'var(--bg-card)', backdropFilter: 'blur(8px)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span>Normal Transit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span>Alert / Overload / Alcohol Event</span>
        </div>
      </div>
    </div>
  );
};
