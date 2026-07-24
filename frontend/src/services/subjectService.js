import { apiRequest } from './api';

export const subjectService = {
  // Get all subjects
  getSubjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/subjects${query ? `?${query}` : ''}`;
    return await apiRequest(endpoint, 'GET');
  },

  // Get subject details by ID
  getSubjectById: async (id) => {
    return await apiRequest(`/subjects/${id}`, 'GET');
  },

  // Create new subject
  createSubject: async (subjectData) => {
    return await apiRequest('/subjects', 'POST', subjectData);
  },

  // Get posts for a specific subject
  getSubjectPosts: async (id) => {
    return await apiRequest(`/subjects/${id}/posts`, 'GET');
  }
};
