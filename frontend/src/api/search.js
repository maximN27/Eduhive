const API_BASE = '/api';

export const searchApi = async (query, type = 'posts') => {
  if (!query || !query.trim()) return { results: [], count: 0 };
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}&type=${type}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Search failed');
  }
  return data;
};
