/**
 * Scoring Engine for Conflict-Priority Suggestion System
 * 
 * OPEN QUESTION / ARCHITECTURAL NOTE:
 * Should a high confusedReactionCount with no actual conflict present produce a distinct suggestion type 
 * (e.g., triggerType: "high_confusion") in a future pass?
 * For this build, confusedReactionCount is kept folded into the conflict score only (+2 per combined reaction, max +10),
 * as per system specifications.
 */

/**
 * Pure, deterministic function to calculate the conflict priority score between two answers on a post.
 * 
 * @param {Object} post - The post object containing communityTag, viewCount, etc.
 * @param {Object} answerA - First answer object.
 * @param {Object} answerB - Second answer object.
 * @returns {number} Calculated priority score.
 */
function calculateConflictPriority(post, answerA, answerB) {
  let score = 0;

  if (!post || !answerA || !answerB) {
    return 0;
  }

  // 1. Both answers are from verified professors (+40)
  const isAnswerAVerifiedProf = answerA.authorRole === 'professor' && answerA.isVerified === true;
  const isAnswerBVerifiedProf = answerB.authorRole === 'professor' && answerB.isVerified === true;
  if (isAnswerAVerifiedProf && isAnswerBVerifiedProf) {
    score += 40;
  }

  // 2. Differing conclusion fields (+30)
  const conclusionA = (answerA.conclusion || '').trim();
  const conclusionB = (answerB.conclusion || '').trim();
  if (conclusionA && conclusionB && conclusionA !== conclusionB) {
    score += 30;
  }

  // 3. View count bonus (+10 if > 20, else +5 if > 5)
  const viewCount = post.viewCount || 0;
  if (viewCount > 20) {
    score += 10;
  } else if (viewCount > 5) {
    score += 5;
  }

  // 4. No answer has a resolving comment (+10)
  if (!answerA.hasResolvingComment && !answerB.hasResolvingComment) {
    score += 10;
  }

  // 5. Combined confused reaction count (+2 per reaction, max +10)
  const confusedA = answerA.confusedReactionCount || 0;
  const confusedB = answerB.confusedReactionCount || 0;
  const combinedConfused = confusedA + confusedB;
  const confusedScore = Math.min(10, combinedConfused * 2);
  score += confusedScore;

  // 6. Fast-changing-field bonus (+5 if communityTag is cs, ai, or ml)
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

  // Filter verified answers only
  const verifiedAnswers = post.answers.filter(a => a.isVerified === true);
  if (verifiedAnswers.length < 2) {
    return { maxScore: 0, bestPair: null };
  }

  let maxScore = 0;
  let bestPair = null;

  for (let i = 0; i < verifiedAnswers.length; i++) {
    for (let j = i + 1; j < verifiedAnswers.length; j++) {
      const answerA = verifiedAnswers[i];
      const answerB = verifiedAnswers[j];
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
