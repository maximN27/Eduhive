import React, { useState } from 'react';

const CommentItem = ({ comment, childComments, onReplySubmit, token }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await onReplySubmit(comment._id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      alert(err.message || 'Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  const authorName = comment.authorId?.name || comment.authorId?.username || 'Anonymous';
  const authorRole = comment.authorId?.role || 'student';
  const authorLetter = authorName[0]?.toUpperCase() || 'U';

  return (
    <div className="border-l-2 border-gray-800 pl-4 my-3 space-y-3">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {authorLetter}
            </div>
            <span className="text-sm font-semibold text-gray-200">{authorName}</span>
            <span className="text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900 uppercase font-semibold">
              {authorRole}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>

        <div className="mt-3 flex items-center space-x-4">
          {token && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            >
              {showReplyForm ? 'Cancel Reply' : 'Reply'}
            </button>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 pt-3 border-t border-gray-800 flex space-x-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              required
              className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Posting...' : 'Reply'}
            </button>
          </form>
        )}
      </div>

      {childComments && childComments.length > 0 && (
        <div className="space-y-2">
          {childComments.map((child) => (
            <CommentItem
              key={child._id}
              comment={child}
              childComments={child.children}
              onReplySubmit={onReplySubmit}
              token={token}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentTree = ({ comments, onReplySubmit, token }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No comments yet. Be the first to answer!
      </div>
    );
  }

  // Build tree from flat list
  const commentMap = {};
  const rootComments = [];

  comments.forEach((c) => {
    commentMap[c._id] = { ...c, children: [] };
  });

  comments.forEach((c) => {
    if (c.parentComment) {
      const parentId = typeof c.parentComment === 'object' ? c.parentComment._id : c.parentComment;
      if (commentMap[parentId]) {
        commentMap[parentId].children.push(commentMap[c._id]);
      } else {
        rootComments.push(commentMap[c._id]);
      }
    } else {
      rootComments.push(commentMap[c._id]);
    }
  });

  return (
    <div className="space-y-4">
      {rootComments.map((root) => (
        <CommentItem
          key={root._id}
          comment={root}
          childComments={root.children}
          onReplySubmit={onReplySubmit}
          token={token}
        />
      ))}
    </div>
  );
};
