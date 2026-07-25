import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import PostAiLearningWidget from '../components/PostAiLearningWidget';
import ResourceViewerModal from '../components/ResourceViewerModal';
import YouTubeStudyPlayer from '../components/YouTubeStudyPlayer';
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
  const [selectedResource, setSelectedResource] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Tab state for the sections in the Right Sidebar ('resources', 'gaps', 'path', 'mentors')
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

  const postResources = (activePost.resources && activePost.resources.length > 0)
    ? activePost.resources
    : [
        { id: `${activePost.id}-r1`, title: `${activePost.subjectName || 'Academic'} Research & Study Guide (PDF)`, type: 'PDF Document', size: '2.4 MB', icon: '📄', url: 'https://arxiv.org/abs/1706.03762' },
        { id: `${activePost.id}-r2`, title: `${activePost.subjectName || 'Academic'} Code & Simulation Notebook (.ipynb)`, type: 'Jupyter Notebook', size: '1.6 MB', icon: '📓', url: 'https://github.com/TheAlgorithms/Python' }
      ];

  const postComments = (activePost.comments && activePost.comments.length > 0)
    ? activePost.comments
    : [
        { id: `${activePost.id}-c1`, author: 'Dr. Alice Vance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', content: `Great discussion on ${activePost.subjectName}! The derivation step in section 2 clarifies previous boundary edge cases.`, createdAt: '45m ago' },
        { id: `${activePost.id}-c2`, author: 'Dr. Aris Thorne', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', content: `Benchmarking this against hardware vectorization shows memory layout gains from SIMD alignment.`, createdAt: '20m ago' }
      ];

  return (
    <div className="min-h-screen ambient-bg theme-text-primary flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased transition-colors duration-200">
      
      {/* Sticky Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Layout Container spanning full screen width with ~20px margins */}
      <main className="flex-1 w-full px-5 sm:px-6 lg:px-8 py-5">
        
        {/* Horizontal 3 Division Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          
          {/* Division 1 (Left Sidebar): Subject & Subtopic Tags */}
          <div className="hidden lg:block w-56 shrink-0 sticky top-[80px]">
            <LeftSidebar />
          </div>

          {/* Division 2 (Center Section): Active Post Detail View (Auto-Expands) */}
          <div className="flex-1 min-w-0">
            
            {/* Back Navigation Bar */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl theme-surface hover:border-cyan-500/40 theme-text-primary border theme-border text-xs font-semibold transition-all group shadow-md"
              >
                <svg className="w-4 h-4 text-cyan-500 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home Feed</span>
              </button>

              <span className="text-xs font-mono theme-text-muted">
                Post ID: {activePost.id}
              </span>
            </div>

            {/* Main Post Article Box */}
            <article className="pb-6 mb-6 border-b theme-border">
              
              {/* Header: Author Details & Date */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activePost.author?.avatar || activePost.author?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={activePost.author?.name || activePost.author?.username || 'Author'}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cyan-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-sm font-bold theme-text-primary">{activePost.author?.name || activePost.author?.username || 'Scholar'}</h1>
                      <span className="text-xs theme-text-muted font-mono">{activePost.author?.handle || (activePost.author?.username ? `@${activePost.author.username}` : '@scholar')}</span>
                    </div>
                    <p className="text-xs font-medium mt-0.5 text-cyan-600 dark:text-cyan-400">{activePost.author?.role || 'Student'}</p>
                  </div>
                </div>

                <span className="text-xs theme-text-muted font-mono">
                  {activePost.createdAt}
                </span>
              </div>

              {/* Badges: Subject & Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                  {activePost.subjectName}
                </span>
                {activePost.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="text-xs font-mono px-2.5 py-0.5 rounded-lg theme-surface theme-text-secondary hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors border theme-border"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black theme-text-primary tracking-tight leading-tight mb-4">
                {activePost.title}
              </h1>

              {/* Full Content */}
              <div className="text-base sm:text-lg theme-text-secondary leading-relaxed whitespace-pre-line mb-6 font-normal">
                {activePost.content}
              </div>

              {/* Code Snippet (if present) */}
              {activePost.codeSnippet && (
                <div className="mb-6 rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 border-b border-slate-700/80 text-xs font-mono text-cyan-400">
                    <span>Code Snippet</span>
                    <span className="text-slate-400">Syntax Highlighted</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed custom-scrollbar">
                    <code>{activePost.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Attached External Learning Resources Section */}
              <div className="mb-6 pt-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-3 flex items-center justify-between">
                  <span>Attached External Learning Resources ({postResources.length})</span>
                  <span className="font-mono text-[10px] theme-text-muted">Verified Study Guides & Notebooks</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {postResources.map(res => (
                    <div
                      key={res.id}
                      onClick={() => {
                        setSelectedResource(res);
                        setIsResourceModalOpen(true);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl border theme-border theme-surface transition-all hover:border-cyan-500/40 group cursor-pointer"
                    >
                      <span className="text-lg p-1.5 rounded-xl bg-slate-500/10 text-cyan-600 dark:text-cyan-300 border theme-border shrink-0">{res.icon || '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold theme-text-primary truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                          {res.title}
                        </p>
                        <p className="text-[10px] theme-text-muted font-mono mt-0.5">
                          {res.type} • {res.size || 'External'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        View 🔗
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded YouTube Recommended Video Player */}
              <div className="mb-6">
                <YouTubeStudyPlayer 
                  initialTopic={activePost.subjectName || 'Computer Science'} 
                  postTitle={activePost.title}
                />
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {/* Upvote Button */}
                  <button
                    onClick={() => toggleUpvotePost(activePost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
                      activePost.userVoted
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/50 shadow-md font-bold'
                        : 'theme-surface theme-text-secondary hover:theme-text-primary border theme-border'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${activePost.userVoted ? 'text-cyan-500 fill-cyan-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <span>{activePost.upvotes} Upvotes</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleSavePost(activePost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all ${
                      activePost.saved
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 font-semibold'
                        : 'theme-surface theme-text-secondary hover:text-amber-500 border theme-border'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${activePost.saved ? 'fill-amber-500 text-amber-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{activePost.saved ? 'Saved' : 'Save Post'}</span>
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl theme-surface theme-text-secondary hover:theme-text-primary border theme-border transition-colors relative"
                  title="Share post"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  {copied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-cyan-600 text-white text-[10px] rounded font-bold whitespace-nowrap shadow-lg">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>

            </article>

            {/* Comments Discussion Section */}
            <div className="pb-6 mb-6 border-b theme-border">
              <h3 className="text-sm font-bold theme-text-primary mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Discussion ({postComments.length})</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2.5 mb-6">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or answer questions..."
                  className="flex-1 theme-surface border theme-border rounded-xl px-4 py-2.5 text-xs theme-text-primary placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 btn-primary text-xs font-semibold rounded-xl transition-colors shrink-0"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {postComments.map(comment => (
                  <div key={comment.id} className="p-3.5 rounded-2xl theme-surface border theme-border flex items-start gap-3">
                    <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-400/30" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold theme-text-primary">{comment.author}</span>
                        <span className="text-[10px] theme-text-muted font-mono">{comment.createdAt}</span>
                      </div>
                      <p className="text-xs theme-text-secondary leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}

                {activePost.comments.length === 0 && (
                  <div className="text-center py-8 theme-text-muted text-xs italic">
                    No discussion comments yet. Be the first to start the conversation!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Division 3 (Right Section): 3-Section Tabbed Box */}
          <div className="hidden lg:block w-80 shrink-0 sticky top-[80px]">
            <div className="pl-5 border-l theme-border pb-6">
              
              {/* 4 Section AI & Resources Navigation Header */}
              <div className="flex items-center justify-between border-b theme-border pb-3 mb-4 gap-1">
                <button
                  onClick={() => setActiveRightTab('resources')}
                  className={`flex-1 text-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                    activeRightTab === 'resources'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'theme-text-muted hover:theme-text-primary hover:bg-slate-500/10'
                  }`}
                  title="Posted Resources"
                >
                  📁 Files
                </button>
                
                <button
                  onClick={() => setActiveRightTab('gaps')}
                  className={`flex-1 text-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                    activeRightTab === 'gaps'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'theme-text-muted hover:theme-text-primary hover:bg-slate-500/10'
                  }`}
                  title="AI Knowledge Gaps"
                >
                  🧠 Gaps
                </button>

                <button
                  onClick={() => setActiveRightTab('path')}
                  className={`flex-1 text-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                    activeRightTab === 'path'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'theme-text-muted hover:theme-text-primary hover:bg-slate-500/10'
                  }`}
                  title="Adaptive Learning Path"
                >
                  🗺️ Path
                </button>

                <button
                  onClick={() => setActiveRightTab('mentors')}
                  className={`flex-1 text-center py-1.5 px-1 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                    activeRightTab === 'mentors'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'theme-text-muted hover:theme-text-primary hover:bg-slate-500/10'
                  }`}
                  title="AI Peer Mentors"
                >
                  🤝 Mentors
                </button>
              </div>

              {/* SECTION 1: Posted Resources */}
              {activeRightTab === 'resources' && (
                <div className="animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider theme-text-secondary flex items-center gap-1.5">
                      <span>📁</span> Posted Resources
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {postResources.length}
                    </span>
                  </div>

                  {postResources.length === 0 ? (
                    <div className="text-center py-8 theme-text-muted text-xs">
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
                            className="p-3.5 rounded-2xl theme-surface border theme-border hover:border-cyan-500/40 transition-all group"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl p-2 rounded-xl bg-slate-500/10 border theme-border shrink-0">
                                {res.icon || '📄'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold theme-text-primary group-hover:text-cyan-600 dark:group-hover:text-cyan-300 leading-snug line-clamp-2">
                                  {res.title}
                                </h4>
                                <div className="flex items-center justify-between text-[10px] theme-text-muted mt-2 font-mono">
                                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                    {res.type}
                                  </span>
                                  <span>{res.size}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t theme-border">
                              <button
                                onClick={() => {
                                  setSelectedResource(res);
                                  setIsResourceModalOpen(true);
                                }}
                                className="flex-1 text-center py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-600 text-cyan-600 hover:text-white dark:text-cyan-300 text-[11px] font-semibold transition-all border border-cyan-500/30 cursor-pointer"
                              >
                                View / Download 🔗
                              </button>
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
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'theme-surface theme-text-muted hover:text-amber-500 border theme-border'
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

              {/* SECTIONS 2, 3 & 4: AI Powered Knowledge Gaps, Adaptive Path, Peer Mentors */}
              {activeRightTab !== 'resources' && (
                <PostAiLearningWidget 
                  activePost={activePost}
                  activeTab={activeRightTab}
                  onSwitchTab={(tab) => setActiveRightTab(tab)}
                />
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

      {/* Resource Viewer Modal */}
      <ResourceViewerModal
        resource={selectedResource}
        subjectName={activePost?.subjectName}
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSaveResource={(res) => {
          addSavedResource({
            id: res.id,
            title: res.title,
            subject: activePost?.subjectName || 'Academic Resource',
            type: res.type,
            size: res.size,
            icon: res.icon,
            url: res.url || '#',
            dateAdded: 'Just now'
          });
          setIsResourceModalOpen(false);
        }}
        isSaved={selectedResource && savedResources.some(sr => sr.id === selectedResource.id)}
      />

    </div>
  );
}
