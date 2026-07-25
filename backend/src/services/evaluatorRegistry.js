const { calculateConflictPriority } = require('../utils/conflictScoring');

/**
 * Real Conflict Evaluator Entry
 * Evaluates embedded answers for verified professor conflicts.
 * Bypasses per-user suggestions toggle because high-priority expert conflicts are critical.
 */
const conflictEvaluator = {
  triggerType: 'conflict',
  bypassesToggle: true,
  threshold: 50,
  evaluate: (post) => {
    // TODO: A confusedReactionCount signal stays folded into the conflict score only. It could become its own evaluator later.
    if (!post || !Array.isArray(post.answers) || post.answers.length < 2) {
      return null;
    }

    let highestScore = 0;
    let bestPair = null;

    const answers = post.answers;
    for (let i = 0; i < answers.length; i++) {
      for (let j = i + 1; j < answers.length; j++) {
        const answerA = answers[i];
        const answerB = answers[j];

        const score = calculateConflictPriority(post, answerA, answerB);
        if (score > highestScore) {
          highestScore = score;
          bestPair = [answerA.id, answerB.id];
        }
      }
    }

    if (highestScore >= conflictEvaluator.threshold && bestPair) {
      return {
        triggerType: 'conflict',
        priorityScore: highestScore,
        relatedAnswerIds: bestPair,
        candidate: true
      };
    }

    return null;
  }
};

/**
 * Default Shipped Registry - contains exactly ONE real registered entry ('conflict').
 */
const shippedRegistry = [conflictEvaluator];

/**
 * Run registered evaluators against a post and user.
 * 
 * Rules:
 * 1. Discard any candidate whose triggerType is in post.dismissedSuggestions.
 * 2. Discard candidate from an evaluator with bypassesToggle: false if user.suggestionsEnabled === false.
 * 3. Among survivors clearing their threshold, select the candidate with the highest priorityScore.
 */
function runEvaluators(post, user, customRegistry = shippedRegistry) {
  if (!post) return null;

  const dismissed = Array.isArray(post.dismissedSuggestions) ? post.dismissedSuggestions : [];
  const suggestionsEnabled = user ? Boolean(user.suggestionsEnabled) : true;

  const candidates = [];

  for (const evaluator of customRegistry) {
    // 1. Suppress if triggerType dismissed on post
    if (dismissed.includes(evaluator.triggerType)) {
      continue;
    }

    // 2. Suppress if toggle respects user preferences and user disabled suggestions
    if (!evaluator.bypassesToggle && suggestionsEnabled === false) {
      continue;
    }

    // 3. Evaluate candidate
    const result = evaluator.evaluate(post);
    if (result && result.candidate && Number(result.priorityScore) >= Number(evaluator.threshold)) {
      candidates.push(result);
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Pick winner with highest priorityScore
  candidates.sort((a, b) => b.priorityScore - a.priorityScore);
  return candidates[0];
}

module.exports = {
  conflictEvaluator,
  shippedRegistry,
  runEvaluators
};
