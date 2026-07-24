import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function PostCard({ post }) {
  const { toggleUpvotePost, toggleSavePost, addComment, handleSelectTag } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

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

  return (
    <article className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl transition-all hover:border-slate-700/80 mb-5">
      {/* Header: Author Info & Meta */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-100">{post.author.name}</h3>
              <span className="text-[10px] text-slate-500 font-mono">{post.author.handle}</span>
            </div>
            <p className="text-[10px] text-indigo-400 font-medium">{post.author.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>{post.createdAt}</span>
        </div>
      </div>

      {/* Badges: Subject & Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {post.subjectName}
        </span>
        {post.tags.map(tag => (
          <button
            key={tag}
            onClick={() => handleSelectTag(tag)}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-slate-700/40"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Title */}
      <h2 className="text-base font-extrabold text-slate-100 tracking-tight leading-snug mb-2.5">
        {post.title}
      </h2>

      {/* Content */}
      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </div>

      {/* Code Snippet (if available) */}
      {post.codeSnippet && (
        <div className="mb-4 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-[10px] font-mono text-cyan-400">
            <span>Code Example / Syntax</span>
            <span className="text-slate-500">UTF-8</span>
          </div>
          <pre className="p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed custom-scrollbar">
            <code>{post.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            onClick={() => toggleUpvotePost(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
              post.userVoted
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/20 font-bold'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <svg className={`w-4 h-4 ${post.userVoted ? 'text-indigo-400 fill-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
            <span>{post.upvotes}</span>
          </button>

          {/* Comment Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
              showComments
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{post.comments.length}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-colors relative"
            title="Share post"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-500 text-white text-[9px] rounded font-bold whitespace-nowrap shadow-lg">
                Link Copied!
              </span>
            )}
          </button>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`p-2 rounded-xl border transition-all ${
              post.saved
                ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800 border-slate-800/80'
            }`}
            title={post.saved ? 'Remove from Saved' : 'Save Post'}
          >
            <svg className={`w-4 h-4 ${post.saved ? 'fill-amber-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-slate-300 mb-3">
            Discussion ({post.comments.length})
          </h4>

          {/* Comments List */}
          <div className="space-y-3 mb-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <img src={comment.avatar} alt={comment.author} className="w-6 h-6 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-200">{comment.author}</span>
                    <span className="text-[9px] text-slate-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{comment.content}</p>
                </div>
              </div>
            ))}

            {post.comments.length === 0 && (
              <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a constructive response..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Reply
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
