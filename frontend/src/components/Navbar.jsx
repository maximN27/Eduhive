import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar({ onMobileMenuToggle }) {
  const { searchQuery, setSearchQuery, user, savedPosts, savedResources, clearFilters, setIsSettingsOpen } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 theme-navbar transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg theme-text-muted hover:theme-text-primary hover:bg-slate-500/10 focus:outline-none"
            aria-label="Toggle Navigation Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div 
            onClick={clearFilters}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div 
              className="w-10 h-10 rounded-xl p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight theme-text-primary">
                EduHive
              </span>
              <span 
                className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
              >
                Academic
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none theme-text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, subtopics, or posts (e.g. algorithms, #react)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl theme-text-primary placeholder:theme-text-muted transition-all outline-none"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center theme-text-muted hover:theme-text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Notification Button */}
          <button 
            className="relative p-2.5 rounded-xl border transition-colors hover:bg-slate-500/10"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2" style={{ backgroundColor: 'var(--primary)', ringColor: 'var(--card-bg)' }}></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 rounded-xl border transition-all hover:bg-slate-500/5 focus:outline-none group"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover ring-2 transition-all"
                style={{ ringColor: 'var(--primary-border)' }}
              />
              
              <div className="hidden lg:flex flex-col text-left pr-1">
                <span className="text-xs font-bold theme-text-primary leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--primary)' }}>
                  ⚡ {user.reputation} XP
                </span>
              </div>

              <svg className={`w-4 h-4 theme-text-muted transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu Modal */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-bold theme-text-primary">{user.name}</p>
                      <p className="text-xs theme-text-muted">{user.handle}</p>
                    </div>
                  </div>
                  <div 
                    className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-medium"
                    style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}
                  >
                    <span>{user.role}</span>
                    <span className="font-bold">⚡ {user.reputation} XP</span>
                  </div>
                </div>

                <div className="py-2">
                  <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider theme-text-muted">
                    Quick Stats
                  </div>
                  <div className="px-4 py-1 flex justify-between text-xs theme-text-secondary">
                    <span>Saved Posts</span>
                    <span className="font-semibold" style={{ color: 'var(--primary)' }}>{savedPosts.length}</span>
                  </div>
                  <div className="px-4 py-1 flex justify-between text-xs theme-text-secondary">
                    <span>Saved Resources</span>
                    <span className="font-semibold" style={{ color: 'var(--primary)' }}>{savedResources.length}</span>
                  </div>
                </div>

                <div className="border-t pt-1 mt-1" style={{ borderColor: 'var(--border-color)' }}>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Appearance & Theme Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
