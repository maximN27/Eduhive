const { test, describe } = require('node:test');
const assert = require('node:assert');
const { calculateConflictPriority, evaluatePostConflictPairs } = require('../src/utils/scoringEngine');

describe('Conflict Priority Scoring Engine Tests', () => {

  test('(a) Two verified professors, differing conclusions, high views, no resolving comment -> score >= 50', () => {
    const post = { communityTag: 'cs', viewCount: 25, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Approach X is optimal', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Approach Y is optimal', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    // Breakdown: 40 (two profs) + 30 (differing conclusions) + 10 (views > 20) + 10 (no resolving comment) + 0 (confused) + 5 (cs tag) = 95
    assert.ok(score >= 50, `Expected score >= 50, got ${score}`);
    assert.strictEqual(score, 95);
  });

  test('(b) One student one professor, differing conclusions -> score well below 50', () => {
    const post = { communityTag: 'history', viewCount: 2, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'student', isVerified: true, conclusion: 'Option A', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Option B', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    // Breakdown: 0 (not dual profs) + 30 (differing conclusions) + 0 (views <= 5) + 10 (no resolving comment) + 0 (confused) + 0 (non-tech tag) = 40
    assert.ok(score < 50, `Expected score < 50, got ${score}`);
    assert.strictEqual(score, 40);
  });

  test('(c) Two verified professors, same conclusion -> score below 50', () => {
    const post = { communityTag: 'biology', viewCount: 2, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Same conclusion text', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Same conclusion text', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    // Breakdown: 40 (two profs) + 0 (same conclusion) + 0 (views <= 5) + 0 (hasResolvingComment on answerA) = 40
    assert.ok(score < 50, `Expected score < 50, got ${score}`);
    assert.strictEqual(score, 40);
  });

  test('(d) Same as (a) but hasResolvingComment true -> confirm score decreases', () => {
    const post = { communityTag: 'cs', viewCount: 25, dismissedSuggestions: [], answers: [] };
    const answerBaseA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Approach X', confusedReactionCount: 0, hasResolvingComment: false };
    const answerBaseB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Approach Y', confusedReactionCount: 0, hasResolvingComment: false };

    const baseScore = calculateConflictPriority(post, answerBaseA, answerBaseB);

    const answerResolvedA = { ...answerBaseA, hasResolvingComment: true };
    const scoreWithResolving = calculateConflictPriority(post, answerResolvedA, answerBaseB);

    assert.strictEqual(scoreWithResolving, baseScore - 10, 'Score should decrease by 10 when hasResolvingComment is true');
  });

  test('(e) Same as (a) but viewCount = 2 -> confirm score decreases', () => {
    const postHighViews = { communityTag: 'cs', viewCount: 25, dismissedSuggestions: [], answers: [] };
    const postLowViews = { communityTag: 'cs', viewCount: 2, dismissedSuggestions: [], answers: [] };

    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Approach X', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Approach Y', confusedReactionCount: 0, hasResolvingComment: false };

    const scoreHigh = calculateConflictPriority(postHighViews, answerA, answerB);
    const scoreLow = calculateConflictPriority(postLowViews, answerA, answerB);

    assert.strictEqual(scoreLow, scoreHigh - 10, 'Score should decrease by 10 when viewCount is <= 5 vs > 20');
  });

  test('(f) Confirm fast-changing-field bonus in isolation by comparing identical setups differing only in communityTag', () => {
    const postTech = { communityTag: 'ai', viewCount: 10, dismissedSuggestions: [], answers: [] };
    const postNonTech = { communityTag: 'literature', viewCount: 10, dismissedSuggestions: [], answers: [] };

    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Conclusion A', confusedReactionCount: 1, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Conclusion B', confusedReactionCount: 1, hasResolvingComment: false };

    const scoreTech = calculateConflictPriority(postTech, answerA, answerB);
    const scoreNonTech = calculateConflictPriority(postNonTech, answerA, answerB);

    assert.strictEqual(scoreTech, scoreNonTech + 5, 'Fast changing field tag (ai/cs/ml) should grant isolated +5 bonus');
  });

});
