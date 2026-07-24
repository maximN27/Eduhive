/**
 * Scoring Engine for Conflict-Priority Suggestion System
 * 
 * TODO / ARCHITECTURAL NOTE:
 * Future pass may extract high confusedReactionCount without actual conflict 
 * into its own distinct evaluator (e.g. triggerType: "high_confusion").
 * For this build, confusedReactionCount is kept folded into the conflict score only.
 */

/**
 * Pure, deterministic function to calculate the conflict priority score between two answers on a post.
 * Enforces a strict HARD PRECONDITION: Both answers MUST be from verified professors.
 * 
 * @param {Object} post - The post object containing communityTag, viewCount, etc.
 * @param {Object} answerA - First answer object.
 * @param {Object} answerB - Second answer object.
 * @returns {number} Calculated priority score (returns 0 if hard precondition fails).
 */
function calculateConflictPriority(post, answerA, answerB) {
  if (!post || !answerA || !answerB) {
    return 0;
  }

  // HARD PRECONDITION: Both answers MUST be from verified professors
  const isAnswerAVerifiedProf = answerA.authorRole === 'professor' && answerA.isVerified === true;
  const isAnswerBVerifiedProf = answerB.authorRole === 'professor' && answerB.isVerified === true;

  if (!isAnswerAVerifiedProf || !isAnswerBVerifiedProf) {
    return 0;
  }

  // Base score starting at +40 for dual verified professors
  let score = 40;

  // 1. Differing conclusion fields (+30)
  const conclusionA = (answerA.conclusion || '').trim();
  const conclusionB = (answerB.conclusion || '').trim();
  if (conclusionA && conclusionB && conclusionA !== conclusionB) {
    score += 30;
  }

  // 2. View count bonus (+10 if > 20, else +5 if > 5)
  const viewCount = post.viewCount || 0;
  if (viewCount > 20) {
    score += 10;
  } else if (viewCount > 5) {
    score += 5;
  }

  // 3. No answer has a resolving comment (+10)
  if (!answerA.hasResolvingComment && !answerB.hasResolvingComment) {
    score += 10;
  }

  // 4. Combined confused reaction count (+2 per reaction, max +10)
  const confusedA = answerA.confusedReactionCount || 0;
  const confusedB = answerB.confusedReactionCount || 0;
  const combinedConfused = confusedA + confusedB;
  const confusedScore = Math.min(10, combinedConfused * 2);
  score += confusedScore;

  // 5. Fast-changing-field bonus (+5 if communityTag is cs, ai, or ml)
  const fastChangingTags = ['cs', 'ai', 'ml'];
  const tag = (post.communityTag || '').toLowerCase().trim();
  if (fastChangingTags.includes(tag)) {
    score += 5;
  }

  return score;
}

/**
 * Helper function to evaluate all verified answer pairs on a post
 * and return the highest scoring pair and its score.
 * 
 * @param {Object} post 
 * @returns {Object} { maxScore, bestPair: [answerA, answerB] | null }
 */
function evaluatePostConflictPairs(post) {
  if (!post || !Array.isArray(post.answers)) {
    return { maxScore: 0, bestPair: null };
  }

  // Filter verified professor answers only
  const verifiedProfAnswers = post.answers.filter(a => a.authorRole === 'professor' && a.isVerified === true);
  if (verifiedProfAnswers.length < 2) {
    return { maxScore: 0, bestPair: null };
  }

  let maxScore = 0;
  let bestPair = null;

  for (let i = 0; i < verifiedProfAnswers.length; i++) {
    for (let j = i + 1; j < verifiedProfAnswers.length; j++) {
      const answerA = verifiedProfAnswers[i];
      const answerB = verifiedProfAnswers[j];
      const score = calculateConflictPriority(post, answerA, answerB);
      if (score > maxScore) {
        maxScore = score;
        bestPair = [answerA, answerB];
      }
    }
  }

  return { maxScore, bestPair };
}

module.exports = {
  calculateConflictPriority,
  evaluatePostConflictPairs
};
