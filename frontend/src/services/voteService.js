import { apiRequest } from './api';

export const voteService = {
  // Cast or toggle vote on Post, Comment, or Resource
  castVote: async (targetType, targetId, voteType = 'up') => {
    return await apiRequest('/votes', 'POST', {
      targetType,
      targetId,
      voteType
    });
  }
};
