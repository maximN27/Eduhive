import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import { useApp } from '../context/AppContext';

export default function PostPage() {
  const {
    activePost,
    goHome,
    toggleUpvotePost,
    toggleSavePost,
    addComment,
    handleSelectTag,
    addSavedResource,
    savedResources
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  // Tab state for the 3 sections in the Right Sidebar ('resources', 'discussions', 'notes')
  const [activeRightTab, setActiveRightTab] = useState('resources');

  if (!activePost) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <p className="text-slate-400 mb-4">Post not found or has been removed.</p>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
        >
          Return to Home Feed
        </button>
      </div>
    );
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(activePost.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const postResources = activePost.resources || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Sticky Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Layout Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Horizontal 3 Division Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Division 1 (Left Sidebar): Subject & Subtopic Tags - Identical to Home Page */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <LeftSidebar />
          </div>

          {/* Division 2 (Center Section): Active Post Detail View */}
          <div className="lg:col-span-6 min-w-0">
            
            {/* Back Navigation Bar */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all group shadow-md"
              >
                <svg className="w-4 h-4 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home Feed</span>
              </button>

              <span className="text-[11px] font-mono text-slate-500">
                Post ID: {activePost.id}
              </span>
            </div>

            {/* Main Post Article Box */}
            <article className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl mb-6">
              
              {/* Header: Author Details & Date */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activePost.author?.avatar || activePost.author?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={activePost.author?.name || activePost.author?.username || 'Author'}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-sm font-bold text-slate-100">{activePost.author?.name || activePost.author?.username || 'Scholar'}</h1>
                      <span className="text-xs text-slate-500 font-mono">{activePost.author?.handle || (activePost.author?.username ? `@${activePost.author.username}` : '@scholar')}</span>
                    </div>
                    <p className="text-xs text-indigo-400 font-medium mt-0.5">{activePost.author?.role || 'Student'}</p>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {activePost.createdAt}
                </span>
              </div>

              {/* Badges: Subject & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {activePost.subjectName}
                </span>
                {activePost.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-slate-700/40"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mb-4">
                {activePost.title}
              </h1>

              {/* Full Content */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-6 font-normal">
                {activePost.content}
              </div>

              {/* Code Snippet (if present) */}
              {activePost.codeSnippet && (
                <div className="mb-6 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800/90 text-xs font-mono text-cyan-400">
                    <span>Code Snippet</span>
                    <span className="text-slate-500">Syntax Highlighted</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed custom-scrollbar">
                    <code>{activePost.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Actions Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  {/* Upvote Button */}
                  <button
                    onClick={() => toggleUpvotePost(activePost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
                      activePost.userVoted
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/20 font-bold'
                        : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${activePost.userVoted ? 'text-indigo-400 fill-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{activePost.upvotes} Upvotes</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSavePost(activePost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all ${
                      activePost.saved
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30 font-semibold'
                        : 'bg-slate-950/80 text-slate-400 hover:text-amber-400 border border-slate-800'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${activePost.saved ? 'fill-amber-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{activePost.saved ? 'Saved' : 'Save Post'}</span>
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 transition-colors relative"
                  title="Share post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-indigo-500 text-white text-[10px] rounded font-bold whitespace-nowrap shadow-lg">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>

            </article>

            {/* Comments Discussion Section */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Discussion ({activePost.comments.length})</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2.5 mb-6">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or answer questions..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {activePost.comments.map(comment => (
                  <div key={comment.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                    <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-700" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{comment.author}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {activePost.comments.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs italic">
                    No discussion comments yet. Be the first to start the conversation!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Division 3 (Right Section): 3-Section Tabbed Box */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl">
              
              {/* 3 Section Title Tabs Navigation Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-1">
                <button
                  onClick={() => setActiveRightTab('resources')}
                  className={`flex-1 text-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeRightTab === 'resources'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Resources
                </button>
                
                <button
                  onClick={() => setActiveRightTab('discussions')}
                  className={`flex-1 text-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeRightTab === 'discussions'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Discussions
                </button>

                <button
                  onClick={() => setActiveRightTab('notes')}
                  className={`flex-1 text-center py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeRightTab === 'notes'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* SECTION 1: Resources Posted for this Post */}
              {activeRightTab === 'resources' && (
                <div className="animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span>📁</span> Posted Resources
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {postResources.length}
                    </span>
                  </div>

                  {postResources.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      <div className="text-2xl mb-2">📂</div>
                      No resources posted for this post yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {postResources.map((res) => {
                        const isAlreadySaved = savedResources.some(sr => sr.id === res.id);
                        return (
                          <div
                            key={res.id}
                            className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                                {res.icon || '📄'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 leading-snug line-clamp-2">
                                  {res.title}
                                </h4>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    {res.type}
                                  </span>
                                  <span>{res.size}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-900">
                              <a
                                href={res.url || '#'}
                                onClick={(e) => { e.preventDefault(); alert(`Opening resource: ${res.title}`); }}
                                className="flex-1 text-center py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-semibold transition-all border border-indigo-500/30"
                              >
                                View / Download
                              </a>
                              <button
                                onClick={() => {
                                  if (!isAlreadySaved) {
                                    addSavedResource({
                                      id: res.id,
                                      title: res.title,
                                      subject: activePost.subjectName,
                                      type: res.type,
                                      size: res.size,
                                      icon: res.icon,
                                      url: res.url || '#',
                                      dateAdded: 'Just now'
                                    });
                                  }
                                }}
                                disabled={isAlreadySaved}
                                className={`p-1.5 rounded-xl border text-[11px] transition-colors ${
                                  isAlreadySaved
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-slate-900 text-slate-400 hover:text-amber-400 border-slate-800'
                                }`}
                                title={isAlreadySaved ? 'Saved to collection' : 'Save resource'}
                              >
                                {isAlreadySaved ? '✓ Saved' : '🔖 Save'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: Related Discussions (Placeholder Section) */}
              {activeRightTab === 'discussions' && (
                <div className="animate-in fade-in duration-200 py-6 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                    💬
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Related Discussions</h3>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    This section is reserved for related thread discussions. Coming soon in future updates.
                  </p>
                </div>
              )}

              {/* SECTION 3: Notes & References (Placeholder Section) */}
              {activeRightTab === 'notes' && (
                <div className="animate-in fade-in duration-200 py-6 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    📝
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 mb-1">Notes & References</h3>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    This section is reserved for shared author notes and reference links. Coming soon in future updates.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Responsive Drawer for Mobile Screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <span className="font-extrabold text-indigo-400 text-lg">EduHive Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              ✕ Close
            </button>
          </div>
          <div className="space-y-6">
            <LeftSidebar />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduHive Academic Knowledge Platform. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
