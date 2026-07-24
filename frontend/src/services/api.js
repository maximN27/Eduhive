const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper for API calls
 */
export async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const token = localStorage.getItem('eduhive_token');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `API Error (${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.warn(`[API] Error request ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

export default { apiRequest };
