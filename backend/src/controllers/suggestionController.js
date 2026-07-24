/**
 * Suggestion System Controller
 * Handles evaluation of conflict priority, reaction count incrementing, and suggestion dismissal.
 */

const dataStore = require('../data/dataStore');
const { evaluatePostConflictPairs } = require('../utils/scoringEngine');
const { generateConflictSuggestionMessage, DEFAULT_SAFE_MESSAGE } = require('../services/geminiService');

const SUGGESTION_THRESHOLD = 50;

/**
 * POST /api/suggestions/evaluate
 * Body: { postId }
 */
async function evaluateSuggestions(req, res) {
  try {
    const { postId } = req.body || {};

    if (!postId || typeof postId !== 'string' || !postId.trim()) {
      return res.status(400).json({ error: 'postId is required and must be a valid string' });
    }

    const post = await dataStore.getPostById(postId.trim());
    if (!post) {
      return res.status(404).json({ error: `Post with ID '${postId}' not found` });
    }

    // Run scoring function across all verified answer pairs
    const { maxScore, bestPair } = evaluatePostConflictPairs(post);

    const triggerType = 'conflict';
    const isDismissed = Array.isArray(post.dismissedSuggestions) && post.dismissedSuggestions.includes(triggerType);

    // If score clears threshold (score >= 50) and triggerType is not dismissed
    if (maxScore >= SUGGESTION_THRESHOLD && !isDismissed && bestPair) {
      const [answerA, answerB] = bestPair;

      let message;
      // Allow mock option override for testing step 2
      if (req.body.mock === true || process.env.SKIP_GEMINI === 'true') {
        message = DEFAULT_SAFE_MESSAGE;
      } else {
        message = await generateConflictSuggestionMessage(post, answerA, answerB, req.serviceOptions || {});
      }

      return res.status(200).json({
        hasSuggestion: true,
        triggerType,
        priorityScore: maxScore,
        message,
        relatedAnswerIds: [answerA.id, answerB.id]
      });
    }

    return res.status(200).json({
      hasSuggestion: false
    });

  } catch (err) {
    console.error('Unhandled error in evaluateSuggestions:', err);
    return res.status(500).json({ error: 'Internal server error evaluating suggestions' });
  }
}

/**
 * POST /api/answers/:id/confused
 * Increments and returns answer's confusedReactionCount
 */
async function incrementConfusedReaction(req, res) {
  try {
    const { id } = req.params;
    if (!id || !id.trim()) {
      return res.status(400).json({ error: 'Answer ID is required' });
    }

    const result = await dataStore.incrementAnswerConfused(id.trim());
    if (!result) {
      return res.status(404).json({ error: `Answer with ID '${id}' not found` });
    }

    return res.status(200).json({
      id: result.id,
      confusedReactionCount: result.confusedReactionCount
    });

  } catch (err) {
    console.error('Unhandled error in incrementConfusedReaction:', err);
    return res.status(500).json({ error: 'Internal server error incrementing reaction count' });
  }
}

/**
 * POST /api/suggestions/dismiss
 * Body: { postId, triggerType }
 */
async function dismissSuggestion(req, res) {
  try {
    const { postId, triggerType } = req.body || {};

    if (!postId || typeof postId !== 'string' || !postId.trim()) {
      return res.status(400).json({ error: 'postId is required' });
    }

    if (!triggerType || typeof triggerType !== 'string' || !triggerType.trim()) {
      return res.status(400).json({ error: 'triggerType is required' });
    }

    const updatedPost = await dataStore.dismissSuggestion(postId.trim(), triggerType.trim());
    if (!updatedPost) {
      return res.status(404).json({ error: `Post with ID '${postId}' not found` });
    }

    return res.status(200).json({
      dismissed: true,
      postId: updatedPost.id,
      dismissedSuggestions: updatedPost.dismissedSuggestions
    });

  } catch (err) {
    console.error('Unhandled error in dismissSuggestion:', err);
    return res.status(500).json({ error: 'Internal server error dismissing suggestion' });
  }
}

module.exports = {
  evaluateSuggestions,
  incrementConfusedReaction,
  dismissSuggestion
};
