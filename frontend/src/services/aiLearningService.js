import { apiRequest } from './api';

export const aiLearningService = {
  // Analyze active post for knowledge gaps
  analyzePostGaps: async (postId, postData) => {
    return await apiRequest('/ai-learning/analyze-post', 'POST', { postId, postData });
  },

  // Generate or fetch adaptive learning path for post/gap
  generateLearningPath: async (postId, gapId, postData) => {
    return await apiRequest('/ai-learning/generate-path', 'POST', { postId, gapId, postData });
  },

  // Update progress on a module step
  updateModuleStep: async (pathId, stepNumber, isCompleted) => {
    return await apiRequest(`/ai-learning/paths/${pathId}/modules/${stepNumber}`, 'PATCH', { isCompleted });
  },

  // Get recommended peer mentors for post/concept
  getMentorMatches: async (postId, conceptTag, postData) => {
    return await apiRequest('/ai-learning/mentor-matches', 'POST', { postId, conceptTag, postData });
  },

  // Request mentorship connection
  connectMentor: async (mentorId, conceptTag) => {
    return await apiRequest('/ai-learning/mentors/connect', 'POST', { mentorId, conceptTag });
  }
};
