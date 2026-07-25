import { apiRequest } from './api';

export const postService = {
  // Get all posts with optional filters (subjectId, tag, search, authorId)
  getPosts: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    const endpoint = `/posts${query ? `?${query}` : ''}`;
    return await apiRequest(endpoint, 'GET');
  },

  // Get post details by ID
  getPostById: async (id) => {
    return await apiRequest(`/posts/${id}`, 'GET');
  },

  // Create new post
  createPost: async (postData) => {
    return await apiRequest('/posts', 'POST', postData);
  },

  // Update existing post
  updatePost: async (id, postData) => {
    return await apiRequest(`/posts/${id}`, 'PUT', postData);
  },

  // Delete post
  deletePost: async (id) => {
    return await apiRequest(`/posts/${id}`, 'DELETE');
  },

  // Toggle saving a post
  toggleSavePost: async (id) => {
    return await apiRequest(`/posts/${id}/save`, 'POST');
  },

  // Get comments for a post
  getPostComments: async (id) => {
    return await apiRequest(`/posts/${id}/comments`, 'GET');
  },

  // Add comment to a post
  addPostComment: async (id, commentData) => {
    return await apiRequest(`/posts/${id}/comments`, 'POST', commentData);
  },

  // Get resources for a post
  getPostResources: async (id) => {
    return await apiRequest(`/posts/${id}/resources`, 'GET');
  },

  // Attach a resource to a post
  addPostResource: async (id, resourceData) => {
    return await apiRequest(`/posts/${id}/resources`, 'POST', resourceData);
  },

  // Summarize post with Gemini AI
  summarizePost: async (id) => {
    return await apiRequest(`/posts/${id}/summarize`, 'POST');
  },

  // Get AI resource recommendations
  getRecommendations: async (payload) => {
    return await apiRequest('/ai/recommend', 'POST', payload);
  }
};
