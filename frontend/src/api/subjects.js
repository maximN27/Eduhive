const API_BASE = '/api';

export const getSubjectsApi = async (page = 1, limit = 20) => {
  const res = await fetch(`${API_BASE}/subjects?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch subjects');
  return data;
};

export const getSubjectByIdApi = async (id) => {
  const res = await fetch(`${API_BASE}/subjects/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch subject');
  return data.subject;
};

export const createSubjectApi = async (subjectData, token) => {
  const res = await fetch(`${API_BASE}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(subjectData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to create subject');
  return data.subject;
};

export const getSubjectPostsApi = async (id, page = 1, limit = 20) => {
  const res = await fetch(`${API_BASE}/subjects/${id}/posts?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch subject posts');
  return data;
};
