import React from 'react';
import { FleetSummary, Truck, Alert, Telemetry, UserRole } from '../types';
import { StatCard } from '../components/StatCard';
import { LiveFleetMap } from '../components/LiveFleetMap';
import { Truck as TruckIcon, ShieldCheck, AlertTriangle, Navigation, AlertOctagon, Award, Activity, UserCheck, Scale } from 'lucide-react';
import { Language, translations, getLocalizedAlertMessage } from '../translations';

interface DashboardOverviewProps {
  summary: FleetSummary;
  trucks: Truck[];
  alerts: Alert[];
  telemetry: Telemetry[];
  onNavigateTab: (tab: string) => void;
  onOpenDriverModal: () => void;
  lang?: Language;
  currentRole?: UserRole;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  trucks,
  alerts,
  telemetry,
  onNavigateTab,
  onOpenDriverModal,
  lang = 'en',
  currentRole = 'OWNER'
}) => {
  const t = translations[lang] || translations['en'];
  const openAlertsList = alerts.filter(a => a.status === 'OPEN');

  // =========================================================================
  // 1. DRIVER SPECIFIC COCKPIT VIEW
  // =========================================================================
  if (currentRole === 'DRIVER') {
    const assignedTruck = trucks.find(t => t.assignedDriverId === 'BLR-DRV-001') || trucks[0];
    const latestTelem = telemetry.find(t => t.truckId === assignedTruck?.truckId);

    return (
      <div>
        {/* Role Banner */}
        <div style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="#34d399" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{t.driverPortal}</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {t.assignedVehicle}: <strong style={{ color: '#fff' }}>{assignedTruck?.registrationNumber} ({assignedTruck?.model})</strong> | {t.activeTrip}: Gurugram ➔ Mumbai
            </p>
          </div>
          <span className="badge badge-safe" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>{t.driverTrustScore}: 95.2 / 100</span>
        </div>

        {/* Driver KPIs */}
        <div className="grid-kpi" style={{ marginBottom: '24px' }}>
          <StatCard
            title={t.mySafetyScore}
            value="95.2 / 100"
            subtitle="Tier A Compliant Driver"
            icon={Award}
            color="#10b981"
            badgeText={t.badgeTopRated}
            badgeType="safe"
          />
          <StatCard
            title={t.currentSpeedLimit}
            value={`${latestTelem ? latestTelem.speedKmph : 62.4} km/h`}
            subtitle="Speed Limit: 80 km/h"
            icon={Navigation}
            color="#3b82f6"
            badgeText={t.badgeSafeSpeed}
            badgeType="info"
          />
          <StatCard
            title={t.alcoholSobrietySensor}
            value={latestTelem && latestTelem.alcoholValue > 150 ? t.verifyRequire : "0 PPM"}
            subtitle="MQ-3 Alcohol Sensor Reading"
            icon={ShieldCheck}
            color={latestTelem && latestTelem.alcoholValue > 150 ? "#ef4444" : "#10b981"}
            badgeText={latestTelem && latestTelem.alcoholValue > 150 ? t.badgeActionReq : t.badgePassed}
            badgeType={latestTelem && latestTelem.alcoholValue > 150 ? "danger" : "safe"}
          />
          <StatCard
            title={t.cargoAxleLoad}
            value={`${latestTelem ? latestTelem.weightKg.toLocaleString() : '8,450'} kg`}
            subtitle="Max Capacity: 10,000 kg"
            icon={TruckIcon}
            color="#06b6d4"
            badgeText={t.badgeLegalLoad}
            badgeType="safe"
          />
        </div>

        {/* Driver Quick Actions & Map */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>{t.liveRouteMap}</h3>
            <LiveFleetMap telemetryList={telemetry} trucks={trucks} lang={lang} />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{t.driverEmergencyChecklist}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>{t.sosTriggerTitle}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t.sosTriggerDesc}</div>
                <button className="btn-primary" style={{ width: '100%', background: '#ef4444', borderColor: '#ef4444', justifyContent: 'center' }}>
                  {t.sosEmergencyBtn}
                </button>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '14px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>📋 {t.preDepartureVerification}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ✓ Load Cell Tare Verified<br/>
                  ✓ Alcohol Breathalyzer 0 PPM<br/>
                  ✓ Tarpaulin Rain Cover Sealed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. WAREHOUSE MANAGER SPECIFIC WEIGHBRIDGE VIEW
  // =========================================================================
  if (currentRole === 'WAREHOUSE_USER') {
    return (
      <div>
        {/* Role Banner */}
        <div style={{ background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={20} color="#fbbf24" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{t.warehouseTerminalTitle}</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {t.warehouseTerminalSubtitle}
            </p>
          </div>
          <button className="btn-primary" onClick={() => onNavigateTab('testbench')}>
            {t.hardwareTestBench} →
          </button>
        </div>

        <div className="grid-kpi" style={{ marginBottom: '24px' }}>
          <StatCard
            title={t.weighbridgeScale}
            value="8,450 kg"
            subtitle={`${t.axleLimit}: 10,000 kg`}
            icon={Scale}
            color="#3b82f6"
            badgeText={t.badgeWeighed}
            badgeType="info"
          />
          <StatCard
            title={t.cargoTypeValue}
            value="Semiconductors"
            subtitle={t.declaredValueLabel}
            icon={ShieldCheck}
            color="#10b981"
            badgeText={t.badgeHighValue}
            badgeType="safe"
          />
          <StatCard
            title={t.containerRainSeal}
            value="DRY SEAL ✓"
            subtitle="Rain drop sensor reading"
            icon={AlertTriangle}
            color="#06b6d4"
            badgeText={t.badgeSecure}
            badgeType="safe"
          />
        </div>

        {/* Cargo Loading Table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{t.currentLoadingQueue}</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Truck ID</th>
                <th>{t.cargoItem}</th>
                <th>{t.maxAllowedWeight}</th>
                <th>{t.weighbridgeScale}</th>
                <th>{t.loadStatus}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => {
                const latest = telemetry.find(tr => tr.truckId === truck.truckId);
                const weight = latest ? latest.weightKg : 8450;
                const isOver = weight > truck.maximumAllowedWeightKg;

                return (
                  <tr key={truck.truckId}>
                    <td style={{ fontWeight: 700, color: '#fff' }}>{truck.registrationNumber}</td>
                    <td>High Precision Electronics</td>
                    <td>{truck.maximumAllowedWeightKg.toLocaleString()} kg</td>
                    <td style={{ fontWeight: 700, color: isOver ? '#f87171' : '#34d399' }}>{weight.toLocaleString()} kg</td>
                    <td>
                      <span className={`badge ${isOver ? 'badge-danger' : 'badge-safe'}`}>
                        {isOver ? t.badgeOverloaded : t.badgeLoadCompliant}
                      </span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => onNavigateTab('testbench')}>
                        {t.reWeighScale}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. EXECUTIVE FLEET COMMAND CENTER VIEW (OWNER, ADMIN, LOGISTICS MANAGER)
  // =========================================================================
  return (
    <div>
      {/* Top Banner Callout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{t.fleetSafetyHeader}</h2>
            <span className="badge badge-info">{currentRole === 'OWNER' ? t.roleOwner : currentRole}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-Time ESP32 IoT Ingestion | SAP CAP OData Services | Hardware Alert Engine
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={onOpenDriverModal}>
            {t.aiDispatchWizard}
          </button>
          <button className="btn-secondary" onClick={() => onNavigateTab('testbench')}>
            {t.hardwareTestBench}
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid-kpi">
        <StatCard
          title={t.activeTrucks}
          value={summary.activeTrucks}
          subtitle={t.outOfFleetTrucks}
          icon={TruckIcon}
          color="#3b82f6"
          badgeText={t.badgeOnline}
          badgeType="info"
        />
        <StatCard
          title={t.safeFleetStatus}
          value={summary.safeTrucks}
          subtitle={t.operatingWithinLimits}
          icon={ShieldCheck}
          color="#10b981"
          badgeText={t.badgeSafe}
          badgeType="safe"
        />
        <StatCard
          title={t.alertTrucks}
          value={summary.alertTrucks}
          subtitle={t.actionRequiredSub}
          icon={AlertTriangle}
          color="#ef4444"
          badgeText={summary.alertTrucks > 0 ? t.badgeActionReq : t.badgeAllClear}
          badgeType={summary.alertTrucks > 0 ? "danger" : "safe"}
        />
        <StatCard
          title={t.ongoingTrips}
          value={summary.ongoingTrips}
          subtitle={t.activeCargoTransitsSub}
          icon={Navigation}
          color="#06b6d4"
          badgeText={t.badgeInTransit}
          badgeType="info"
        />
        <StatCard
          title={t.openAlerts}
          value={summary.openAlerts}
          subtitle={`${summary.criticalAlerts} ${t.criticalAlertsSub}`}
          icon={AlertOctagon}
          color="#f59e0b"
          badgeText={summary.openAlerts > 0 ? t.badgeUnresolved : t.badgeCleared}
          badgeType={summary.openAlerts > 0 ? "warning" : "safe"}
        />
        <StatCard
          title={t.avgDriverScore}
          value={`${summary.averageTrustScore}/100`}
          subtitle={t.driverSafetyIndexSub}
          icon={Award}
          color="#8b5cf6"
          badgeText={t.badgeExplainableAi}
          badgeType="safe"
        />
      </div>

      {/* Map & Live Alert Ticker Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.tabTracking}</h3>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => onNavigateTab('tracking')}>
              {t.viewFullscreenMap}
            </button>
          </div>
          <LiveFleetMap telemetryList={telemetry} trucks={trucks} alerts={alerts} lang={lang} />
        </div>

        {/* Realtime Alert Ticker Feed */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#ef4444" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t.activeAlertFeed}</h3>
            </div>
            <span className="badge badge-danger">{openAlertsList.length} Open</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px' }}>
            {openAlertsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ {t.noAlertsFound}
              </div>
            ) : (
              openAlertsList.map(a => (
                <div key={a.ID} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>{a.type}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(a.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>{getLocalizedAlertMessage(a.message, lang)}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>Truck: {a.truckId}</span>
                    <button onClick={() => onNavigateTab('alerts')} style={{ color: '#60a5fa', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      {t.resolveBtn}
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
            {t.manageFleet}
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>{t.registration}</th>
                <th>{t.model}</th>
                <th>{t.status} & Misactivity Reason</th>
                <th>{t.maxAllowedWeight}</th>
                <th>{t.currentWeight}</th>
                <th>{t.loadStatus}</th>
                <th>{t.gasConcentration}</th>
                <th>{t.alcoholSensor}</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map(truck => {
                const latest = telemetry.find(tr => tr.truckId === truck.truckId);
                const currentWeight = latest ? latest.weightKg : 0;
                const isOverload = currentWeight > truck.maximumAllowedWeightKg;
                const truckAlert = alerts.find(a => a.truckId === truck.truckId && a.status === 'OPEN');
                const isMaintenance = truck.currentStatus === 'MAINTENANCE' || truck.currentStatus === 'OFFLINE';

                let misactivityDetail = null;
                if (truckAlert) {
                  misactivityDetail = truckAlert.message;
                } else if (isOverload) {
                  misactivityDetail = `Overloaded (${currentWeight.toLocaleString()}kg vs Limit ${truck.maximumAllowedWeightKg.toLocaleString()}kg)`;
                } else if (truck.insuranceExpiry && new Date(truck.insuranceExpiry) < new Date()) {
                  misactivityDetail = `Vehicle Insurance Expired on ${truck.insuranceExpiry}`;
                }

                return (
                  <tr key={truck.truckId}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>
                      {truck.registrationNumber}
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{truck.truckId}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{truck.model}</td>
                    <td>
                      <div>
                        <span className={`badge ${truck.currentStatus === 'ALERT' || truckAlert ? 'badge-danger' : isMaintenance ? 'badge-warning' : truck.currentStatus === 'ON_TRIP' ? 'badge-info' : 'badge-safe'}`}>
                          {truck.currentStatus}
                        </span>
                        {misactivityDetail && (
                          <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px', fontWeight: 600 }}>
                            ⚠️ {misactivityDetail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{truck.maximumAllowedWeightKg.toLocaleString()} kg</td>
                    <td style={{ fontWeight: 700, color: isOverload ? '#f87171' : currentWeight > 0 ? '#34d399' : 'var(--text-muted)' }}>
                      {currentWeight > 0 ? `${currentWeight.toLocaleString()} kg` : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Signal (Parked)</span>}
                    </td>
                    <td>
                      {isOverload ? (
                        <span className="badge badge-danger">{t.overloadAlert}</span>
                      ) : isMaintenance ? (
                        <span className="badge badge-warning">Depot Maintenance</span>
                      ) : (
                        <span className="badge badge-safe">{t.safeLoad}</span>
                      )}
                    </td>
                    <td>
                      {latest ? (
                        <span style={{ color: latest.gasValue > 300 ? '#f87171' : 'var(--text-primary)' }}>
                          {latest.gasValue} ppm {latest.gasValue > 300 && `(⚠️ ${t.abnormalGas})`}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sensor Offline</span>
                      )}
                    </td>
                    <td>
                      {latest ? (
                        <span style={{ color: latest.alcoholValue > 150 ? '#f87171' : '#34d399' }}>
                          {latest.alcoholValue > 150 ? `🚨 ALCOHOL (${latest.alcoholValue})` : '0.0 (Normal)'}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sensor Offline</span>
                      )}
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

export default DashboardOverview;
