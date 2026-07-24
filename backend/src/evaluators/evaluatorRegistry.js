/**
 * Extensible Evaluator Framework Registry
 * 
 * Registry storing evaluator objects of shape:
 * {
 *   triggerType: string,
 *   bypassesToggle: boolean,
 *   threshold: number,
 *   evaluate: (post) => { triggerType, priorityScore, relatedAnswerIds, ... } | null
 * }
 */

class EvaluatorRegistry {
  constructor() {
    this.evaluators = [];
  }

  /**
   * Register a new evaluator
   * @param {Object} evaluator 
   */
  registerEvaluator(evaluator) {
    if (!evaluator || typeof evaluator.evaluate !== 'function' || !evaluator.triggerType) {
      throw new Error('Invalid evaluator registration');
    }
    // Avoid duplicate registration by triggerType
    this.evaluators = this.evaluators.filter(e => e.triggerType !== evaluator.triggerType);
    this.evaluators.push(evaluator);
  }

  /**
   * Remove an evaluator by triggerType (mainly for testing)
   * @param {string} triggerType 
   */
  unregisterEvaluator(triggerType) {
    this.evaluators = this.evaluators.filter(e => e.triggerType !== triggerType);
  }

  /**
   * Reset registry to clean state
   */
  clear() {
    this.evaluators = [];
  }

  /**
   * Get all registered evaluators
   */
  getEvaluators() {
    return [...this.evaluators];
  }

  /**
   * Run all registered evaluators against a post and user.
   * 
   * Filter rules:
   * 1. Discard if triggerType is in post.dismissedSuggestions.
   * 2. Discard if bypassesToggle === false AND user.suggestionsEnabled === false.
   * 3. Discard if candidate priorityScore < evaluator.threshold.
   * 4. Among survivors, return the one with the highest priorityScore.
   * 
   * @param {Object} post 
   * @param {Object} user 
   * @returns {Object|null} Best surviving candidate evaluation or null
   */
  evaluateAll(post, user) {
    if (!post) return null;

    const dismissed = Array.isArray(post.dismissedSuggestions) ? post.dismissedSuggestions : [];
    const suggestionsEnabled = user && typeof user.suggestionsEnabled === 'boolean' ? user.suggestionsEnabled : true;

    let highestCandidate = null;

    for (const evaluator of this.evaluators) {
      // Rule 1: Dismissed check
      if (dismissed.includes(evaluator.triggerType)) {
        continue;
      }

      // Rule 2: Per-user suggestions toggle check
      if (evaluator.bypassesToggle === false && suggestionsEnabled === false) {
        continue;
      }

      // Execute evaluator logic
      const result = evaluator.evaluate(post);
      if (!result || typeof result.priorityScore !== 'number') {
        continue;
      }

      // Rule 3: Threshold check
      if (result.priorityScore >= evaluator.threshold) {
        // Rule 4: Pick highest scoring candidate
        if (!highestCandidate || result.priorityScore > highestCandidate.priorityScore) {
          highestCandidate = {
            ...result,
            evaluator
          };
        }
      }
    }

    return highestCandidate;
  }
}

const evaluatorRegistry = new EvaluatorRegistry();

module.exports = evaluatorRegistry;
