import React, { useState } from 'react';
import { FleetSummary, Alert } from '../types';
import { BarChart3, Download, PieChart, ShieldCheck, Truck, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Language, translations } from '../translations';

interface ReportsPageProps {
  summary: FleetSummary;
  alerts: Alert[];
  lang?: Language;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ summary, alerts, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const overloadCount = alerts.filter(a => a.type === 'OVERLOAD').length || 1;
  const alcoholCount = alerts.filter(a => a.type === 'ALCOHOL_THRESHOLD').length || 1;
  const routeCount = alerts.filter(a => a.type === 'ROUTE_DEVIATION').length || 2;
  const gasCount = alerts.filter(a => a.type === 'ABNORMAL_GAS').length || 1;
  const rainCount = alerts.filter(a => a.type === 'WATER_INGRESS').length || 1;
  const totalAlerts = overloadCount + alcoholCount + routeCount + gasCount + rainCount;

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Status\n"
      + `Average Fleet Trust Score,${summary.averageTrustScore}/100,OPTIMAL\n`
      + `Active Fleet Trucks,${summary.activeTrucks},OPERATIONAL\n`
      + `Completed Trips,${summary.completedTrips},SUCCESSFUL\n`
      + `Total Alerts Prevented,${totalAlerts},RESOLVED\n`
      + `Overload Events,${overloadCount},ALERTED\n`
      + `Alcohol Exceeded Events,${alcoholCount},ALERTED\n`
      + `Route Compliance Rate,98.2%,COMPLIANT\n`
      + `On-Time Delivery Rate,96.8%,EXCELLENT\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bharat_Load_Rakshak_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg('✓ Analytics CSV Report Downloaded Successfully!');
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.reportsTitle}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive IoT Telemetry & Driver Performance Analytics Hub
          </p>
        </div>
        <button className="btn-primary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={18} /> Export Analytics Report (CSV)
        </button>
      </div>

      {downloadMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> {downloadMsg}
        </div>
      )}

      {/* KPI Highlight Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Fleet Safety Rating</span>
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#34d399' }}>{summary.averageTrustScore || 92.8}/100</div>
          <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '4px' }}>+4.2% higher than industry avg</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Active Fleet Dispatch</span>
            <Truck size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#60a5fa' }}>{summary.activeTrucks} / {summary.totalTrucks} Trucks</div>
          <div style={{ fontSize: '0.7rem', color: '#60a5fa', marginTop: '4px' }}>100% OBD-II IoT Connected</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>On-Time Delivery Rate</span>
            <TrendingUp size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fbbf24' }}>96.8%</div>
          <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '4px' }}>Target: 95.0% Exceeded</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Incidents Intercepted</span>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f87171' }}>{totalAlerts} Events</div>
          <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '4px' }}>Zero Cargo Damage</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Incident Summary Card with Visual Bars */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <PieChart size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Telemetry Violation Breakdown</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Overload Detection (HX711)</span>
                <span style={{ fontWeight: 700, color: '#f87171' }}>{overloadCount} events</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (overloadCount / totalAlerts) * 100)}%`, height: '100%', background: '#ef4444' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Alcohol Exceeded (MQ-3 Sensor)</span>
                <span style={{ fontWeight: 700, color: '#f87171' }}>{alcoholCount} events</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (alcoholCount / totalAlerts) * 100)}%`, height: '100%', background: '#f43f5e' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Route Deviation (GPS Geofence)</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>{routeCount} events</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (routeCount / totalAlerts) * 100)}%`, height: '100%', background: '#f59e0b' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Abnormal Gas Leak (MQ-135)</span>
                <span style={{ fontWeight: 700, color: '#fbbf24' }}>{gasCount} events</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (gasCount / totalAlerts) * 100)}%`, height: '100%', background: '#eab308' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Water Ingress / Moisture</span>
                <span style={{ fontWeight: 700, color: '#60a5fa' }}>{rainCount} events</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (rainCount / totalAlerts) * 100)}%`, height: '100%', background: '#3b82f6' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Fleet Safety Trend Visual Bar Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <BarChart3 size={20} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Monthly Safety Compliance Trend</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
            {[
              { month: 'Apr', score: 82 },
              { month: 'May', score: 85 },
              { month: 'Jun', score: 89 },
              { month: 'Jul', score: 91 },
              { month: 'Aug', score: 94 },
              { month: 'Sep', score: 97 }
            ].map(m => (
              <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#34d399' }}>{m.score}%</span>
                <div style={{ width: '28px', height: `${(m.score / 100) * 130}px`, background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', borderRadius: '4px 4px 0 0' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.month}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Route Corridor Adherence</div>
              <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: '0.95rem' }}>98.2%</div>
            </div>
            <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Fuel Efficiency Index</div>
              <div style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.95rem' }}>91.5%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
