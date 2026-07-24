const API_BASE = '/api';

export const getPostCommentsApi = async (postId) => {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch comments');
  return data.comments;
};

export const createCommentApi = async (postId, commentData, token) => {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(commentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to post comment');
  return data.comment;
};
