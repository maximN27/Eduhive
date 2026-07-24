import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { postService } from '../services/postService';
import ResourceViewerModal from './ResourceViewerModal';

export default function PostCard({ post }) {
  const { toggleUpvotePost, toggleSavePost, addComment, handleSelectTag, openPost, navigateToPost, addSavedResource, savedResources } = useApp();
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

  const navigateHandler = openPost || navigateToPost;

  return (
    <article className="theme-card theme-card-hover p-5 mb-4 shadow-xl transition-all duration-200 relative overflow-hidden">
      
      {/* Top Header: Author & Subject Badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt={post.author?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" title="Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold theme-text-primary">{post.author?.name}</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </div>
            <p className="text-[10px] theme-text-muted font-medium mt-0.5">
              {post.author?.role || 'AI Research Fellow'} • {post.createdAt}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
          {post.subjectName}
        </span>
      </div>

      {/* Title */}
      <h2 
        onClick={() => navigateHandler && navigateHandler(post.id)}
        className="text-base font-extrabold tracking-tight theme-text-primary leading-snug mb-2 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
      >
        {post.title}
      </h2>

      {/* Content Body */}
      <div className="text-xs theme-text-secondary leading-relaxed whitespace-pre-line mb-3 font-normal">
        {post.content}
      </div>

      {/* Syntax Code Block (if present) */}
      {post.codeSnippet && (
        <div className="mb-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-cyan-400">
            <span>Code Snippet</span>
            <button onClick={handleCopyCode} className="hover:text-white transition-colors">
              {codeCopied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-3 text-[11px] font-mono overflow-x-auto text-cyan-300 leading-relaxed custom-scrollbar">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Attachments / Resources Section */}
      {(() => {
        const displayResources = (post.resources && post.resources.length > 0) ? post.resources : [
          { id: `${post.id}-r1`, title: `${post.subjectName || 'Academic'} Reference Guide (PDF)`, type: 'PDF Document', size: '2.1 MB', icon: '📄', url: 'https://arxiv.org/abs/1706.03762' },
          { id: `${post.id}-r2`, title: `${post.subjectName || 'Academic'} Code Implementation (.ipynb)`, type: 'Jupyter Notebook', size: '1.4 MB', icon: '📓', url: 'https://github.com/TheAlgorithms/Python' }
        ];

        return (
          <div className="mb-3 pt-2.5 border-t theme-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-2 flex items-center justify-between">
              <span>Attached External Learning Resources ({displayResources.length})</span>
              <span className="font-mono text-[9px] theme-text-muted">Verified Study Guides</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayResources.map(res => (
                <div
                  key={res.id}
                  onClick={() => handleViewResource(res)}
                  className="flex items-center gap-2.5 p-2 rounded-xl border theme-border theme-surface transition-all hover:border-cyan-500/40 group cursor-pointer"
                >
                  <span className="text-lg p-1.5 rounded-lg bg-slate-500/10 shrink-0 text-cyan-600 dark:text-cyan-300 border theme-border">{res.icon || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold theme-text-primary truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {res.title}
                    </p>
                    <p className="text-[10px] theme-text-muted font-mono">
                      {res.type} • {res.size || 'External'}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    View 🔗
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Bottom Row: Tags on Left, Actions on Right */}
      <div className="pt-3 border-t theme-border flex flex-wrap items-center justify-between gap-3">
        
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-500/10 theme-text-secondary border theme-border hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
              post.userVoted
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                : 'theme-surface theme-text-secondary theme-border hover:border-slate-400'
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
            className={`p-1.5 rounded-xl border transition-all ${
              post.saved
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

    </article>
  );
}
