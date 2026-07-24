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
    <header className="sticky top-0 z-40 theme-navbar transition-all duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg theme-text-muted hover:theme-text-primary hover:bg-slate-500/10 focus:outline-none cursor-pointer"
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
            <div 
              className="w-9 h-9 rounded-xl p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight theme-text-primary">
                EduHive
              </span>
              <span 
                className="hidden sm:inline-block text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
              >
                Academic API
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none theme-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, subtopics, or posts (e.g. algorithms, #react)..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl theme-text-primary placeholder:theme-text-muted transition-all outline-none"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center theme-text-muted hover:theme-text-primary cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Notifications Button */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl border transition-colors hover:bg-slate-500/10 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            title="Notifications"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2" style={{ backgroundColor: 'var(--primary)', ringColor: 'var(--card-bg)' }}></span>
            )}
          </button>

          {/* User Profile Button & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl border transition-all hover:bg-slate-500/5 focus:outline-none group cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-lg object-cover ring-2 transition-all"
                style={{ ringColor: 'var(--primary-border)' }}
              />
              
              <div className="hidden lg:flex flex-col text-left pr-1">
                <span className="text-xs font-bold theme-text-primary leading-tight">
                  {userName}
                </span>
                <span className="text-[9px] font-semibold" style={{ color: 'var(--primary)' }}>
                  ⚡ {userReputation} XP
                </span>
              </div>

              <svg className={`w-3.5 h-3.5 theme-text-muted transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
