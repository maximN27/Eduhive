import React, { useState } from 'react';

export default function CommentItem({
  comment,
  allComments = [],
  postId,
  onReply,
  onVoteComment,
  depth = 0
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const commentId = comment.id || comment._id;
  const authorName = typeof comment.author === 'string' ? comment.author : (comment.author?.name || 'Scholar');
  const authorAvatar = comment.avatar || comment.author?.avatar || comment.author?.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
  const authorRole = comment.author?.role || 'Scholar';
  const score = comment.voteScore !== undefined ? comment.voteScore : (comment.upvotes || 0);

  // Find direct child replies to this comment
  const replies = allComments.filter(c => {
    const parentId = c.parentCommentId || c.parentComment;
    return parentId && String(parentId) === String(commentId);
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReply) {
      onReply(postId, commentId, replyText);
    }
    setReplyText('');
    setIsReplying(false);
  };

  const isMaxDepth = depth >= 3;

  return (
    <div className={`mt-3 ${depth > 0 ? 'ml-4 sm:ml-6 pl-3 border-l-2 theme-border' : ''}`}>
      <div className="p-3 rounded-2xl theme-surface border theme-border transition-all">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-xl object-cover ring-1 ring-purple-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold theme-text-primary">{authorName}</span>
                <span className="text-[10px] theme-text-muted font-mono">{authorRole}</span>
              </div>
              <span className="text-[10px] theme-text-muted font-mono">{comment.createdAt || 'Recently'}</span>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-xs theme-text-secondary leading-relaxed mb-3 whitespace-pre-line">
          {comment.content}
        </p>

        {/* Action Toolbar: Like, Dislike, Reply */}
        <div className="flex items-center gap-3 pt-1 text-xs">
          {/* Like / Upvote Button */}
          <button
            onClick={() => onVoteComment && onVoteComment(postId, commentId, 'up')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              comment.userVoted === 'up'
                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40'
                : 'theme-surface theme-text-muted hover:theme-text-primary border theme-border'
            }`}
            title="Like comment"
          >
            <span>👍</span>
            <span>{score > 0 ? `+${score}` : score}</span>
          </button>

          {/* Dislike / Downvote Button */}
          <button
            onClick={() => onVoteComment && onVoteComment(postId, commentId, 'down')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              comment.userVoted === 'down'
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40'
                : 'theme-surface theme-text-muted hover:theme-text-primary border theme-border'
            }`}
            title="Dislike comment"
          >
            <span>👎</span>
          </button>

          {/* Reply Button */}
          {!isMaxDepth && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-[11px] font-semibold theme-text-muted hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>💬</span>
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Inline Reply Box */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3 pt-3 border-t theme-border flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${authorName}...`}
              className="flex-1 theme-surface border theme-border rounded-xl px-3 py-1.5 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-2.5 py-1.5 rounded-xl theme-surface theme-text-muted hover:theme-text-primary text-xs font-medium border theme-border"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Render Nested Child Replies */}
      {replies.length > 0 && (
        <div className="space-y-1">
          {replies.map(reply => (
            <CommentItem
              key={reply.id || reply._id}
              comment={reply}
              allComments={allComments}
              postId={postId}
              onReply={onReply}
              onVoteComment={onVoteComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
