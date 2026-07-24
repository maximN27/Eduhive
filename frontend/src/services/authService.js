import { apiRequest } from './api';

export const authService = {
  // Register a new user account
  register: async (userData) => {
    const res = await apiRequest('/auth/register', 'POST', userData);
    if (res.token) {
      localStorage.setItem('eduhive_token', res.token);
    }
    return res;
  },

  // Login user with credentials
  login: async (credentials) => {
    const res = await apiRequest('/auth/login', 'POST', credentials);
    if (res.token) {
      localStorage.setItem('eduhive_token', res.token);
    }
    return res;
  },

  // Fetch logged in user profile
  getMe: async () => {
    return await apiRequest('/auth/me', 'GET');
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', 'POST');
    } catch (e) {
      // Ignore logout endpoint failures
    } finally {
      localStorage.removeItem('eduhive_token');
    }
  }
};
