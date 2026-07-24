import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { user, savedPosts, savedResources, goHome } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [themeMode, setThemeMode] = useState('dark');
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Calendar dates representation (1 to 30 for July 2026)
  const streakDays = [1, 6, 17, 18, 24]; // highlighted active streak days
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Sticky Top Navigation Bar */}
      <Navbar onMobileMenuToggle={() => {}} />

      {/* Toast Notification Popup */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/30 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Profile Page Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 3-Column Profile Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== COLUMN 1: LEFT SIDEBAR (PROFILE NAVIGATION) ==================== */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Profile Navigation Menu Card */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                  Profile Navigation
                </h2>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={goHome}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => { setActiveTab('settings'); showToast("Opened Settings"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => { setActiveTab('achievements'); showToast("Opened Achievements"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'achievements'
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Achievements</span>
                </button>

                <button
                  onClick={() => { setActiveTab('preferences'); showToast("Opened Preferences"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => { setActiveTab('saved'); showToast("Viewing Saved Items"); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'saved'
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Saved</span>
                </button>
              </nav>
            </div>

            {/* Joined Communities Section */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xs font-bold tracking-wide text-slate-200 uppercase">
                  Joined Communities
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                      EDU
                    </span>
                    <span className="text-xs font-semibold text-slate-200">EduHive</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">14.2k</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                      🐍
                    </span>
                    <span className="text-xs font-semibold text-slate-200">Scholar Initiate</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">8.9k</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                      💬
                    </span>
                    <span className="text-xs font-semibold text-slate-200">Communicats</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">3.4k</span>
                </div>
              </div>
            </div>

            {/* Account Level Card */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Account Level</span>
                <span className="text-xs font-extrabold text-cyan-400 font-mono">Level 12</span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
                  style={{ width: '96.6%' }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>5800 / 6000 XP</span>
                <span className="text-indigo-400 font-bold">96%</span>
              </div>
            </div>

          </div>

          {/* ==================== COLUMN 2: CENTER PROFILE MAIN CONTENT ==================== */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Profile Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  {/* Circular Avatar with Ring & Verification Badge */}
                  <div className="relative group">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                      alt="Alex Johnson"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-indigo-500/50 group-hover:ring-cyan-400 transition-all shadow-2xl"
                    />
                    <div 
                      className="absolute bottom-1 right-1 bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white rounded-full p-1.5 ring-4 ring-slate-900 shadow-md"
                      title="Verified Student"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Name, Handle & Affiliation */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block font-mono">
                      @AlexJ
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Alex Johnson
                    </h1>
                    
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified Student
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-bold">
                        <span className="font-serif font-black">MIT</span>
                        MIT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile & Preferences Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => showToast("Edit Profile Modal Opened")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => showToast("Preferences Modal Opened")}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all active:scale-95"
                  >
                    Preferences
                  </button>
                </div>
              </div>
            </div>

            {/* 5-Day Streak & Calendar Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Left side: Streak info text */}
                <div className="space-y-2 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      5-Day Streak
                    </h2>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    5-Day streak increases your rank and profile status. With top study performance, keep your daily activity active!
                  </p>

                  <button 
                    onClick={() => showToast("Streak details: 5 consecutive active days!")}
                    className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 pt-1"
                  >
                    Learn more &gt;
                  </button>
                </div>

                {/* Right side: Interactive Monthly Calendar Grid */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 w-full md:w-auto shadow-inner">
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400 uppercase pb-2 mb-1 border-b border-slate-800">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                    {calendarDays.map((day) => {
                      const isStreak = streakDays.includes(day);
                      return (
                        <div
                          key={day}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono transition-all cursor-pointer ${
                            isStreak
                              ? 'bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white font-bold shadow-md shadow-indigo-500/30 ring-2 ring-cyan-300/40 scale-105'
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                          }`}
                          title={isStreak ? `Streak Active on Day ${day}` : `Day ${day}`}
                          onClick={() => showToast(isStreak ? `🔥 Streak active on July ${day}` : `July ${day}`)}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Full-width Level Up Banner */}
            <button
              onClick={() => showToast("Level up guide: Earn 200 XP to reach Level 13!")}
              className="w-full bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 border border-indigo-500/40 rounded-2xl p-4 text-center font-extrabold text-slate-100 hover:text-white shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="text-lg">⭐</span>
                <span className="text-sm tracking-wide">Level up to Level 13!</span>
                <svg className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>

            {/* 2-Column Grid: Personal Stats & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Stats Card */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-800 pb-2.5">
                  Personal Stats
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Questions Asked</span>
                    <span className="font-extrabold text-white font-mono bg-slate-800 px-2.5 py-1 rounded-lg">45</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Answers Given</span>
                    <span className="font-extrabold text-indigo-400 font-mono bg-slate-800 px-2.5 py-1 rounded-lg">78</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Resources Shared</span>
                    <span className="font-extrabold text-cyan-400 font-mono bg-slate-800 px-2.5 py-1 rounded-lg">12</span>
                  </div>
                </div>
              </div>

              {/* Interests & Skills Card */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-extrabold text-white tracking-wide border-b border-slate-800 pb-2.5">
                  Interests & Skills
                </h3>

                <div className="flex flex-wrap gap-2 pt-1">
                  {['Science', 'Hosting', 'Scientics', 'Worsiliwik', 'Python', 'Web Dev', 'Algorithms'].map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-200 text-xs font-semibold border border-slate-700/60 hover:border-indigo-500/50 hover:text-white transition-all cursor-pointer"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Professor Connections Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  Professor Connections
                </h3>
                <button 
                  onClick={() => showToast("Viewing connections filtering")}
                  className="text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Conflicting Views
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    alt="Dr. Aris Thorne"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Dr. Aris Thorne</p>
                    <p className="text-[11px] text-indigo-400 font-medium">Professor of Computer Science</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                    alt="Prof. David Vance"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/40"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Prof. David Vance</p>
                    <p className="text-[11px] text-cyan-400 font-medium">Math Department Chair</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ==================== COLUMN 3: RIGHT SIDEBAR (GAMIFICATION HUB) ==================== */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Gamification Hub Card */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                    Gamification Hub
                  </h2>
                </div>

                {/* Light / Dark Mode Icon Toggle */}
                <button
                  onClick={() => {
                    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
                    setThemeMode(nextMode);
                    showToast(`Theme preview mode: ${nextMode}`);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Toggle Theme Preview"
                >
                  {themeMode === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>

              {/* Earned Badges Subsection */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Earned Badges
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-lg flex items-center justify-center shrink-0 border border-amber-500/30">
                      🐍
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Top Contributor - Python</p>
                      <p className="text-[10px] text-slate-400">Uniqued badges</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-lg flex items-center justify-center shrink-0 border border-indigo-500/30">
                      🏆
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Scholar Initiate</p>
                      <p className="text-[10px] text-slate-400">Uniqued badges</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-lg flex items-center justify-center shrink-0 border border-cyan-500/30">
                      💻
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Code Crafter</p>
                      <p className="text-[10px] text-slate-400">Uniqued badges</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Leaderboard Standings */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Community Leaderboard Standings
                </h3>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-extrabold text-xs flex items-center justify-center shadow-md">
                      4
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                      alt="Alex"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Alex</p>
                      <p className="text-[10px] text-emerald-400 font-medium">1 position up</p>
                    </div>
                  </div>

                  <span className="text-base">🏆</span>
                </div>
              </div>

              {/* Saved Resources Subsection */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Saved Resources
                </h3>

                <div className="space-y-2">
                  {savedResources.slice(0, 2).map((res) => (
                    <div key={res.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-indigo-500/30 transition-all">
                      <div className="flex items-start gap-2.5">
                        <span className="text-base shrink-0">{res.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-200 truncate">{res.title}</p>
                          <p className="text-[10px] text-indigo-400 font-mono mt-0.5">{res.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Posts Subsection */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Saved Posts
                </h3>

                <div className="space-y-2">
                  {savedPosts.slice(0, 2).map((post) => (
                    <div 
                      key={post.id} 
                      onClick={goHome}
                      className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1">{post.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">by {post.author.name}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduHive Academic Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
