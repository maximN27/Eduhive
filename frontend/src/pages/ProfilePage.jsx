import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, savedPosts, savedResources, goHome, setIsSettingsOpen } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const streakDays = [1, 6, 17, 18, 24];

  return (
    <div className="min-h-screen ambient-bg theme-text-primary flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Sticky Top Navigation Bar */}
      <Navbar onMobileMenuToggle={() => {}} />

      {/* Toast Notification Popup */}
      {notification && (
        <div 
          className="fixed bottom-5 right-5 z-50 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Profile Container spanning full screen width with ~20px margins */}
      <main className="flex-1 w-full px-5 sm:px-6 lg:px-8 py-5">
        
        {/* 3-Column Profile Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== COLUMN 1: LEFT SIDEBAR (NAVIGATION - REDUCED WIDTH) ==================== */}
          <div className="hidden lg:block lg:col-span-2 sticky top-[84px] space-y-4">
            
            <div className="theme-card p-5">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
                  Profile Menu
                </h2>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={goHome}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 transition-all"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard Feed</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'profile' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 transition-all"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Appearance & Theme</span>
                </button>

                <button
                  onClick={() => { setActiveTab('achievements'); showToast("Viewing Achievements"); }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'achievements' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'achievements' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Achievements</span>
                </button>
              </nav>
            </div>

            {/* Academic Bio Card */}
            <div className="theme-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider theme-text-secondary">Academic Bio</h3>
              <p className="text-xs theme-text-secondary leading-relaxed">
                Computer Science & AI Researcher exploring graph neural networks, system optimization, and algorithmic efficiency.
              </p>
              <div className="pt-2 border-t text-[11px] theme-text-muted space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                <div>📍 Stanford AI Lab</div>
                <div>🗓️ Joined Jan 2025</div>
              </div>
            </div>

          </div>

          {/* ==================== COLUMN 2: CENTER SECTION (PROFILE DETAILS) ==================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Profile Hero Card */}
            <div className="theme-card p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 shadow-lg shrink-0"
                  style={{ ringColor: 'var(--primary-border)' }}
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h1 className="text-xl font-bold theme-text-primary">{user.name}</h1>
                      <p className="text-xs theme-text-muted font-mono">{user.handle}</p>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold border inline-block"
                      style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
                    >
                      ⚡ {user.reputation} XP
                    </span>
                  </div>

                  <p className="text-xs font-medium mt-1" style={{ color: 'var(--primary)' }}>
                    {user.role}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t text-xs" style={{ borderColor: 'var(--border-color)' }}>
                    <div><span className="font-bold theme-text-primary">14</span> <span className="theme-text-muted">Posts</span></div>
                    <div><span className="font-bold theme-text-primary">{savedPosts.length}</span> <span className="theme-text-muted">Saved</span></div>
                    <div><span className="font-bold theme-text-primary">{savedResources.length}</span> <span className="theme-text-muted">Resources</span></div>
                    <div><span className="font-bold theme-text-primary">5</span> <span className="theme-text-muted">Streak</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak & Activity Grid */}
            <div className="theme-card p-6">
              <h3 className="text-sm font-bold theme-text-primary mb-3">Daily Study Streak (July 2026)</h3>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono">
                {calendarDays.map(day => {
                  const isStreak = streakDays.includes(day);
                  return (
                    <div
                      key={day}
                      className="p-2 rounded-lg border flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: isStreak ? 'var(--primary)' : 'var(--surface-main)',
                        color: isStreak ? '#FFFFFF' : 'var(--text-muted)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <span>{day}</span>
                      {isStreak && <span className="text-[10px]">🔥</span>}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ==================== COLUMN 3: RIGHT SIDEBAR ==================== */}
          <div className="lg:col-span-3 space-y-6">
            <div className="theme-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider theme-text-secondary mb-3">Badges & Honors</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xl">🥇</span>
                  <div>
                    <p className="text-xs font-bold theme-text-primary">Top Contributor</p>
                    <p className="text-[10px] theme-text-muted">100+ helpful answers</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl border flex items-center gap-3" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
                  <span className="text-xl">🔥</span>
                  <div>
                    <p className="text-xs font-bold theme-text-primary">Scholar Streak</p>
                    <p className="text-[10px] theme-text-muted">Active 5 days in a row</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs theme-text-muted">
          <p>© {new Date().getFullYear()} EduHive Academic Profile Dashboard.</p>
        </div>
      </footer>

    </div>
  );
}
