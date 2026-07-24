const API_BASE = '/api';

export const castVoteApi = async ({ targetType, targetId, voteType }, token) => {
  const res = await fetch(`${API_BASE}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ targetType, targetId, voteType })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to cast vote');
  }
  return data;
};
