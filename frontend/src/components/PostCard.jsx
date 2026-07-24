import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { postService } from '../services/postService';

export default function PostCard({ post }) {
  const { toggleUpvotePost, toggleSavePost, addComment, handleSelectTag, openPost, navigateToPost } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

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

  const handleSummarizeToggle = async () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    if (summary) {
      setShowSummary(true);
      return;
    }

    setIsSummarizing(true);
    try {
      const data = await postService.summarizePost(post.id);
      if (data.summary) {
        setSummary(data.summary);
        setIsCached(data.cached || false);
        setShowSummary(true);
      } else {
        setSummary('Unable to generate AI summary at this time.');
        setShowSummary(true);
      }
    } catch (err) {
      setSummary('Failed to generate summary. Please try again later.');
      setShowSummary(true);
    } finally {
      setIsSummarizing(false);
    }
  };

  const navigateHandler = openPost || navigateToPost;

  return (
    <article 
      className="theme-card rounded-2xl p-5 mb-4 border transition-all duration-200 hover:shadow-lg relative overflow-hidden"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Subject Badge & Tags Header */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <span 
          className="text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
          style={{
            backgroundColor: 'var(--primary-light)',
            borderColor: 'var(--primary-border)',
            color: 'var(--primary)'
          }}
        >
          <span>⚡</span>
          <span>{post.subjectName}</span>
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag, idx) => {
            const tagColors = [
              { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6' },
              { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', text: '#10B981' },
              { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.2)', text: '#A855F7' },
              { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)', text: '#F97316' }
            ];
            const pill = tagColors[idx % tagColors.length];
            return (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: pill.bg, border: `1px solid ${pill.border}`, color: pill.text }}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <h2 
        onClick={() => navigateHandler && navigateHandler(post.id)}
        className="text-lg font-bold tracking-tight theme-text-primary leading-snug mb-3 cursor-pointer hover:text-blue-500 transition-colors"
      >
        {post.title}
      </h2>

      {/* Content Body */}
      <div className="text-sm theme-text-secondary leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </div>

      {/* Syntax Code Block (if present) */}
      {post.codeSnippet && (
        <div className="mb-4 rounded-xl border overflow-hidden shadow-inner" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--input-bg)' }}>
          <div className="flex items-center justify-between px-3 py-1.5 border-b bg-slate-500/5 text-xs font-mono theme-text-muted" style={{ borderColor: 'var(--border-color)' }}>
            <span>Code Snippet</span>
            <button onClick={handleCopyCode} className="hover:theme-text-primary text-[11px] font-semibold transition-colors">
              {codeCopied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-3.5 text-xs font-mono overflow-x-auto theme-text-primary leading-relaxed">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Attachments / Resources Section */}
      {post.resources && post.resources.length > 0 && (
        <div className="mb-4 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[11px] font-bold uppercase tracking-wider theme-text-muted block mb-2">
            Attached Learning Resources ({post.resources.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {post.resources.map(res => (
              <a
                key={res.id}
                href={res.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl border transition-all hover:bg-slate-500/5 group"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
              >
                <span className="text-xl p-1 rounded-lg bg-slate-500/10 shrink-0">{res.icon || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold theme-text-primary truncate group-hover:text-blue-500 transition-colors">
                    {res.title}
                  </p>
                  <p className="text-[10px] theme-text-muted">
                    {res.type} • {res.size || 'External'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary Dropdown Box */}
      {showSummary && (
        <div className="mb-4 p-3.5 rounded-xl border bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <span>✨</span> Gemini AI Post Summary
            </span>
            {isCached && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">
                Cached
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed theme-text-primary whitespace-pre-line">
            {summary}
          </p>
        </div>
      )}

      {/* Author & Footer Action Toolbar */}
      <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--border-color)' }}>
        
        {/* Author Avatar & Info */}
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-8 h-8 rounded-full object-cover ring-2"
            style={{ ringColor: 'var(--primary-border)' }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold theme-text-primary leading-tight">
              {post.author.name}
            </span>
            <span className="text-[10px] theme-text-muted">
              {post.author.handle} • {post.createdAt}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          
          {/* AI Summarize Button */}
          <button
            onClick={handleSummarizeToggle}
            disabled={isSummarizing}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-purple-500/10 text-purple-600 dark:text-purple-400"
            style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}
            title="Summarize with Gemini AI"
          >
            <span>✨</span>
            <span className="hidden sm:inline">{isSummarizing ? 'Summarizing...' : showSummary ? 'Hide Summary' : 'Summarize'}</span>
          </button>

          {/* Upvote Button */}
          <button
            onClick={() => toggleUpvotePost(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              post.userVoted
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10'
            }`}
            style={{ borderColor: post.userVoted ? 'transparent' : 'var(--border-color)' }}
          >
            <svg className="w-3.5 h-3.5" fill={post.userVoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
            </svg>
            <span>{post.upvotes}</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 transition-all border"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.comments ? post.comments.length : 0}</span>
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`p-2 rounded-xl text-xs transition-all border ${
              post.saved
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10'
            }`}
            style={{ borderColor: post.saved ? 'rgba(245,158,11,0.3)' : 'var(--border-color)' }}
            title={post.saved ? 'Remove Bookmark' : 'Bookmark Post'}
          >
            <svg className="w-3.5 h-3.5" fill={post.saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl text-xs theme-text-secondary hover:theme-text-primary hover:bg-slate-500/10 transition-all border"
            style={{ borderColor: 'var(--border-color)' }}
            title="Share Post Link"
          >
            {copied ? (
              <span className="text-[10px] font-bold text-emerald-500">✓</span>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a constructive academic comment..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl theme-text-primary placeholder:theme-text-muted outline-none transition-all"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)'
              }}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3.5 py-1.5 text-xs font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Post
            </button>
          </form>

          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map(c => (
                <div key={c.id} className="p-2.5 rounded-xl border bg-slate-500/5" style={{ borderColor: 'var(--border-color)' }}>
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
    </article>
  );
}
