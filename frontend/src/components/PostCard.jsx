import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { postService } from '../services/postService';
import { generatePostAlignedResources } from '../services/resourceSearchService';
import ResourceViewerModal from './ResourceViewerModal';

export default function PostCard({ post }) {
  const { user, toggleUpvotePost, toggleSavePost, deletePost, addComment, handleSelectTag, openPost, navigateToPost, navigateToProfile, addSavedResource, savedResources } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const [selectedResource, setSelectedResource] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  const handleViewResource = (res) => {
    setSelectedResource(res);
    setIsResourceModalOpen(true);
  };

  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(post.summary || null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (post.codeSnippet) {
      navigator.clipboard.writeText(post.codeSnippet);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const [selectedModalImage, setSelectedModalImage] = useState(null);

  const isCurrentUser = Boolean(
    user && (
      post.author?.name === user.name ||
      post.author?.handle === user.handle ||
      post.author?.id === user.id ||
      String(post.id).startsWith('post-')
    )
  );

  const displayAvatar = isCurrentUser && user?.avatar ? user.avatar : (post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const displayName = isCurrentUser && user?.name ? user.name : (post.author?.name || 'EduHive Scholar');
  const displayRole = isCurrentUser && user?.role ? user.role : (post.author?.role || 'AI Research Fellow');

  const navigateHandler = openPost || navigateToPost;

  return (
    <article className="theme-card p-5 rounded-2xl mb-4 border theme-border hover:shadow-md transition-all duration-200 relative group">

      {/* Top Header: Author & Subject Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => navigateToProfile && navigateToProfile()}>
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30 hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" title="Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 
                onClick={() => navigateToProfile && navigateToProfile()}
                className="text-xs font-bold theme-text-primary hover:underline cursor-pointer"
              >
                {displayName}
              </h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </div>
            <p className="text-[10px] theme-text-muted font-medium mt-0.5">
              {displayRole} • {post.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
            {post.subjectName}
          </span>
          {isCurrentUser && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this post?')) {
                  deletePost && deletePost(post.id);
                }
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              title="Delete Post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h2
        onClick={() => navigateHandler && navigateHandler(post.id)}
        className="text-lg sm:text-xl font-extrabold tracking-tight theme-text-primary leading-snug mb-2.5 cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
      >
        {post.title}
      </h2>

      {/* Content Body */}
      <div className="text-sm sm:text-base theme-text-secondary leading-relaxed whitespace-pre-line mb-3.5 font-normal">
        {post.content}
      </div>

      {/* Attached Local Images Gallery */}
      {post.images && post.images.length > 0 && (
        <div className={`mb-3.5 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {post.images.map((imgSrc, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedModalImage(imgSrc)}
              className="relative group rounded-xl overflow-hidden border theme-border cursor-pointer aspect-video bg-black/5"
            >
              <img 
                src={imgSrc} 
                alt={`attachment-${idx}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-lg">🔍 View Image</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Syntax Code Block (if present) */}
      {post.codeSnippet && (
        <div className="mb-3.5 rounded-xl border theme-border theme-surface overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-3 py-1.5 border-b theme-border text-[10px] font-mono text-purple-600 dark:text-purple-400">
            <span>Code Snippet</span>
            <button onClick={handleCopyCode} className="hover:theme-text-primary transition-colors">
              {codeCopied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-3 text-xs font-mono overflow-x-auto text-purple-600 dark:text-purple-300 leading-relaxed custom-scrollbar">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Attachments / Resources Section - ONLY if user attached resources */}
      {post.resources && post.resources.length > 0 && (
        <div className="mb-3.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-2 flex items-center justify-between">
            <span>Attached External Learning Resources ({post.resources.length})</span>
            <span className="font-mono text-[10px] theme-text-muted">Verified Study Guides</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {post.resources.map(res => (
              <div
                key={res.id}
                onClick={() => handleViewResource(res)}
                className="flex items-center gap-2.5 p-2 rounded-xl border theme-border theme-surface transition-all hover:border-purple-500/40 group cursor-pointer shadow-2xs"
              >
                <span className="text-lg p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 dark:bg-slate-800 dark:text-purple-300 dark:border-slate-700 shrink-0">{res.icon || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold theme-text-primary truncate group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {res.title}
                  </p>
                  <p className="text-[10px] theme-text-muted font-mono">
                    {res.type} • {res.size || 'External'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  View 🔗
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Row: Tags on Left, Actions on Right */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">

          {/* Upvote Button */}
          <button
            onClick={() => toggleUpvotePost(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${post.userVoted
              ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
              : 'theme-surface theme-text-secondary theme-border hover:border-purple-400'
              }`}
          >
            <svg className="w-3.5 h-3.5" fill={post.userVoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
            </svg>
            <span>{post.upvotes}</span>
          </button>

          {/* Comment Count / Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold theme-surface theme-text-secondary theme-border hover:border-slate-400 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment({post.comments?.length || 0})</span>
          </button>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`p-1.5 rounded-xl border transition-all ${post.saved
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              : 'theme-surface theme-text-muted hover:theme-text-primary theme-border'
              }`}
            title={post.saved ? 'Unsave Post' : 'Save Post'}
          >
            <svg className={`w-3.5 h-3.5 ${post.saved ? 'fill-amber-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-xl theme-surface theme-text-muted hover:theme-text-primary theme-border transition-colors relative"
            title="Share post link"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cyan-600 text-white text-[9px] rounded font-bold whitespace-nowrap shadow-lg">
                Copied!
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Embedded Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t theme-border animate-in fade-in duration-150">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a response..."
              className="flex-1 border rounded-xl px-3 py-1.5 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-1.5 text-xs font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50 btn-primary"
            >
              Post
            </button>
          </form>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="p-2.5 rounded-xl border theme-surface theme-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold theme-text-primary">{c.author}</span>
                    <span className="text-[10px] theme-text-muted">{c.createdAt}</span>
                  </div>
                  <p className="text-xs theme-text-secondary">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center py-2 theme-text-muted">No comments yet. Be the first to join the discussion!</p>
          )}
        </div>
      )}

      {/* Resource Viewer Modal */}
      <ResourceViewerModal
        resource={selectedResource}
        subjectName={post.subjectName}
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSaveResource={(res) => {
          addSavedResource({
            id: res.id,
            title: res.title,
            subject: post.subjectName,
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

      {/* Lightbox Modal for Full-Size Image Preview */}
      {selectedModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={selectedModalImage} alt="Fullscreen Attachment" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedModalImage(null)}
              className="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs hover:bg-rose-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </article>
  );
}
