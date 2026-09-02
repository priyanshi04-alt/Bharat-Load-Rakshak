import React from 'react';
import { UserRole } from '../types';
import { Shield, User, Sun, Moon, Globe } from 'lucide-react';
import { Language, translations } from '../translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isWsConnected: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  isWsConnected,
  theme,
  onToggleTheme,
  lang,
  onLangChange
}) => {
  const t = translations[lang] || translations['en'];

  const roles: { key: UserRole; label: string }[] = [
    { key: 'ADMIN', label: 'System Admin' },
    { key: 'OWNER', label: 'Truck Owner' },
    { key: 'LOGISTICS_MANAGER', label: 'Logistics Manager' },
    { key: 'DRIVER', label: 'Driver View' },
    { key: 'WAREHOUSE_USER', label: 'Warehouse Manager' }
  ];

  const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { key: 'mr', label: 'मराठी (Marathi)', flag: '🚩' },
    { key: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🍊' },
    { key: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🌾' },
    { key: 'ta', label: 'தமிழ் (Tamil)', flag: '🏛️' },
    { key: 'te', label: 'తెలుగు (Telugu)', flag: '🌾' },
    { key: 'kn', label: 'ಕನ್ನಡ (Kannada)', flag: '🐘' }
  ];

  const tabs = [
    { id: 'overview', label: t.tabOverview },
    { id: 'tracking', label: t.tabTracking },
    { id: 'cargo', label: t.tabCargo },
    { id: 'driver', label: t.tabDriver },
    { id: 'fleet', label: t.tabFleet },
    { id: 'alerts', label: t.tabAlerts },
    { id: 'trips', label: t.tabTrips },
    { id: 'documents', label: t.tabDocuments },
    { id: 'reports', label: t.tabReports },
    { id: 'testbench', label: t.tabTestbench }
  ];

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', zIndex: 1000, position: 'sticky', top: 0 }}>
      {/* Top Header Bar */}
      <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {t.title}
              </h1>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>MODE=LOCAL</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Multilingual Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Globe size={16} color="var(--accent-blue)" />
            <select
              value={lang}
              onChange={(e) => onLangChange(e.target.value as Language)}
              style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
            >
              {languages.map(l => (
                <option key={l.key} value={l.key} style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#3b82f6" />}
            <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
          </button>

          {/* Realtime Stream Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <div className={`pulse-dot ${isWsConnected ? 'pulse-dot-active' : 'pulse-dot-alert'}`} />
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: isWsConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {isWsConnected ? t.livePipelineActive : t.disconnected}
            </span>
          </div>

          {/* Role Switcher Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <User size={16} color="var(--accent-blue)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>{t.currentRole}</div>
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                style={{ background: 'transparent', color: 'var(--accent-blue)', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
              >
                {roles.map(r => (
                  <option key={r.key} value={r.key} style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div style={{ display: 'flex', gap: '4px', padding: '0 24px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
