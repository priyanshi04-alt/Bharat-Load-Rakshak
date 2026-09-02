import React from 'react';
import { FleetSummary, Truck, Alert, Telemetry } from '../types';
import { StatCard } from '../components/StatCard';
import { LiveFleetMap } from '../components/LiveFleetMap';
import { Truck as TruckIcon, ShieldCheck, AlertTriangle, Navigation, AlertOctagon, Award, Activity } from 'lucide-react';

interface DashboardOverviewProps {
  summary: FleetSummary;
  trucks: Truck[];
  alerts: Alert[];
  telemetry: Telemetry[];
  onNavigateTab: (tab: string) => void;
  onOpenDriverModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  trucks,
  alerts,
  telemetry,
  onNavigateTab,
  onOpenDriverModal
}) => {
  const openAlertsList = alerts.filter(a => a.status === 'OPEN');

  return (
    <div>
      {/* Top Banner Callout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Fleet Safety & Supply Chain Dashboard</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-Time ESP32 IoT Ingestion | SAP CAP OData Services | Hardware Alert Engine
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={onOpenDriverModal}>
            AI Driver Dispatch Wizard
          </button>
          <button className="btn-secondary" onClick={() => onNavigateTab('testbench')}>
            Hardware Test Bench
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid-kpi">
        <StatCard
          title="Active Trucks"
          value={summary.activeTrucks}
          subtitle={`Out of ${summary.totalTrucks} Total Fleet Trucks`}
          icon={TruckIcon}
          color="#3b82f6"
          badgeText="ONLINE"
          badgeType="info"
        />
        <StatCard
          title="Safe Fleet Status"
          value={summary.safeTrucks}
          subtitle="Operating within safety parameters"
          icon={ShieldCheck}
          color="#10b981"
          badgeText="SAFE"
          badgeType="safe"
        />
        <StatCard
          title="Alert Trucks"
          value={summary.alertTrucks}
          subtitle="Requires immediate manager action"
          icon={AlertTriangle}
          color="#ef4444"
          badgeText={summary.alertTrucks > 0 ? "ACTION REQ" : "ALL CLEAR"}
          badgeType={summary.alertTrucks > 0 ? "danger" : "safe"}
        />
        <StatCard
          title="Ongoing Trips"
          value={summary.ongoingTrips}
          subtitle="Active cargo transits"
          icon={Navigation}
          color="#06b6d4"
          badgeText="IN TRANSIT"
          badgeType="info"
        />
        <StatCard
          title="Open Alerts"
          value={summary.openAlerts}
          subtitle={`${summary.criticalAlerts} Critical level alerts`}
          icon={AlertOctagon}
          color="#f59e0b"
          badgeText={summary.openAlerts > 0 ? "UNRESOLVED" : "CLEARED"}
          badgeType={summary.openAlerts > 0 ? "warning" : "safe"}
        />
        <StatCard
          title="Avg Driver Trust Score"
          value={`${summary.averageTrustScore}/100`}
          subtitle="Calculated driver safety index"
          icon={Award}
          color="#8b5cf6"
          badgeText="EXPLAINABLE AI"
          badgeType="safe"
        />
      </div>

      {/* Map & Live Alert Ticker Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Live Fleet Tracking & Route Corridor</h3>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => onNavigateTab('tracking')}>
              View Fullscreen Map
            </button>
          </div>
          <LiveFleetMap telemetryList={telemetry} trucks={trucks} />
        </div>

        {/* Realtime Alert Ticker Feed */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#ef4444" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Active Alert Feed</h3>
            </div>
            <span className="badge badge-danger">{openAlertsList.length} Open</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px' }}>
            {openAlertsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ All fleet trucks operating safely.<br/>No open alerts detected.
              </div>
            ) : (
              openAlertsList.map(a => (
                <div key={a.ID} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>{a.type}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>{a.message}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>Truck: {a.truckId}</span>
                    <button onClick={() => onNavigateTab('alerts')} style={{ color: '#60a5fa', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      Resolve →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Fleet Overview Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Fleet Trucks Telemetry Overview</h3>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => onNavigateTab('fleet')}>
            Manage Fleet →
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Model</th>
                <th>Status</th>
                <th>Max Allowed Weight</th>
                <th>Current Weight</th>
                <th>Load Status</th>
                <th>Gas Concentration</th>
                <th>Alcohol Sensor</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => {
                const latest = telemetry.find(t => t.truckId === truck.truckId);
                const currentWeight = latest ? latest.weightKg : 0;
                const isOverload = currentWeight > truck.maximumAllowedWeightKg;

                return (
                  <tr key={truck.truckId}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{truck.registrationNumber}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{truck.model}</td>
                    <td>
                      <span className={`badge ${truck.currentStatus === 'ALERT' ? 'badge-danger' : truck.currentStatus === 'ON_TRIP' ? 'badge-info' : 'badge-safe'}`}>
                        {truck.currentStatus}
                      </span>
                    </td>
                    <td>{truck.maximumAllowedWeightKg.toLocaleString()} kg</td>
                    <td style={{ fontWeight: 700, color: isOverload ? '#f87171' : '#34d399' }}>
                      {currentWeight > 0 ? `${currentWeight.toLocaleString()} kg` : 'N/A'}
                    </td>
                    <td>
                      {isOverload ? (
                        <span className="badge badge-danger">OVERLOAD ALERT</span>
                      ) : (
                        <span className="badge badge-safe">SAFE LOAD</span>
                      )}
                    </td>
                    <td>
                      {latest ? (
                        <span style={{ color: latest.gasValue > 300 ? '#f87171' : 'var(--text-primary)' }}>
                          {latest.gasValue} {latest.gasValue > 300 && '⚠️ Abnormal'}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {latest ? (
                        <span style={{ color: latest.alcoholValue > 150 ? '#f87171' : '#34d399' }}>
                          {latest.alcoholValue > 150 ? '⚠️ VERIFY REQUIRE' : '0 (NORMAL)'}
                        </span>
                      ) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
