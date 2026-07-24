/**
 * Conflict Evaluator for Conflict-Priority Suggestion System
 * 
 * Registered Evaluator Entry:
 * - triggerType: "conflict"
 * - bypassesToggle: true (bypasses per-user suggestionsEnabled toggle)
 * - threshold: 50
 * 
 * // TODO: Future pass may extract high confusedReactionCount without actual conflict 
 * // into its own distinct evaluator (e.g. triggerType: "high_confusion").
 */

const { evaluatePostConflictPairs } = require('../utils/scoringEngine');

const conflictEvaluator = {
  triggerType: 'conflict',
  bypassesToggle: true,
  threshold: 50,

  /**
   * Evaluates post conflict priority across verified professor answer pairs.
   * @param {Object} post 
   * @returns {Object|null}
   */
  evaluate(post) {
    const { maxScore, bestPair } = evaluatePostConflictPairs(post);

    if (maxScore <= 0 || !bestPair) {
      return null;
    }

    return {
      triggerType: 'conflict',
      priorityScore: maxScore,
      relatedAnswerIds: [bestPair[0].id, bestPair[1].id],
      answerA: bestPair[0],
      answerB: bestPair[1]
    };
  }
};

module.exports = conflictEvaluator;
