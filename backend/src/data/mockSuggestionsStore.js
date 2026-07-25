/**
 * Mock / In-Memory Data Layer for Suggestions Service
 * Designed to later map 1-to-1 to MongoDB collections without changing API contracts.
 */

const mockUsers = [
  {
    id: 'user-1',
    name: 'Dr. Alice Vance',
    role: 'professor',
    suggestionsEnabled: true
  },
  {
    id: 'user-2',
    name: 'Bob Student',
    role: 'student',
    suggestionsEnabled: false
  },
  {
    id: 'user-3',
    name: 'Charlie Scholar',
    role: 'professor',
    suggestionsEnabled: true
  }
];

const mockPosts = [
  {
    id: 'post-conflict-1',
    title: 'Graph Neural Network Convergence Bounds',
    communityTag: 'cs',
    viewCount: 25,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Spectral Graph Convolution achieves O(N log N) convergence.',
        conclusion: 'O(N log N) Spectral Bound',
        confusedReactionCount: 2,
        hasResolvingComment: false
      },
      {
        id: 'ans-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Spatial Message Passing achieves O(N) linear convergence under sparsity.',
        conclusion: 'O(N) Spatial Bound',
        confusedReactionCount: 1,
        hasResolvingComment: false
      }
    ]
  },
  {
    id: 'post-borderline-50',
    title: 'Borderline Score 50 Evaluation Post',
    communityTag: 'cs',
    viewCount: 6,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-b50-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Standard analysis applies.',
        conclusion: 'Standard Bound',
        confusedReactionCount: 0,
        hasResolvingComment: true // 0 points for resolving comment
      },
      {
        id: 'ans-b50-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Identical standard conclusion.',
        conclusion: 'Standard Bound', // 0 points for differing conclusion
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
    // Calculation: 40 (profs) + 0 (diff conclusion) + 5 (views=6>5) + 0 (hasResolving=true) + 0 (confused=0) + 5 (tag=cs) = 50
  },
  {
    id: 'post-borderline-48',
    title: 'Borderline Score 48 Evaluation Post',
    communityTag: 'history',
    viewCount: 4,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-b48-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'Historical perspective A.',
        conclusion: 'Perspective A',
        confusedReactionCount: 4,
        hasResolvingComment: true
      },
      {
        id: 'ans-b48-2',
        authorRole: 'professor',
        isVerified: true,
        content: 'Historical perspective A.',
        conclusion: 'Perspective A',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
    // Calculation: 40 (profs) + 0 (diff conclusion) + 0 (views=4<=5) + 0 (hasResolving=true) + 8 (confused=4*2=8) + 0 (tag=history) = 48
  },
  {
    id: 'post-student-prof',
    title: 'Student vs Professor Disagreement Post',
    communityTag: 'ai',
    viewCount: 100,
    dismissedSuggestions: [],
    answers: [
      {
        id: 'ans-stud-1',
        authorRole: 'student',
        isVerified: false,
        content: 'I think gradient descent diverges here.',
        conclusion: 'Divergent',
        confusedReactionCount: 5,
        hasResolvingComment: false
      },
      {
        id: 'ans-prof-1',
        authorRole: 'professor',
        isVerified: true,
        content: 'With learning rate < 0.01 it strictly converges.',
        conclusion: 'Convergent',
        confusedReactionCount: 5,
        hasResolvingComment: false
      }
    ]
    // Calculation: Gate fails -> Score = 0
  },
  {
    id: 'post-dismissed-1',
    title: 'Dismissed Conflict Post',
    communityTag: 'ml',
    viewCount: 50,
    dismissedSuggestions: ['conflict'],
    answers: [
      {
        id: 'ans-d1-1',
        authorRole: 'professor',
        isVerified: true,
        conclusion: 'Theory A',
        confusedReactionCount: 0,
        hasResolvingComment: false
      },
      {
        id: 'ans-d1-2',
        authorRole: 'professor',
        isVerified: true,
        conclusion: 'Theory B',
        confusedReactionCount: 0,
        hasResolvingComment: false
      }
    ]
  }
];

// Helper functions for mock store operations
function getPostById(postId) {
  return mockPosts.find(p => p.id === postId) || null;
}

function getUserById(userId) {
  return mockUsers.find(u => u.id === userId) || null;
}

function getAnswerById(answerId) {
  for (const post of mockPosts) {
    const ans = post.answers.find(a => a.id === answerId);
    if (ans) return ans;
  }
  return null;
}

function incrementConfusedReaction(answerId) {
  const ans = getAnswerById(answerId);
  if (!ans) return null;
  ans.confusedReactionCount = (ans.confusedReactionCount || 0) + 1;
  return ans;
}

function dismissSuggestionOnPost(postId, triggerType) {
  const post = getPostById(postId);
  if (!post) return false;
  if (!Array.isArray(post.dismissedSuggestions)) {
    post.dismissedSuggestions = [];
  }
  if (!post.dismissedSuggestions.includes(triggerType)) {
    post.dismissedSuggestions.push(triggerType);
  }
  return true;
}

function setUserPreference(userId, suggestionsEnabled) {
  const user = getUserById(userId);
  if (!user) return null;
  user.suggestionsEnabled = Boolean(suggestionsEnabled);
  return user;
}

module.exports = {
  mockUsers,
  mockPosts,
  getPostById,
  getUserById,
  getAnswerById,
  incrementConfusedReaction,
  dismissSuggestionOnPost,
  setUserPreference
};
