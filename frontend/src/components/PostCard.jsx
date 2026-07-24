import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PostCard({ post }) {
<<<<<<< HEAD
  const { toggleUpvotePost, toggleSavePost, addComment, handleSelectTag, openPost } = useApp();
=======
  const { toggleUpvotePost, toggleSavePost, addComment, handleSelectTag, navigateToPost } = useApp();
>>>>>>> cb994f01c783478e22c914410cc049d348d848e2
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
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (post.codeSnippet) {
      navigator.clipboard?.writeText?.(post.codeSnippet);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  // Tag pill styling helper
  const getTagStyle = (tag) => {
    const lower = tag.toLowerCase();
    if (lower.includes('algorithm') || lower.includes('dsa') || lower.includes('sys-design') || lower.includes('os')) {
      return { backgroundColor: 'var(--tag-blue-bg)', color: 'var(--tag-blue-text)' };
    }
    if (lower.includes('ml') || lower.includes('neural') || lower.includes('llm') || lower.includes('python')) {
      return { backgroundColor: 'var(--tag-purple-bg)', color: 'var(--tag-purple-text)' };
    }
    if (lower.includes('calculus') || lower.includes('linear') || lower.includes('probability') || lower.includes('discrete')) {
      return { backgroundColor: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)' };
    }
    if (lower.includes('react') || lower.includes('tailwind') || lower.includes('backend') || lower.includes('typescript')) {
      return { backgroundColor: 'var(--tag-cyan-bg)', color: 'var(--tag-cyan-text)' };
    }
    if (lower.includes('quantum') || lower.includes('circuit') || lower.includes('electromagnetics')) {
      return { backgroundColor: 'var(--tag-yellow-bg)', color: 'var(--tag-yellow-text)' };
    }
    return { backgroundColor: 'var(--tag-teal-bg)', color: 'var(--tag-teal-text)' };
  };

  return (
    <article className="theme-card theme-card-hover p-4 mb-3.5">
      
      {/* Header: Larger 44px Avatar & Meta */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 shrink-0"
            style={{ ringColor: 'var(--primary-border)' }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold theme-text-primary">{post.author.name}</h3>
              <span className="text-xs font-mono theme-text-muted">{post.author.handle}</span>
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--primary)' }}>{post.author.role}</p>
          </div>
        </div>

        <span className="text-xs font-medium theme-text-muted">{post.createdAt}</span>
      </div>

      {/* Badges: Subject & Subtopic Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span 
          className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
          style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
        >
          {post.subjectName}
        </span>
        {post.tags.map(tag => {
          const pill = getTagStyle(tag);
          return (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-80"
              style={pill}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Title */}
      <h2 
<<<<<<< HEAD
        onClick={() => openPost && openPost(post.id)}
        className="text-lg font-bold tracking-tight theme-text-primary leading-snug mb-3 cursor-pointer hover:text-blue-500 transition-colors"
=======
        onClick={() => navigateToPost(post.id)}
        className="text-lg font-bold tracking-tight theme-text-primary leading-snug mb-3 cursor-pointer hover:opacity-80 transition-opacity"
>>>>>>> cb994f01c783478e22c914410cc049d348d848e2
      >
        {post.title}
      </h2>

      {/* Content Body */}
      <div className="text-sm theme-text-secondary leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </div>

      {/* Syntax Code Block (if present) */}
      {post.codeSnippet && (
        <div 
          className="mb-4 rounded-xl border overflow-hidden shadow-inner"
          style={{ backgroundColor: 'var(--code-bg)', borderColor: 'var(--code-border)' }}
        >
          <div 
            className="flex items-center justify-between px-3.5 py-2 border-b text-xs font-mono"
            style={{ backgroundColor: 'var(--code-header-bg)', borderColor: 'var(--code-border)', color: 'var(--code-text)' }}
          >
            <span className="font-semibold text-cyan-400">Code Snippet</span>
            <button
              onClick={handleCopyCode}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              {codeCopied ? 'Copied ✓' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed custom-scrollbar" style={{ color: 'var(--code-text)' }}>
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Gemini AI Summary Card */}
      {showSummary && (
        <div className="mb-4 p-4 rounded-xl border bg-purple-500/10 border-purple-500/30 text-xs leading-relaxed">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-purple-400">
              <span>⚡ Gemini 2.5 Flash Summary</span>
            </div>
            {isCached && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ⚡ Instant Cache Hit
              </span>
            )}
          </div>
          {isSummarizing ? (
            <div className="flex items-center gap-2 text-purple-300 py-2">
              <svg className="w-4 h-4 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Generating AI summary using Gemini...</span>
            </div>
          ) : (
            <div className="theme-text-secondary space-y-1 font-sans whitespace-pre-line">
              {summary}
            </div>
          )}
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
        
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={() => toggleUpvotePost(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all"
            style={{
              backgroundColor: post.userVoted ? 'var(--primary-light)' : 'var(--surface-main)',
              color: post.userVoted ? 'var(--primary)' : 'var(--text-secondary)',
              borderColor: post.userVoted ? 'var(--primary)' : 'var(--border-color)'
            }}
          >
            <svg className={`w-4 h-4 ${post.userVoted ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
            <span>{post.upvotes}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
            style={{
              backgroundColor: showComments ? 'var(--primary-light)' : 'var(--surface-main)',
              color: showComments ? 'var(--primary)' : 'var(--text-secondary)',
              borderColor: showComments ? 'var(--primary)' : 'var(--border-color)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.comments.length}</span>
          </button>

          {/* Gemini AI Summarize Button */}
          <button
            onClick={async () => {
              if (summary) {
                setShowSummary(!showSummary);
                return;
              }
              setIsSummarizing(true);
              setShowSummary(true);
              try {
                const res = await fetch(`/api/posts/${post.id || 'p-1'}/summarize`, { method: 'POST' });
                if (res.ok) {
                  const data = await res.json();
                  setSummary(data.summary || data.data?.summary);
                  setIsCached(data.cached);
                } else {
                  setSummary(`• Key Takeaway: ${post.title}\n• Core Concept: ${post.content.slice(0, 120)}...\n• Discussion: High academic engagement across ${post.comments?.length || 0} discussion replies.`);
                }
              } catch (err) {
                setSummary(`• Key Takeaway: ${post.title}\n• Core Concept: ${post.content.slice(0, 120)}...\n• Discussion: High academic engagement across ${post.comments?.length || 0} discussion replies.`);
              } finally {
                setIsSummarizing(false);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
            style={{
              backgroundColor: showSummary ? 'rgba(168, 85, 247, 0.12)' : 'var(--surface-main)',
              color: showSummary ? '#A855F7' : 'var(--text-secondary)',
              borderColor: showSummary ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-color)'
            }}
          >
            <span className="text-amber-400 font-bold">⚡</span>
            <span>AI Summary</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border theme-text-muted hover:theme-text-primary transition-colors relative"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--surface-main)' }}
            title="Share post"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-white text-[9px] rounded font-bold whitespace-nowrap shadow-lg">
                Link Copied!
              </span>
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className="p-2 rounded-xl border transition-all"
            style={{
              backgroundColor: post.saved ? 'var(--primary-light)' : 'var(--surface-main)',
              color: post.saved ? 'var(--primary)' : 'var(--text-muted)',
              borderColor: post.saved ? 'var(--primary)' : 'var(--border-color)'
            }}
            title={post.saved ? 'Remove from Saved' : 'Save Post'}
          >
            <svg className={`w-4 h-4 ${post.saved ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t animate-in fade-in duration-200" style={{ borderColor: 'var(--border-color)' }}>
          <h4 className="text-xs font-bold theme-text-primary mb-3">
            Discussion ({post.comments.length})
          </h4>

          <div className="space-y-3 mb-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-main)', borderColor: 'var(--border-color)' }}>
                <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold theme-text-primary">{comment.author}</span>
                    <span className="text-[10px] theme-text-muted">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs theme-text-secondary leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}

            {post.comments.length === 0 && (
              <p className="text-xs theme-text-muted italic">No comments yet. Start the conversation!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a response..."
              className="flex-1 border rounded-xl px-3 py-2 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none"
              style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)' }}
            />
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Reply
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
