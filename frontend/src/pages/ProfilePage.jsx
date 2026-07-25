import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { 
    user, 
    updateUser,
    savedPosts, 
    savedResources, 
    toggleSavePost,
    toggleSaveResource,
    openPost,
    goHome, 
    setIsSettingsOpen, 
    theme, 
    setTheme, 
    accentColor, 
    setAccentColor,
    posts
  } = useApp();

  // Active Tab Management: 'overview', 'dashboard', 'settings', 'achievements', 'saved', 'social'
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsSubTab, setSettingsSubTab] = useState('account'); // 'account', 'privacy', 'notifications', 'appearance'

  // Edit Bio & Avatar Modal States
  const [bioText, setBioText] = useState(user.bio || 'Computer Science & AI Researcher exploring graph neural networks, system optimization, and algorithmic efficiency.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [newAvatarInput, setNewAvatarInput] = useState('');

  // Collections & Saved Content State
  const [collections, setCollections] = useState([
    { id: 'c1', name: 'Must Read Papers', count: 4, icon: '📚' },
    { id: 'c2', name: 'Watch Later Lectures', count: 6, icon: '🎬' },
    { id: 'c3', name: 'System Design Guides', count: 2, icon: '⚡' }
  ]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');

  // Social & Connections State
  const [connections, setConnections] = useState([
    { id: 'u1', name: 'Dr. Aris Vance', role: 'Professor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', mutuals: 12 },
    { id: 'u2', name: 'Bob Miller', role: 'Graduate TA', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', mutuals: 8 },
    { id: 'u3', name: 'Elena Rostova', role: 'Researcher', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', mutuals: 15 }
  ]);
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'req1', name: 'Marcus Chen', role: 'Student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' }
  ]);
  
  // Interactive Conversations Engine State
  const [conversations, setConversations] = useState({
    'u1': {
      id: 'u1',
      name: 'Dr. Aris Vance',
      handle: '@aris_vance',
      role: 'Professor of CS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      status: 'Online 🟢',
      messages: [
        { id: 1, sender: 'them', text: 'Hey Alice! Saw your paper on Graph Neural Nets, super inspiring!', time: '10:15 AM' },
        { id: 2, sender: 'me', text: 'Thanks Aris! Feel free to check out the benchmark results.', time: '10:18 AM' },
        { id: 3, sender: 'them', text: 'Will do! What is the throughput improvement in SIMD vectorization?', time: '10:20 AM' }
      ]
    },
    'u2': {
      id: 'u2',
      name: 'Bob Miller',
      handle: '@bob_m',
      role: 'Graduate TA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      status: 'Online 🟢',
      messages: [
        { id: 1, sender: 'them', text: 'Professor, the assignment grading rubric for CS 201 has been posted.', time: 'Yesterday' },
        { id: 2, sender: 'me', text: 'Great work Bob! Make sure office hours are updated in the portal.', time: 'Yesterday' }
      ]
    },
    'u3': {
      id: 'u3',
      name: 'Elena Rostova',
      handle: '@elena_r',
      role: 'Robotics Researcher',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      status: 'Last seen 15m ago',
      messages: [
        { id: 1, sender: 'them', text: 'Are you attending the NeurIPS Workshop next week?', time: 'Jul 22' },
        { id: 2, sender: 'me', text: 'Yes, presenting our microcircuit optimization findings on Tuesday!', time: 'Jul 22' }
      ]
    },
    'ai-group': {
      id: 'ai-group',
      name: 'AI Lab Group Chat',
      handle: '@stanford_ailab',
      role: '8 Scholars',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
      status: 'Group • 8 Members',
      messages: [
        { id: 1, sender: 'them', text: 'Marcus Chen: Paper submission deadline has been extended to August 5th!', time: '2 days ago' },
        { id: 2, sender: 'me', text: 'Awesome news! Gives us extra time to run the GPU ablation tests.', time: '2 days ago' }
      ]
    }
  });

  const [activeContactId, setActiveContactId] = useState('u1');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatInputText, setChatInputText] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const [isTypingReply, setIsTypingReply] = useState(false);
  const attachmentInputRef = React.useRef(null);

  // Send message with automatic scholar reply simulation
  const handleSendMessage = () => {
    if (!chatInputText.trim() && !chatAttachment) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: chatInputText.trim(),
      attachment: chatAttachment,
      time: 'Just now'
    };

    const targetId = activeContactId;

    setConversations(prev => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        messages: [...(prev[targetId]?.messages || []), newMsg]
      }
    }));

    setChatInputText('');
    setChatAttachment(null);
    setIsTypingReply(true);

    // Realistic automated scholar response simulation
    setTimeout(() => {
      const activeContact = conversations[targetId];
      const scholarReplies = [
        `That's a very insightful point regarding vectorization throughput! I will test this in our lab benchmark tomorrow.`,
        `Got it! I will update the course materials and research notes right away.`,
        `Fascinating approach! Let's connect at the workshop to discuss scaling this further.`,
        `Appreciate the update! We are integrating this into the GNN optimization pipeline now.`
      ];
      const randomReply = scholarReplies[Math.floor(Math.random() * scholarReplies.length)];

      const replyMsg = {
        id: Date.now() + 1,
        sender: 'them',
        text: randomReply,
        time: 'Just now'
      };

      setConversations(prev => ({
        ...prev,
        [targetId]: {
          ...prev[targetId],
          messages: [...(prev[targetId]?.messages || []), replyMsg]
        }
      }));

      setIsTypingReply(false);
    }, 1200);
  };

  // Settings State
  const [displayName, setDisplayName] = useState(user.name);
  const [userHandle, setUserHandle] = useState(user.handle);
  const [customUrl, setCustomUrl] = useState('eduhive.org/u/alice_vance');
  const [privacyVisibility, setPrivacyVisibility] = useState('public');
  const [activityPrivacy, setActivityPrivacy] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailLikes, setEmailLikes] = useState(true);
  const [emailComments, setEmailComments] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  // Notification Toast
  const [notification, setNotification] = useState(null);
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const streakDays = [1, 6, 17, 18, 24];

  // Handle Export Data
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      profile: { name: user.name, handle: user.handle, bio: bioText, role: user.role },
      collections,
      activity: ["Liked post #12", "Created post #4"],
      exportedAt: new Date().toISOString()
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eduhive_profile_export_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Downloaded personal profile archive (JSON)");
  };

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

      {/* Main Profile Container */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
        {/* 3-Column Profile Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== COLUMN 1: NAVIGATION SIDEBAR ==================== */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="theme-card p-5">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <h2 className="text-xs font-bold tracking-wider uppercase theme-text-secondary">
                  Command Menu
                </h2>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={goHome}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 transition-all"
                >
                  <span>🏠</span>
                  <span>Home Feed</span>
                </button>

                <button
                  onClick={() => setActiveTab('overview')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'overview' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>👤</span>
                  <span>Core Profile Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'dashboard' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>📊</span>
                  <span>Dashboard & Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'settings' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>⚙️</span>
                  <span>Settings & Preferences</span>
                </button>

                <button
                  onClick={() => setActiveTab('achievements')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'achievements' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'achievements' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>🏆</span>
                  <span>Achievements & Level</span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'saved' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'saved' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>🔖</span>
                  <span>Saved & Collections</span>
                </button>

                <button
                  onClick={() => setActiveTab('social')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === 'social' ? 'var(--primary-light)' : 'transparent',
                    color: activeTab === 'social' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span>💬</span>
                  <span>Social & Messaging</span>
                </button>
              </nav>
            </div>

            {/* Academic Bio Card */}
            <div className="theme-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-xs font-bold uppercase tracking-wider theme-text-secondary">Academic Bio</h3>
                <button 
                  onClick={() => {
                    const nextVal = !isEditingBio;
                    setIsEditingBio(nextVal);
                    if (!nextVal && updateUser) {
                      updateUser({ bio: bioText });
                      showToast("Academic bio saved!");
                    }
                  }}
                  className="text-[11px] font-bold underline"
                  style={{ color: 'var(--primary)' }}
                >
                  {isEditingBio ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingBio ? (
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border theme-card focus:outline-none"
                  style={{ borderColor: 'var(--border-color)' }}
                  rows={3}
                />
              ) : (
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {bioText}
                </p>
              )}

              <div className="pt-2 border-t text-[11px] theme-text-muted space-y-1" style={{ borderColor: 'var(--border-color)' }}>
                <div>📍 Stanford AI Lab</div>
                <div>🎓 Member Since Jan 2025</div>
                <div>🌐 {customUrl}</div>
              </div>
            </div>

          </div>

          {/* ==================== COLUMN 2 & 3: MAIN DYNAMIC CONTENT HUB ==================== */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB I: CORE PROFILE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Header Profile Hero Card */}
                <div className="theme-card p-6 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 backdrop-blur-xl border theme-border">
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    
                    {/* Left: Avatar & Identity */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
                      <div className="relative group cursor-pointer shrink-0" onClick={() => setIsAvatarModalOpen(true)}>
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[10px] font-bold">Change</span>
                        </div>
                      </div>

                      <div className="text-center sm:text-left space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <h1 className="text-2xl font-extrabold tracking-tight theme-text-primary">{displayName}</h1>
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm" title="Verified Scholar">
                            ✓
                          </span>
                        </div>
                        <p className="text-xs theme-text-muted font-mono">{userHandle}</p>
                        <p className="text-xs font-semibold text-indigo-400 dark:text-indigo-300 pt-0.5">
                          {user.role} • Associate Professor & AI Researcher
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 pt-3 border-t theme-border text-xs">
                          <div><span className="font-extrabold theme-text-primary">14</span> <span className="theme-text-muted">Posts</span></div>
                          <span className="theme-text-muted">•</span>
                          <div><span className="font-extrabold theme-text-primary">{savedPosts.length}</span> <span className="theme-text-muted">Bookmarked</span></div>
                          <span className="theme-text-muted">•</span>
                          <div><span className="font-extrabold theme-text-primary">{savedResources.length}</span> <span className="theme-text-muted">Resources</span></div>
                          <span className="theme-text-muted">•</span>
                          <div><span className="font-extrabold theme-text-primary">{connections.length}</span> <span className="theme-text-muted">Connections</span></div>
                          <span className="theme-text-muted">•</span>
                          <div><span className="font-extrabold theme-text-primary">5 Days</span> <span className="theme-text-muted">Streak 🔥</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Academic Seals & Connections Card */}
                    <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-sm shadow-md" title="Stanford AI Lab">
                          🏛️
                        </span>
                        <span className="w-8 h-8 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-sm shadow-md" title="MIT Research Affiliate">
                          🎓
                        </span>
                      </div>

                      {/* Network Overview Mini Card */}
                      <div className="theme-card p-2.5 rounded-2xl bg-slate-900/80 border theme-border flex items-center gap-3">
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">Network Overview</p>
                          <p className="text-xs font-extrabold theme-text-primary">{connections.length} Connections</p>
                        </div>
                        <div className="flex -space-x-2 overflow-hidden">
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Connect 1" />
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Connect 2" />
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Connect 3" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Daily Study Streak Calendar (Heat Map Fills) */}
                <div className="theme-card p-6 border theme-border">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b theme-border">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary flex items-center gap-2">
                      <span>🔥</span> Daily Study Streak (July 2026)
                    </h3>
                    <span className="text-[11px] font-mono theme-text-muted">Month Active Days (5, 2026)</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-mono">
                    {calendarDays.map(day => {
                      const isStreak = streakDays.includes(day);
                      const isTodayActive = day === 24;

                      let styleClasses = "bg-slate-900/60 text-slate-400 border-slate-800/80";
                      if (isTodayActive) {
                        styleClasses = "bg-indigo-600/30 text-indigo-200 border-indigo-500 ring-2 ring-indigo-500/40 font-bold shadow-md shadow-indigo-950/40";
                      } else if (isStreak) {
                        styleClasses = "bg-gradient-to-br from-red-800 via-orange-700 to-amber-600 text-white border-orange-500/50 shadow-lg shadow-orange-950/50 font-extrabold";
                      }

                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 ${styleClasses}`}
                        >
                          <span className="text-xs">{day}</span>
                          {(isStreak || isTodayActive) && <span className="text-xs mt-0.5">🔥</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="theme-card p-6 space-y-4 border theme-border">
                  <div className="flex items-center justify-between pb-2 border-b theme-border">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary">
                      Recent Activity Timeline
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      CURATED RESEARCH INSIGHTS
                    </span>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Activity Item 1 */}
                    <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border theme-border bg-slate-900/50 hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-base shrink-0">
                          📄
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold theme-text-primary">Published Research Post</p>
                          <p className="text-[11px] theme-text-muted truncate">Graph Neural Networks for Microcircuit Optimisation</p>
                        </div>
                      </div>
                      <div className="w-16 h-10 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <svg className="w-full h-full text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5h16M4 12h16M4 19h10" />
                        </svg>
                      </div>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border theme-border bg-slate-900/50 hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-base shrink-0">
                          💬
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold theme-text-primary">Contributed to Community</p>
                          <p className="text-[11px] theme-text-muted truncate">Thread: SIMD Vectorisation performance gains</p>
                        </div>
                      </div>
                      <div className="w-16 h-10 rounded-lg bg-slate-950 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <span className="text-[9px] font-mono text-cyan-400">// simd.cpp</span>
                      </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border theme-border bg-slate-900/50 hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-base shrink-0">
                          📑
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold theme-text-primary">Upvoted & Abstract Summarized</p>
                          <p className="text-[11px] theme-text-muted truncate">Interactive Graph Algorithms Visualization</p>
                        </div>
                      </div>
                      <div className="w-16 h-10 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <span className="text-[9px] font-mono text-amber-400">PDF Abstract</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* TAB II: DASHBOARD & ANALYTICS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* Research Impact Stats Top Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="theme-card p-4 bg-slate-900/80 border theme-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">Research Impact</p>
                    <p className="text-2xl font-extrabold theme-text-primary mt-1">53.7k</p>
                    <span className="text-[10px] text-indigo-400 font-bold">Citation S</span>
                  </div>

                  <div className="theme-card p-4 bg-slate-900/80 border theme-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">Citations</p>
                    <p className="text-2xl font-extrabold theme-text-primary mt-1">13.7k</p>
                    <span className="text-[10px] text-emerald-400 font-bold">Citations</span>
                  </div>

                  <div className="theme-card p-4 bg-slate-900/80 border theme-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">Citation 2</p>
                    <p className="text-2xl font-extrabold theme-text-primary mt-1">15.7k</p>
                    <span className="text-[10px] text-purple-400 font-bold">Citation 2</span>
                  </div>

                  <div className="theme-card p-4 bg-slate-900/80 border theme-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider theme-text-muted">Read Time</p>
                    <p className="text-2xl font-extrabold theme-text-primary mt-1">42h</p>
                    <span className="text-[10px] text-amber-400 font-bold">Citations</span>
                  </div>
                </div>

                {/* Main Graph & Area Chart Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left (2 cols): Citation & Publication Trend Line Chart */}
                  <div className="lg:col-span-2 theme-card p-6 border theme-border bg-slate-900/80 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b theme-border">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary">
                        Citation & Publication Trend (Last 6 Months)
                      </h3>
                      <span className="text-[10px] font-mono theme-text-muted">Jan - Jun</span>
                    </div>

                    {/* Smooth Area Curve Graph SVG */}
                    <div className="h-44 w-full relative pt-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,130 Q 80,120 160,90 T 320,40 T 500,20 L 500,150 L 0,150 Z"
                          fill="url(#purpleGradient)"
                        />
                        <path
                          d="M 0,130 Q 80,120 160,90 T 320,40 T 500,20"
                          fill="none"
                          stroke="#818CF8"
                          strokeWidth="3"
                        />
                      </svg>

                      {/* X-Axis Labels */}
                      <div className="flex justify-between text-[10px] font-mono theme-text-muted pt-2 border-t theme-border">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>

                  {/* Right (1 col): Research Area Contribution Donut/Pie Chart */}
                  <div className="theme-card p-6 border theme-border bg-slate-900/80 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b theme-border">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary">
                        Research Area Contribution
                      </h3>
                      <div className="flex gap-1 text-[9px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Research</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Monthly</span>
                      </div>
                    </div>

                    {/* Donut Chart SVG */}
                    <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#312E81"
                            strokeWidth="5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="5"
                            strokeDasharray="40, 100"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#A855F7"
                            strokeWidth="5"
                            strokeDasharray="30, 100"
                            strokeDashoffset="-40"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="5"
                            strokeDasharray="30, 100"
                            strokeDashoffset="-70"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xs theme-text-primary">
                          100%
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="text-[10px] space-y-1 text-left w-full pt-2 border-t theme-border">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                          <span className="theme-text-muted">GNNs 40%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                          <span className="theme-text-muted">System Optimization 30%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="theme-text-muted">Algorithmic Efficiency 30%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Key Project Progress Bars */}
                <div className="theme-card p-6 border theme-border bg-slate-900/80 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary border-b pb-2 theme-border">
                    Key Project Progress
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <div className="flex justify-between theme-text-secondary">
                        <span>GNN Microcircuit Optimization</span>
                        <span className="text-indigo-400 font-bold">75% complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between theme-text-secondary">
                        <span>SIMD Project Optimization</span>
                        <span className="text-indigo-400 font-bold">73% complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '73%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between theme-text-secondary">
                        <span>K-placement Progress</span>
                        <span className="text-purple-400 font-bold">75% complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Algorithmic Efficiency</span>
                        <span className="text-amber-400 font-bold">32% complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '32%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB III: SETTINGS & PREFERENCES */}
            {activeTab === 'settings' && (
              <div className="theme-card p-6 space-y-6">
                <div className="flex border-b pb-3 gap-4 text-xs font-bold" style={{ borderColor: 'var(--border-color)' }}>
                  <button 
                    onClick={() => setSettingsSubTab('account')}
                    className={`pb-2 border-b-2 transition-all ${settingsSubTab === 'account' ? 'border-indigo-500 text-indigo-400' : 'theme-text-muted'}`}
                  >
                    Account Management
                  </button>
                  <button 
                    onClick={() => setSettingsSubTab('privacy')}
                    className={`pb-2 border-b-2 transition-all ${settingsSubTab === 'privacy' ? 'border-indigo-500 text-indigo-400' : 'theme-text-muted'}`}
                  >
                    Privacy & Security
                  </button>
                  <button 
                    onClick={() => setSettingsSubTab('notifications')}
                    className={`pb-2 border-b-2 transition-all ${settingsSubTab === 'notifications' ? 'border-indigo-500 text-indigo-400' : 'theme-text-muted'}`}
                  >
                    Notifications
                  </button>
                  <button 
                    onClick={() => setSettingsSubTab('appearance')}
                    className={`pb-2 border-b-2 transition-all ${settingsSubTab === 'appearance' ? 'border-indigo-500 text-indigo-400' : 'theme-text-muted'}`}
                  >
                    Integrations & Theme
                  </button>
                </div>

                {/* Sub-Tab: Account */}
                {settingsSubTab === 'account' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Display Name</label>
                      <input 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border theme-card"
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Username / Handle</label>
                      <input 
                        type="text" 
                        value={userHandle} 
                        onChange={(e) => setUserHandle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border theme-card"
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (updateUser) {
                          updateUser({ name: displayName, handle: userHandle });
                        }
                        showToast("Account settings saved successfully!");
                      }}
                      className="px-4 py-2 text-white rounded-xl font-bold text-xs"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      Save Account Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB IV: ACHIEVEMENTS & GAMIFICATION */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                
                {/* Level Progress Hexagon Header Bar */}
                <div className="theme-card p-6 border theme-border bg-slate-900/90 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-xl font-extrabold text-indigo-400 shrink-0 shadow-lg shadow-indigo-950/50">
                      5
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-xs font-extrabold theme-text-primary">
                        <span>Level 5 to Level 6</span>
                        <span className="text-indigo-400 font-mono">2270 XP | Level 5 to 1,250 XP</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 rounded-full transition-all duration-500" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xl font-extrabold theme-text-muted shrink-0">
                      6
                    </div>
                  </div>
                </div>

                {/* Badge Gallery */}
                <div className="theme-card p-6 border theme-border space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary border-b pb-2 theme-border">
                    Badge Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    
                    {/* Unlocked Badges */}
                    <div className="p-4 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 text-center space-y-1.5 shadow-md">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-xl">
                        🏅
                      </div>
                      <p className="text-xs font-extrabold theme-text-primary">Algorithm Master</p>
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ Unlocked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-center space-y-1.5 shadow-md">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-xl">
                        ⭐
                      </div>
                      <p className="text-xs font-extrabold theme-text-primary">Top Contributor</p>
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ Unlocked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-cyan-500/10 border-cyan-500/30 text-center space-y-1.5 shadow-md">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-xl">
                        👥
                      </div>
                      <p className="text-xs font-extrabold theme-text-primary">Community Beacon</p>
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ Unlocked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-rose-500/10 border-rose-500/30 text-center space-y-1.5 shadow-md">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-xl">
                        🔥
                      </div>
                      <p className="text-xs font-extrabold theme-text-primary">Streak Keeper</p>
                      <span className="text-[9px] text-emerald-400 font-bold block">✓ Unlocked</span>
                    </div>

                    {/* Locked Badges */}
                    <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-800 text-center space-y-1.5 opacity-60">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                        🔒
                      </div>
                      <p className="text-xs font-bold theme-text-primary">Community Beacon</p>
                      <span className="text-[9px] theme-text-muted block">Locked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-800 text-center space-y-1.5 opacity-60">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                        🔒
                      </div>
                      <p className="text-xs font-bold theme-text-primary">Algorithm Master</p>
                      <span className="text-[9px] theme-text-muted block">Locked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-800 text-center space-y-1.5 opacity-60">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                        🔒
                      </div>
                      <p className="text-xs font-bold theme-text-primary">Community Beacon</p>
                      <span className="text-[9px] theme-text-muted block">Locked</span>
                    </div>

                    <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-800 text-center space-y-1.5 opacity-60">
                      <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                        🔒
                      </div>
                      <p className="text-xs font-bold theme-text-primary">Streak Keeper</p>
                      <span className="text-[9px] theme-text-muted block">Locked</span>
                    </div>

                  </div>
                </div>

                {/* Milestone Progress */}
                <div className="theme-card p-6 border theme-border space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary border-b pb-2 theme-border">
                    Milestone Progress
                  </h3>

                  <div className="space-y-3 text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Publish 10 Papers</span>
                        <span className="text-indigo-400 font-mono">10/10</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Answer 50 Questions</span>
                        <span className="text-indigo-400 font-mono">17/50</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '34%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Answer 50 Questions</span>
                        <span className="text-indigo-400 font-mono">30/50</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between theme-text-secondary">
                        <span>Top Posts</span>
                        <span className="text-indigo-400 font-mono">10/10</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB V: SAVED CONTENT & CUSTOM COLLECTIONS */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                
                {/* Search & Filter Header Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 theme-card p-4 border theme-border bg-slate-900/80">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search saved resources, papers & tags..."
                      value={savedSearchQuery}
                      onChange={(e) => setSavedSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl theme-surface theme-text-primary placeholder:text-slate-500 border theme-border outline-none focus:border-indigo-500"
                    />
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="text" 
                      placeholder="New folder name..." 
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="text-xs p-2 rounded-xl border theme-card flex-1 sm:w-40"
                      style={{ borderColor: 'var(--border-color)' }}
                    />
                    <button 
                      onClick={() => {
                        if (!newCollectionName.trim()) return;
                        setCollections(prev => [...prev, { id: `c-${Date.now()}`, name: newCollectionName.trim(), count: 0, icon: '📁' }]);
                        setNewCollectionName('');
                        showToast("Created new collection folder!");
                      }}
                      className="px-3.5 py-2 rounded-xl text-white text-xs font-bold shrink-0 bg-indigo-600 hover:bg-indigo-500"
                    >
                      + Folder
                    </button>
                  </div>
                </div>

                {/* Purple Folder Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  
                  <div 
                    onClick={() => setSelectedCollection('all')}
                    className={`theme-card p-4 border theme-border transition-all cursor-pointer space-y-2 group ${selectedCollection === 'all' ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30' : 'bg-slate-900/80 hover:border-indigo-500/40'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      📚
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold theme-text-primary truncate">All Saved Items</h4>
                      <p className="text-[10px] theme-text-muted mt-0.5">{savedPosts.length + savedResources.length} items</p>
                    </div>
                  </div>

                  {collections.map(c => (
                    <div 
                      key={c.id}
                      onClick={() => setSelectedCollection(c.id)}
                      className={`theme-card p-4 border theme-border transition-all cursor-pointer space-y-2 group ${selectedCollection === c.id ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30' : 'bg-slate-900/80 hover:border-indigo-500/40'}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                        {c.icon || '📁'}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold theme-text-primary truncate">{c.name}</h4>
                        <p className="text-[10px] theme-text-muted mt-0.5">{c.count || 5} items</p>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Section I: Saved Bookmarked Research Papers */}
                <div className="theme-card p-6 space-y-4 border theme-border bg-slate-900/80">
                  <div className="flex items-center justify-between pb-3 border-b theme-border">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary flex items-center gap-2">
                      <span>🔖</span> Saved Research Papers & Posts ({savedPosts.length})
                    </h3>
                    <span className="text-[10px] font-mono theme-text-muted">SYNCED TO PROFILE</span>
                  </div>

                  {savedPosts.length === 0 ? (
                    <div className="p-8 text-center space-y-3 rounded-2xl border border-dashed theme-border">
                      <span className="text-3xl block">📌</span>
                      <p className="text-xs font-bold theme-text-primary">No Saved Papers Yet</p>
                      <p className="text-[11px] theme-text-muted max-w-sm mx-auto">
                        Click the bookmark icon on any paper or discussion in the feed to save it to your collections!
                      </p>
                      <button onClick={goHome} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold">
                        Browse Home Feed ↗
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedPosts
                        .filter(p => {
                          if (!savedSearchQuery.trim()) return true;
                          const q = savedSearchQuery.toLowerCase();
                          return p.title?.toLowerCase().includes(q) || p.subjectName?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q);
                        })
                        .map(post => (
                          <div key={post.id} className="p-4 rounded-2xl border theme-border bg-slate-900/60 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {post.subjectName || 'Research'}
                                </span>
                                <span className="text-[10px] theme-text-muted">• {post.createdAt || 'Saved'}</span>
                              </div>
                              <h4 
                                onClick={() => openPost(post.id)}
                                className="text-xs font-extrabold theme-text-primary hover:text-indigo-400 cursor-pointer line-clamp-1"
                              >
                                {post.title}
                              </h4>
                              <p className="text-[11px] theme-text-muted line-clamp-1">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-3 pt-1 text-[10px] theme-text-muted">
                                <span>👍 {post.upvotes} upvotes</span>
                                <span>💬 {post.comments?.length || 0} comments</span>
                                <span>By {post.author?.name || 'Scholar'}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => openPost(post.id)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold"
                              >
                                Open Paper ↗
                              </button>
                              <button 
                                onClick={() => {
                                  if (toggleSavePost) toggleSavePost(post.id);
                                  showToast("Removed from saved collection");
                                }}
                                className="p-1.5 rounded-xl border border-slate-700/80 text-slate-400 hover:text-rose-400 text-xs"
                                title="Remove from saved"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Section II: Saved Academic Resources & Files */}
                <div className="theme-card p-6 space-y-4 border theme-border bg-slate-900/80">
                  <div className="flex items-center justify-between pb-3 border-b theme-border">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider theme-text-primary flex items-center gap-2">
                      <span>📄</span> Saved Academic Resources & Documents ({savedResources.length})
                    </h3>
                    <span className="text-[10px] font-mono theme-text-muted">DOWNLOADABLE ASSETS</span>
                  </div>

                  {savedResources.length === 0 ? (
                    <div className="p-6 text-center text-xs theme-text-muted">
                      No external academic resources saved yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {savedResources
                        .filter(res => {
                          if (!savedSearchQuery.trim()) return true;
                          const q = savedSearchQuery.toLowerCase();
                          return res.title?.toLowerCase().includes(q) || res.subject?.toLowerCase().includes(q) || res.type?.toLowerCase().includes(q);
                        })
                        .map((res, i) => (
                          <div key={res.id || i} className="p-3.5 rounded-2xl border theme-border bg-slate-900/60 hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-lg shrink-0">
                                {res.icon || '📄'}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold theme-text-primary truncate">{res.title}</p>
                                <div className="flex items-center gap-2 text-[10px] theme-text-muted mt-0.5">
                                  <span className="font-bold text-indigo-400">{res.type || 'PDF Document'}</span>
                                  <span>• {res.subject || 'Academic'}</span>
                                  <span>• {res.size || '2.4 MB'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a 
                                href={res.url || '#'} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold"
                              >
                                Access Asset ↗
                              </a>
                              {toggleSaveResource && (
                                <button 
                                  onClick={() => {
                                    toggleSaveResource(res.id);
                                    showToast("Resource removed from saved list");
                                  }}
                                  className="p-1.5 rounded-xl border border-slate-700/80 text-slate-400 hover:text-rose-400 text-xs"
                                  title="Remove resource"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB VI: SOCIAL & MESSAGING ENGINE */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                
                {/* Pending Requests Banner */}
                {pendingRequests.length > 0 && (
                  <div className="theme-card p-4 border border-amber-500/30 bg-amber-500/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                        🤝
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-amber-300">Pending Connection Request</p>
                        <p className="text-[11px] theme-text-muted">
                          {pendingRequests[0].name} ({pendingRequests[0].role}) wants to connect on EduHive
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button 
                        onClick={() => {
                          const req = pendingRequests[0];
                          const newConnId = req.id;
                          setConnections(prev => [...prev, { id: newConnId, name: req.name, role: req.role, avatar: req.avatar, mutuals: 5 }]);
                          setConversations(prev => ({
                            ...prev,
                            [newConnId]: {
                              id: newConnId,
                              name: req.name,
                              handle: `@${req.name.toLowerCase().replace(/\s+/g, '_')}`,
                              role: req.role,
                              avatar: req.avatar,
                              status: 'Online 🟢',
                              messages: [
                                { id: 1, sender: 'them', text: `Hi Alice! Accepted your connection request on EduHive!`, time: 'Just now' }
                              ]
                            }
                          }));
                          setPendingRequests(prev => prev.filter(r => r.id !== req.id));
                          setActiveContactId(newConnId);
                          showToast(`Accepted connection from ${req.name}! Opened direct chat.`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md"
                      >
                        Accept & Chat 💬
                      </button>
                      <button 
                        onClick={() => {
                          setPendingRequests(prev => prev.filter((_, idx) => idx !== 0));
                          showToast("Declined connection request.");
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-400 hover:text-slate-200 text-xs font-bold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Main 2-Column Social Messaging Canvas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column (4 cols): Contacts & Active Conversations List */}
                  <div className="lg:col-span-4 theme-card p-4 border theme-border bg-slate-900/90 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Contacts Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search scholars & conversations..."
                          value={chatSearchQuery}
                          onChange={(e) => setChatSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs rounded-xl theme-surface theme-text-primary placeholder:text-slate-500 border theme-border outline-none focus:border-indigo-500"
                        />
                        <span className="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
                      </div>

                      {/* Contacts Item Stream */}
                      <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                        {Object.values(conversations)
                          .filter(c => {
                            if (!chatSearchQuery.trim()) return true;
                            const q = chatSearchQuery.toLowerCase();
                            return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
                          })
                          .map(c => {
                            const isSelected = activeContactId === c.id;
                            const lastMsg = c.messages[c.messages.length - 1];

                            return (
                              <div
                                key={c.id}
                                onClick={() => setActiveContactId(c.id)}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${isSelected ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-950/40' : 'bg-slate-900/50 border-slate-800/80 hover:border-indigo-500/30'}`}
                              >
                                <div className="relative shrink-0">
                                  <img src={c.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" alt="" />
                                  {c.status?.includes('Online') && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex justify-between items-baseline">
                                    <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-indigo-300' : 'theme-text-primary'}`}>{c.name}</p>
                                    <span className="text-[9px] theme-text-muted shrink-0 ml-1">{lastMsg?.time || 'Now'}</span>
                                  </div>
                                  <p className="text-[10px] theme-text-muted truncate mt-0.5">
                                    {lastMsg ? `${lastMsg.sender === 'me' ? 'You: ' : ''}${lastMsg.text}` : c.role}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                    </div>

                    <button 
                      onClick={() => showToast("Invite link generated! Direct scholar link copied.")}
                      className="w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all mt-2"
                    >
                      <span>➕</span> Connect New Scholar
                    </button>
                  </div>

                  {/* Right Column (8 cols): Active Direct Chat Window */}
                  {conversations[activeContactId] ? (
                    <div className="lg:col-span-8 theme-card p-5 border theme-border bg-slate-900/90 flex flex-col justify-between min-h-[500px]">
                      
                      {/* Active Chat Header */}
                      <div className="flex items-center justify-between pb-3.5 border-b theme-border">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={conversations[activeContactId].avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40" alt="" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold theme-text-primary">{conversations[activeContactId].name}</h3>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {conversations[activeContactId].role}
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-400 font-medium">{conversations[activeContactId].status}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button onClick={() => showToast(`Initiating encrypted call with ${conversations[activeContactId].name}...`)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700">
                            📞 Call
                          </button>
                          <button onClick={() => showToast("Conversation settings & privacy synced.")} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700">
                            ⚙️
                          </button>
                        </div>
                      </div>

                      {/* Chat Messages Body Stream */}
                      <div className="flex-1 space-y-3.5 p-3 overflow-y-auto max-h-[340px] my-3">
                        {conversations[activeContactId].messages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`space-y-1 max-w-[80%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                              <div 
                                className={`text-xs p-3.5 rounded-2xl shadow-md ${msg.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800/90 theme-text-primary rounded-bl-none border theme-border'}`}
                              >
                                <p className="leading-relaxed">{msg.text}</p>
                                
                                {/* Attachment Preview */}
                                {msg.attachment && (
                                  <div className="mt-2 p-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2">
                                    <span className="text-base">📎</span>
                                    <span className="text-[10px] font-mono truncate">{msg.attachment.name || 'Attached_Asset.pdf'}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-[9px] theme-text-muted px-1 block text-right font-mono">
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Live Typing Indicator */}
                        {isTypingReply && (
                          <div className="flex justify-start">
                            <div className="bg-slate-800/90 text-indigo-400 text-xs p-2.5 rounded-2xl border theme-border flex items-center gap-2 animate-pulse">
                              <span>✍️</span>
                              <span>{conversations[activeContactId].name} is typing a response...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Attachment Input Preview Pill */}
                      {chatAttachment && (
                        <div className="mb-2 p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <span>📎</span>
                            <span className="font-mono text-[11px] text-indigo-300 truncate">{chatAttachment.name}</span>
                          </div>
                          <button onClick={() => setChatAttachment(null)} className="text-xs text-rose-400 font-bold hover:text-rose-300 px-1">
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Hidden File Input for Attachment Upload */}
                      <input 
                        type="file" 
                        ref={attachmentInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setChatAttachment({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` });
                            showToast(`Attached file: ${file.name}`);
                          }
                        }}
                        className="hidden" 
                      />

                      {/* Chat Message Input Bar */}
                      <div className="pt-3 border-t theme-border flex items-center gap-2">
                        <button 
                          onClick={() => attachmentInputRef.current?.click()}
                          className="p-2.5 rounded-xl border theme-border bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                          title="Attach document or research asset"
                        >
                          📎
                        </button>
                        
                        <input
                          type="text"
                          placeholder={`Message ${conversations[activeContactId].name}...`}
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                          }}
                          className="flex-1 text-xs p-3 rounded-xl theme-surface theme-text-primary border theme-border outline-none focus:border-indigo-500"
                        />

                        <button 
                          onClick={handleSendMessage}
                          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-950/50 transition-all flex items-center gap-1.5"
                        >
                          <span>Send</span>
                          <span>🚀</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="lg:col-span-8 theme-card p-8 border theme-border bg-slate-900/90 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl block mb-2">💬</span>
                      <p className="text-xs font-bold theme-text-primary">Select a contact to view conversation</p>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>
      </main>

      {/* Avatar Change Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-card p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold theme-text-primary">Update Profile Picture / Avatar</h3>
            <div>
              <label className="text-xs font-semibold block mb-1">Choose Local Image File</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setNewAvatarInput(ev.target.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-xs p-2 rounded-xl border theme-card mb-3"
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Or Image URL</label>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..." 
                value={newAvatarInput}
                onChange={(e) => setNewAvatarInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border theme-card"
                style={{ borderColor: 'var(--border-color)' }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsAvatarModalOpen(false)} className="px-4 py-2 text-xs font-bold theme-text-muted">Cancel</button>
              <button 
                onClick={() => {
                  if (newAvatarInput.trim()) {
                    setAvatarUrl(newAvatarInput.trim());
                    if (updateUser) {
                      updateUser({ avatar: newAvatarInput.trim(), profilePic: newAvatarInput.trim() });
                    }
                    setIsAvatarModalOpen(false);
                    showToast("Profile avatar updated & saved!");
                  }
                }}
                className="px-4 py-2 text-white text-xs font-bold rounded-xl"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Update Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-6 mt-12" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-xs theme-text-muted">
          <p>© {new Date().getFullYear()} EduHive Academic Command & Profile System.</p>
        </div>
      </footer>

    </div>
  );
}
