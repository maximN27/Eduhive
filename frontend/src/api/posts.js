const API_BASE = '/api';

export const getPostsApi = async (page = 1, limit = 20) => {
  const res = await fetch(`${API_BASE}/posts?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch posts');
  return data;
};

export const getPostByIdApi = async (id) => {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch post details');
  return data.post;
};

export const createPostApi = async (postData, token) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to create post');
  return data.post;
};

export const updatePostApi = async (id, postData, token) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to update post');
  return data.post;
};

export const deletePostApi = async (id, token) => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to delete post');
  return data;
};

export const summarizePostApi = async (postId, token) => {
  const res = await fetch(`${API_BASE}/posts/${postId}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Summary temporarily unavailable');
  return data;
};
