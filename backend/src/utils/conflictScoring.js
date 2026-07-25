/**
 * Calculate Conflict Priority Score between two answers on an academic post.
 * 
 * Hard Precondition Gate:
 * Both answers MUST be authored by verified professors (authorRole === 'professor' && isVerified === true).
 * If either answer fails this check (e.g. student vs professor), returns 0.
 * 
 * Scoring Weights (when both are verified professors):
 * - Base Professor Pair: +40
 * - Differing Conclusions: +30 (if answerA.conclusion !== answerB.conclusion)
 * - View Count: +10 if viewCount > 20, else +5 if viewCount > 5, else 0
 * - No Resolving Comment: +10 if neither answer has hasResolvingComment === true
 * - Confused Reaction Count: +2 per combined confusedReactionCount (max +10)
 * - Fast-Changing Community Tag: +5 if communityTag in ["cs", "ai", "ml"]
 * 
 * Threshold for qualification: score >= 50
 */
function calculateConflictPriority(post, answerA, answerB) {
  if (!post || !answerA || !answerB) return 0;

  // Hard Precondition Gate: Both answers MUST be verified professors
  const isAnswerAVerifiedProf = (answerA.authorRole === 'professor' || answerA.role === 'professor') && (answerA.isVerified === true || answerA.verified === true);
  const isAnswerBVerifiedProf = (answerB.authorRole === 'professor' || answerB.role === 'professor') && (answerB.isVerified === true || answerB.verified === true);

  if (!isAnswerAVerifiedProf || !isAnswerBVerifiedProf) {
    return 0;
  }

  let score = 40; // Base score for two verified professors

  // 1. Differing Conclusions (+30)
  const conclusionA = String(answerA.conclusion || '').trim().toLowerCase();
  const conclusionB = String(answerB.conclusion || '').trim().toLowerCase();
  if (conclusionA && conclusionB && conclusionA !== conclusionB) {
    score += 30;
  }

  // 2. View Count (+10 if > 20, +5 if > 5)
  const viewCount = Number(post.viewCount || 0);
  if (viewCount > 20) {
    score += 10;
  } else if (viewCount > 5) {
    score += 5;
  }

  // 3. No Resolving Comment (+10 if neither answer has resolving comment)
  const hasResolvingA = Boolean(answerA.hasResolvingComment);
  const hasResolvingB = Boolean(answerB.hasResolvingComment);
  if (!hasResolvingA && !hasResolvingB) {
    score += 10;
  }

  // 4. Confused Reaction Count (+2 per combined, up to +10 max)
  const confusedA = Number(answerA.confusedReactionCount || 0);
  const confusedB = Number(answerB.confusedReactionCount || 0);
  const combinedConfused = confusedA + confusedB;
  score += Math.min(10, combinedConfused * 2);

  // 5. Fast-changing field community tag bonus (+5 if communityTag in ["cs", "ai", "ml"])
  const tag = String(post.communityTag || post.subjectId || '').trim().toLowerCase();
  if (['cs', 'ai', 'ml'].includes(tag)) {
    score += 5;
  }

  return score;
}

module.exports = {
  calculateConflictPriority
};
