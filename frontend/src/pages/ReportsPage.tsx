import React from 'react';
import { FleetSummary, Alert } from '../types';
import { BarChart3, Download, PieChart, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface ReportsPageProps {
  summary: FleetSummary;
  alerts: Alert[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ summary, alerts }) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Fleet Safety & Logistics Analytics Reports</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Audit compliance logs, trip completion metrics, incident distributions, and safety trend reports
          </p>
        </div>
        <button className="btn-primary">
          <Download size={18} /> Export Analytics Report (CSV / PDF)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Incident Summary Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <PieChart size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Alert Distribution Breakdown</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Overload Events:</span>
              <span style={{ fontWeight: 700, color: '#f87171' }}>{alerts.filter(a => a.type === 'OVERLOAD').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Alcohol Sensor Exceeded Events:</span>
              <span style={{ fontWeight: 700, color: '#f87171' }}>{alerts.filter(a => a.type === 'ALCOHOL_THRESHOLD').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Route Deviations:</span>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>{alerts.filter(a => a.type === 'ROUTE_DEVIATION').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Abnormal Gas Concentration:</span>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>{alerts.filter(a => a.type === 'ABNORMAL_GAS').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Water Ingress / Moisture:</span>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>{alerts.filter(a => a.type === 'WATER_INGRESS').length}</span>
            </div>
          </div>
        </div>

        {/* Fleet Performance Summary */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BarChart3 size={20} color="#10b981" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Fleet Performance Metrics</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Driver Trust Score:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>{summary.averageTrustScore}/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Trips Completed:</span>
              <span style={{ fontWeight: 700 }}>{summary.completedTrips}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>On-Time Delivery Rate:</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>96.8%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Route Compliance Rate:</span>
              <span style={{ fontWeight: 700, color: '#60a5fa' }}>98.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
