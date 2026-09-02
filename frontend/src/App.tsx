import React, { useState, useEffect } from 'react';
import { UserRole, FleetSummary, Truck, Driver, Alert, Telemetry, Trip, VehicleDocument } from './types';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './pages/DashboardOverview';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { CargoMonitoringPage } from './pages/CargoMonitoringPage';
import { DriverIntelligencePage } from './pages/DriverIntelligencePage';
import { FleetManagementPage } from './pages/FleetManagementPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { TripsPage } from './pages/TripsPage';
import { DocumentManagerPage } from './pages/DocumentManagerPage';
import { ReportsPage } from './pages/ReportsPage';
import { HardwareTestBenchPage } from './pages/HardwareTestBenchPage';
import { DriverRecommendationModal } from './components/DriverRecommendationModal';
import { Language } from './translations';
import {
  fetchFleetSummary,
  fetchTrucks,
  fetchDrivers,
  fetchAlerts,
  fetchLatestTelemetry,
  fetchTrips,
  fetchDocuments
} from './services/api';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);

  // Data State
  const [summary, setSummary] = useState<FleetSummary>({
    totalTrucks: 3,
    activeTrucks: 2,
    safeTrucks: 2,
    alertTrucks: 1,
    ongoingTrips: 1,
    completedTrips: 12,
    openAlerts: 1,
    criticalAlerts: 0,
    averageTrustScore: 88.5
  });
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadData = async () => {
    try {
      const [sumData, truckData, driverData, alertData, telemData, tripData, docData] = await Promise.all([
        fetchFleetSummary(),
        fetchTrucks(),
        fetchDrivers(),
        fetchAlerts(),
        fetchLatestTelemetry(),
        fetchTrips(),
        fetchDocuments()
      ]);

      const savedCustom = JSON.parse(localStorage.getItem('BLR_CUSTOM_DRIVERS') || '[]');
      const savedDocs = JSON.parse(localStorage.getItem('BLR_CUSTOM_DOCUMENTS') || '[]');
      const savedTrips = JSON.parse(localStorage.getItem('BLR_CUSTOM_TRIPS') || '[]');
      const savedAlertStatuses = JSON.parse(localStorage.getItem('BLR_ALERT_STATUSES') || '{}');

      if (sumData) setSummary(sumData);
      if (truckData && truckData.length > 0) setTrucks(truckData);
      if (driverData && driverData.length > 0) {
        const combined = [...savedCustom, ...driverData.filter(d => !savedCustom.some((c: Driver) => c.driverId === d.driverId))];
        setDrivers(combined);
      } else if (savedCustom.length > 0) {
        setDrivers(savedCustom);
      }
      if (alertData && alertData.length > 0) {
        const updatedAlerts = alertData.map(a => savedAlertStatuses[a.ID] ? { ...a, status: savedAlertStatuses[a.ID] } : a);
        setAlerts(updatedAlerts);
      }
      if (telemData) setTelemetry(telemData);
      if (tripData && tripData.length > 0) {
        const combinedTrips = [...savedTrips, ...tripData.filter(t => !savedTrips.some((c: Trip) => c.tripId === t.tripId))];
        setTrips(combinedTrips);
      } else if (savedTrips.length > 0) {
        setTrips(savedTrips);
      }
      if (docData && docData.length > 0) {
        const combinedDocs = [...savedDocs, ...docData.filter(d => !savedDocs.some((c: VehicleDocument) => c.ID === d.ID))];
        setDocuments(combinedDocs);
      } else if (savedDocs.length > 0) {
        setDocuments(savedDocs);
      }
    } catch (err) {
      console.error('Error loading initial backend data:', err);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    const saved = JSON.parse(localStorage.getItem('BLR_ALERT_STATUSES') || '{}');
    saved[alertId] = 'ACKNOWLEDGED';
    localStorage.setItem('BLR_ALERT_STATUSES', JSON.stringify(saved));
    setAlerts(prev => prev.map(a => a.ID === alertId ? { ...a, status: 'ACKNOWLEDGED' as const } : a));
  };

  const handleResolveAlert = (alertId: string) => {
    const saved = JSON.parse(localStorage.getItem('BLR_ALERT_STATUSES') || '{}');
    saved[alertId] = 'RESOLVED';
    localStorage.setItem('BLR_ALERT_STATUSES', JSON.stringify(saved));
    setAlerts(prev => prev.map(a => a.ID === alertId ? { ...a, status: 'RESOLVED' as const } : a));
  };

  const handleAddDriver = (newDriver: Driver) => {
    const savedCustom = JSON.parse(localStorage.getItem('BLR_CUSTOM_DRIVERS') || '[]');
    const updated = [newDriver, ...savedCustom.filter((c: Driver) => c.driverId !== newDriver.driverId)];
    localStorage.setItem('BLR_CUSTOM_DRIVERS', JSON.stringify(updated));
    setDrivers(prev => [newDriver, ...prev.filter(d => d.driverId !== newDriver.driverId)]);
  };

  const handleDeleteDriver = (driverId: string) => {
    const savedCustom = JSON.parse(localStorage.getItem('BLR_CUSTOM_DRIVERS') || '[]');
    const updated = savedCustom.filter((c: Driver) => c.driverId !== driverId);
    localStorage.setItem('BLR_CUSTOM_DRIVERS', JSON.stringify(updated));
    setDrivers(prev => prev.filter(d => d.driverId !== driverId));
  };

  const handleCreateTrip = (newTrip: Trip) => {
    const savedTrips = JSON.parse(localStorage.getItem('BLR_CUSTOM_TRIPS') || '[]');
    const updated = [newTrip, ...savedTrips.filter((c: Trip) => c.tripId !== newTrip.tripId)];
    localStorage.setItem('BLR_CUSTOM_TRIPS', JSON.stringify(updated));
    setTrips(prev => [newTrip, ...prev.filter(t => t.tripId !== newTrip.tripId)]);
  };

  const handleCompleteTrip = (tripId: string) => {
    const savedTrips = JSON.parse(localStorage.getItem('BLR_CUSTOM_TRIPS') || '[]');
    const updated = savedTrips.map((t: Trip) => t.tripId === tripId ? { ...t, status: 'COMPLETED' as const } : t);
    localStorage.setItem('BLR_CUSTOM_TRIPS', JSON.stringify(updated));
    setTrips(prev => prev.map(t => t.tripId === tripId ? { ...t, status: 'COMPLETED' as const } : t));
  };

  const handleUploadDocument = (newDoc: VehicleDocument) => {
    const savedDocs = JSON.parse(localStorage.getItem('BLR_CUSTOM_DOCUMENTS') || '[]');
    const updated = [newDoc, ...savedDocs.filter((c: VehicleDocument) => c.ID !== newDoc.ID)];
    localStorage.setItem('BLR_CUSTOM_DOCUMENTS', JSON.stringify(updated));
    setDocuments(prev => [newDoc, ...prev.filter(d => d.ID !== newDoc.ID)]);
  };

  const handleDeleteDocument = (docId: string) => {
    const savedDocs = JSON.parse(localStorage.getItem('BLR_CUSTOM_DOCUMENTS') || '[]');
    const updated = savedDocs.filter((c: VehicleDocument) => c.ID !== docId);
    localStorage.setItem('BLR_CUSTOM_DOCUMENTS', JSON.stringify(updated));
    setDocuments(prev => prev.filter(d => d.ID !== docId));
  };

  const handleVerifyDocument = (docId: string) => {
    setDocuments(prev => prev.map(d => d.ID === docId ? { ...d, status: 'VALID' } : d));
  };

  useEffect(() => {
    loadData();

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.hostname || 'localhost';
    const wsUrl = `${wsProtocol}//${wsHost}:4000`;

    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'TELEMETRY_UPDATE') {
            setTelemetry(prev => [msg.data, ...prev.slice(0, 49)]);
            loadData();
          } else if (msg.type === 'ALERT_GENERATED') {
            setAlerts(prev => [...(Array.isArray(msg.data) ? msg.data : [msg.data]), ...prev]);
            loadData();
          }
        } catch (err) {
          console.error(err);
        }
      };

      ws.onclose = () => {
        setIsWsConnected(false);
      };

      ws.onerror = () => {
        setIsWsConnected(false);
      };
    } catch (err) {
      console.warn('[Frontend WS Init Error]', err);
    }

    const interval = setInterval(loadData, 5000);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar
        currentRole={currentRole}
        onRoleChange={(r) => setCurrentRole(r)}
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        isWsConnected={isWsConnected}
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onLangChange={(l) => setLang(l)}
      />

      <main className="main-content">
        {activeTab === 'overview' && (
          <DashboardOverview
            summary={summary}
            trucks={trucks}
            alerts={alerts}
            telemetry={telemetry}
            onNavigateTab={(t) => setActiveTab(t)}
            onOpenDriverModal={() => setIsDriverModalOpen(true)}
            lang={lang}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'tracking' && (
          <LiveTrackingPage telemetry={telemetry} trucks={trucks} lang={lang} />
        )}

        {activeTab === 'cargo' && (
          <CargoMonitoringPage telemetry={telemetry} trucks={trucks} lang={lang} />
        )}

        {activeTab === 'driver' && (
          <DriverIntelligencePage
            drivers={drivers}
            onOpenModal={() => setIsDriverModalOpen(true)}
            onAddDriver={handleAddDriver}
            onDeleteDriver={handleDeleteDriver}
            currentRole={currentRole}
            lang={lang}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetManagementPage trucks={trucks} devices={[]} lang={lang} />
        )}

        {activeTab === 'alerts' && (
          <AlertCenterPage
            alerts={alerts}
            onRefresh={loadData}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            lang={lang}
          />
        )}

        {activeTab === 'trips' && (
          <TripsPage
            trips={trips}
            trucks={trucks}
            drivers={drivers}
            currentRole={currentRole}
            onCreateTrip={handleCreateTrip}
            onCompleteTrip={handleCompleteTrip}
            lang={lang}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentManagerPage
            documents={documents}
            trucks={trucks}
            currentRole={currentRole}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            onVerifyDocument={handleVerifyDocument}
            lang={lang}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPage summary={summary} alerts={alerts} lang={lang} />
        )}

        {activeTab === 'testbench' && (
          <HardwareTestBenchPage onRefresh={loadData} lang={lang} />
        )}
      </main>

      <DriverRecommendationModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
export default App;
