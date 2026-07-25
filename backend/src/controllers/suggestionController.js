const {
  getPostById,
  getUserById,
  incrementConfusedReaction,
  dismissSuggestionOnPost,
  setUserPreference
} = require('../data/mockSuggestionsStore');
const { runEvaluators } = require('../services/evaluatorRegistry');
const { generateConflictMessage } = require('../services/geminiService');

/**
 * POST /api/suggestions/evaluate
 * Body: { postId, userId }
 */
async function evaluateSuggestions(req, res) {
  try {
    const { postId, userId } = req.body || {};

    if (!postId || !userId) {
      return res.status(400).json({ error: 'postId and userId are required parameters' });
    }

    const post = getPostById(postId);
    const user = getUserById(userId);

    if (!post || !user) {
      return res.status(404).json({ error: 'Post or User not found' });
    }

    // Optional custom evaluator registry override (used for testing toggle mechanics)
    const customRegistry = req.customRegistry || undefined;
    const winner = runEvaluators(post, user, customRegistry);

    if (!winner) {
      return res.status(200).json({ hasSuggestion: false });
    }

    let message = '';
    if (winner.triggerType === 'conflict' && winner.relatedAnswerIds) {
      const answerA = post.answers.find(a => a.id === winner.relatedAnswerIds[0]);
      const answerB = post.answers.find(a => a.id === winner.relatedAnswerIds[1]);
      message = await generateConflictMessage(post, answerA, answerB);
    } else {
      message = winner.message || 'Suggested action available for this post.';
    }

    return res.status(200).json({
      hasSuggestion: true,
      triggerType: winner.triggerType,
      priorityScore: winner.priorityScore,
      message,
      relatedAnswerIds: winner.relatedAnswerIds || []
    });
  } catch (err) {
    console.error('Unhandled Evaluate Suggestions Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /api/answers/:id/confused
 */
async function incrementConfused(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Answer ID is required' });
    }

    const updated = incrementConfusedReaction(id);
    if (!updated) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    return res.status(200).json({
      id: updated.id,
      confusedReactionCount: updated.confusedReactionCount
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /api/suggestions/dismiss
 * Body: { postId, triggerType }
 */
async function dismissSuggestion(req, res) {
  try {
    const { postId, triggerType } = req.body || {};
    if (!postId || !triggerType) {
      return res.status(400).json({ error: 'postId and triggerType are required' });
    }

    const success = dismissSuggestionOnPost(postId, triggerType);
    if (!success) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json({ dismissed: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/users/:id/preferences
 */
async function getUserPreferences(req, res) {
  try {
    const { id } = req.params;
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      userId: user.id,
      suggestionsEnabled: user.suggestionsEnabled
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * POST /api/users/:id/preferences
 * Body: { suggestionsEnabled }
 */
async function updateUserPreferences(req, res) {
  try {
    const { id } = req.params;
    const { suggestionsEnabled } = req.body || {};

    if (typeof suggestionsEnabled !== 'boolean') {
      return res.status(400).json({ error: 'suggestionsEnabled must be a boolean' });
    }

    const updatedUser = setUserPreference(id, suggestionsEnabled);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      userId: updatedUser.id,
      suggestionsEnabled: updatedUser.suggestionsEnabled
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  evaluateSuggestions,
  incrementConfused,
  dismissSuggestion,
  getUserPreferences,
  updateUserPreferences
};
