/**
 * Suggestion System Controller
 * Handles evaluation of conflict priority via evaluator framework, reaction count incrementing, and suggestion dismissal.
 */

const dataStore = require('../data/dataStore');
const evaluatorRegistry = require('../evaluators/evaluatorRegistry');
const conflictEvaluator = require('../evaluators/conflictEvaluator');
const { generateConflictSuggestionMessage, DEFAULT_SAFE_MESSAGE } = require('../services/geminiService');

// Register official conflict evaluator in production registry (exactly ONE real evaluator)
evaluatorRegistry.registerEvaluator(conflictEvaluator);

/**
 * POST /api/suggestions/evaluate
 * Body: { postId, userId }
 */
async function evaluateSuggestions(req, res) {
  try {
    const { postId, userId } = req.body || {};

    if (!postId || typeof postId !== 'string' || !postId.trim()) {
      return res.status(400).json({ error: 'postId is required and must be a valid string' });
    }

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      return res.status(400).json({ error: 'userId is required and must be a valid string' });
    }

    const post = await dataStore.getPostById(postId.trim());
    if (!post) {
      return res.status(404).json({ error: `Post with ID '${postId}' not found` });
    }

    const user = await dataStore.getUserById(userId.trim());
    if (!user) {
      return res.status(404).json({ error: `User with ID '${userId}' not found` });
    }

    // Execute evaluator framework
    const winningCandidate = evaluatorRegistry.evaluateAll(post, user);

    if (winningCandidate) {
      let message;

      if (winningCandidate.triggerType === 'conflict') {
        if (req.body.mock === true || process.env.SKIP_GEMINI === 'true') {
          message = DEFAULT_SAFE_MESSAGE;
        } else {
          message = await generateConflictSuggestionMessage(
            post, 
            winningCandidate.answerA, 
            winningCandidate.answerB, 
            req.serviceOptions || {}
          );
        }
      } else {
        // Generic message for non-conflict candidates (e.g. stub evaluators in testing)
        message = winningCandidate.message || 'Suggestion generated for post.';
      }

      return res.status(200).json({
        hasSuggestion: true,
        triggerType: winningCandidate.triggerType,
        priorityScore: winningCandidate.priorityScore,
        message,
        relatedAnswerIds: winningCandidate.relatedAnswerIds || []
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
