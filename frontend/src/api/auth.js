const API_BASE = '/api';

export const registerApi = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Registration failed');
  }
  return data;
};

export const loginApi = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Login failed');
  }
  return data;
};

export const getMeApi = async (token) => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to fetch user');
  }
  return data.user;
};

export const logoutApi = async () => {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST'
  });
  return res.json();
};
