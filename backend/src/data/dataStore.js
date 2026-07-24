/**
 * In-Memory Data Store & Repository Abstraction
 * Structured to cleanly interface with MongoDB/Mongoose in future passes.
 */

const { INITIAL_FIXTURE_POSTS } = require('./fixtures');

class DataStore {
  constructor() {
    this.reset();
  }

  /**
   * Reset store to initial fixture state (useful between automated tests)
   */
  reset() {
    // Deep clone fixture posts to prevent mutation leaks across test runs
    this.posts = JSON.parse(JSON.stringify(INITIAL_FIXTURE_POSTS));
  }

  /**
   * Get post by ID
   * @param {string} postId 
   * @returns {Object|null}
   */
  async getPostById(postId) {
    if (!postId) return null;
    const post = this.posts.find(p => p.id === postId);
    return post ? JSON.parse(JSON.stringify(post)) : null;
  }

  /**
   * Add triggerType to post's dismissedSuggestions array if not already present
   * @param {string} postId 
   * @param {string} triggerType 
   * @returns {Object|null} Updated post or null if post not found
   */
  async dismissSuggestion(postId, triggerType) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    if (!Array.isArray(post.dismissedSuggestions)) {
      post.dismissedSuggestions = [];
    }

    if (!post.dismissedSuggestions.includes(triggerType)) {
      post.dismissedSuggestions.push(triggerType);
    }

    return JSON.parse(JSON.stringify(post));
  }

  /**
   * Find answer by ID across all posts and increment its confusedReactionCount by 1
   * @param {string} answerId 
   * @returns {Object|null} { id, confusedReactionCount } or null if not found
   */
  async incrementAnswerConfused(answerId) {
    if (!answerId) return null;

    for (const post of this.posts) {
      if (Array.isArray(post.answers)) {
        const answer = post.answers.find(a => a.id === answerId);
        if (answer) {
          answer.confusedReactionCount = (answer.confusedReactionCount || 0) + 1;
          return {
            id: answer.id,
            confusedReactionCount: answer.confusedReactionCount
          };
        }
      }
    }

    return null;
  }
}

// Export singleton instance
const dataStore = new DataStore();

module.exports = dataStore;
