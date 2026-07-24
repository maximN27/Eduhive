import { apiRequest } from './api';

export const userService = {
  // Get public user profile
  getUserProfile: async (id) => {
    return await apiRequest(`/users/${id}`, 'GET');
  },

  // Update user profile
  updateUserProfile: async (id, profileData) => {
    return await apiRequest(`/users/${id}`, 'PUT', profileData);
  },

  // Get user created posts
  getUserPosts: async (id) => {
    return await apiRequest(`/users/${id}/posts`, 'GET');
  }
};
