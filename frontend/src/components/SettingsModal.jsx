import React from 'react';
import { useApp } from '../context/AppContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { theme, setThemePreference, accentColor, setAccentColorPreference } = useApp();

  if (!isOpen) return null;

  const themes = [
    { id: 'system', name: 'System', desc: 'Follow device color scheme', icon: '💻' },
    { id: 'light', name: 'Light', desc: 'Clean white academic interface', icon: '☀️' },
    { id: 'dark', name: 'Dark', desc: 'Deep slate modern dark mode', icon: '🌙' },
  ];

  const accents = [
    { id: 'blue', name: 'Classic Blue', hex: '#2563EB' },
    { id: 'emerald', name: 'Emerald', hex: '#059669' },
    { id: 'purple', name: 'Royal Purple', hex: '#7C3AED' },
    { id: 'orange', name: 'Sunset Orange', hex: '#EA580C' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md theme-card p-6 shadow-2xl animate-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <h3 className="text-base font-bold theme-text-primary">Appearance Preferences</h3>
            <p className="text-xs theme-text-muted">Customize EduHive theme and color scheme</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-500/10 theme-text-muted hover:theme-text-primary transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="py-5 space-y-6">
          
          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-3 theme-text-secondary">
              Interface Theme
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemePreference(t.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'border-2 shadow-sm font-semibold'
                        : 'hover:border-slate-400/40 opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'var(--surface-main)',
                      color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    <span className="text-lg mb-1">{t.icon}</span>
                    <span className="text-xs font-bold">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-3 theme-text-secondary">
              Accent Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {accents.map((a) => {
                const isActive = accentColor === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAccentColorPreference(a.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs font-medium ${
                      isActive ? 'border-2 font-bold shadow-sm' : 'hover:border-slate-400/40'
                    }`}
                    style={{
                      borderColor: isActive ? a.hex : 'var(--border-color)',
                      backgroundColor: isActive ? 'var(--primary-light)' : 'var(--surface-main)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: a.hex }}
                    />
                    <span className="truncate">{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
