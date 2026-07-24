const API_BASE = '/api';

export const getSubjectResourcesApi = async (subjectId, tag = '', q = '', page = 1, limit = 20) => {
  let url = `${API_BASE}/subjects/${subjectId}/resources?page=${page}&limit=${limit}`;
  if (tag) url += `&tag=${encodeURIComponent(tag)}`;
  if (q) url += `&q=${encodeURIComponent(q)}`;

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch resources');
  }
  return data;
};
