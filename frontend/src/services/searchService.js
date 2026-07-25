import { apiRequest } from './api';

export const searchService = {
  // Universal search across posts, users, and subjects
  search: async (q, type = '') => {
    const params = new URLSearchParams({ q });
    if (type) params.append('type', type);
    return await apiRequest(`/search?${params.toString()}`, 'GET');
  }
};
