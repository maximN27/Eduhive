import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import NotificationsModal from './NotificationsModal';

export default function Navbar({ onMobileMenuToggle }) {
  const {
    searchQuery,
    setSearchQuery,
    user: appUser,
    setIsSettingsOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications = [],
    navigateToProfile,
    openProfile,
    goHome
  } = useApp();

  let authUser = null;
  let logout = null;
  try {
    const authContext = useAuth();
    authUser = authContext?.user || null;
    logout = authContext?.logout || null;
  } catch (e) {
    // Fallback if rendered outside AuthContext
  }

  const user = authUser || appUser || {};
  const userName = user.name || user.username || 'Scholar';
  const userHandle = user.handle || (user.username ? `@${user.username}` : '@scholar');
  const userAvatar = user.avatar || user.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
  const userRole = user.role || 'Student';
  const userReputation = user.reputation !== undefined ? user.reputation : (user.streak ? user.streak * 250 : 120);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead && n.unread !== false).length;

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    if (logout) {
      await logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl transition-all duration-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div 
            onClick={goHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-600 shadow-lg shadow-cyan-600/30 flex items-center justify-center text-white transition-transform group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                EduHive
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Academic API
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar with Quick Search Tags */}
        <div className="flex-1 max-w-xl mx-auto flex flex-col items-center">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, subtopics, people, or posts..."
              className="w-full pl-10 pr-8 py-2 text-xs rounded-2xl bg-[#111A2E] text-white placeholder-slate-400 transition-all outline-none border border-cyan-500/20 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Search Tag Pills */}
          <div className="hidden sm:flex items-center gap-1.5 mt-1 text-[10px] theme-text-muted">
            <span className="opacity-70">Quick search:</span>
            {['FFT', 'React', 'Quantum', 'Discrete Math'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2 py-0.5 rounded-md bg-slate-800/60 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 transition-colors border border-slate-700/50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Notifications Button */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl border transition-colors hover:bg-slate-500/10 cursor-pointer text-slate-300 border-slate-800"
            title="Notifications"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount >= 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-slate-900">
                1
              </span>
            )}
          </button>

          {/* User Profile Button & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/30 transition-all focus:outline-none group cursor-pointer"
            >
              <img
                src={userAvatar}
                alt={userName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-cyan-500/30"
              />
              
              <div className="hidden lg:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-slate-100 leading-tight">
                  Dr. Alice Vance
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Instructor | Senior Lecturer
                </span>
                <span className="text-[10px] font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                  ⭐ 2500 SP
                </span>
              </div>

              <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold theme-text-primary">{userName}</p>
                      <p className="text-xs theme-text-muted">{userHandle}</p>
                    </div>
                  </div>
                  <div 
                    className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium uppercase tracking-wider"
                    style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}
                  >
                    <span>{userRole}</span>
                    <span className="font-bold">⚡ {userReputation} XP</span>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => { setShowProfileMenu(false); if (openProfile) openProfile(); else navigateToProfile(); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    👤 View Profile
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); setIsSettingsOpen(true); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    ⚙️ Appearance Settings
                  </button>
                </div>

                <div className="border-t pt-1 mt-1" style={{ borderColor: 'var(--border-color)' }}>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </header>
  );
}
