import React from 'react';
import { useApp } from '../context/AppContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { theme, setThemePreference, accentColor, setAccentColorPreference } = useApp();

  if (!isOpen) return null;

  const themes = [
    { id: 'system', name: 'System', desc: 'Auto OS scheme', icon: '💻' },
    { id: 'light', name: 'Light Mode', desc: 'Clean academic view', icon: '☀️' },
    { id: 'dark', name: 'Dark Mode', desc: 'Sleek dark glass', icon: '🌙' },
  ];

  const accents = [
    { id: 'blue', name: 'Cyan Quantum', hex: '#06B6D4', glow: 'rgba(6, 182, 212, 0.4)' },
    { id: 'emerald', name: 'Emerald Bio', hex: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    { id: 'purple', name: 'Royal Violet', hex: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
    { id: 'orange', name: 'Sunset Amber', hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0F172A]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 animate-in zoom-in-95 duration-150 space-y-6 text-white"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl font-bold">
              🎨
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Appearance Preferences</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customize EduHive interface theme and glowing accent scheme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          
          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Interface Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemePreference(t.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 font-bold scale-[1.03]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl mb-2">{t.icon}</span>
                    <span className="text-xs font-bold text-slate-100">{t.name}</span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color Selection */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
              Glowing Accent Scheme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {accents.map((a) => {
                const isActive = accentColor === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAccentColorPreference(a.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 font-bold scale-[1.02]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-md transition-transform"
                      style={{
                        backgroundColor: a.hex,
                        boxShadow: isActive ? `0 0 12px ${a.glow}` : 'none'
                      }}
                    />
                    <span className="truncate">{a.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            Apply & Save Preferences ✓
          </button>
        </div>

      </div>
    </div>
  );
}
