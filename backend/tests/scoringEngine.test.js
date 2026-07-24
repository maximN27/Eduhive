const { test, describe } = require('node:test');
const assert = require('node:assert');
const { calculateConflictPriority, evaluatePostConflictPairs } = require('../src/utils/scoringEngine');
const { INITIAL_FIXTURE_POSTS } = require('../src/data/fixtures');

describe('Conflict Priority Scoring Engine Tests', () => {

  test('(a) Two verified professors, differing conclusions, high views, no resolving comment -> score >= 50', () => {
    const post = { communityTag: 'cs', viewCount: 25, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Approach X is optimal', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Approach Y is optimal', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    // Breakdown: 40 (two profs gate) + 30 (differing conclusions) + 10 (views > 20) + 10 (no resolving comment) + 0 (confused) + 5 (cs tag) = 95
    assert.ok(score >= 50, `Expected score >= 50, got ${score}`);
    assert.strictEqual(score, 95);
  });

  test('(b) Student vs professor -> returns score = 0 due to hard precondition', () => {
    const post = { communityTag: 'history', viewCount: 2, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'student', isVerified: true, conclusion: 'Option A', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Option B', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    assert.strictEqual(score, 0, `Hard precondition: student-vs-prof MUST return 0, got ${score}`);
  });

  test('(c) Two verified professors, same conclusion, resolving comment -> score below 50', () => {
    const post = { communityTag: 'biology', viewCount: 2, dismissedSuggestions: [], answers: [] };
    const answerA = { id: 'a1', authorRole: 'professor', isVerified: true, conclusion: 'Same conclusion text', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { id: 'a2', authorRole: 'professor', isVerified: true, conclusion: 'Same conclusion text', confusedReactionCount: 0, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    // Breakdown: 40 (two profs) + 0 (same conclusion) + 0 (views <= 5) + 0 (hasResolvingComment) = 40
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

  test('Borderline Fixture 50: Dual profs, same conclusion (+0), viewCount=6 (+5), resolving comment (+0), cs tag (+5) -> score EXACTLY 50', () => {
    const post50 = INITIAL_FIXTURE_POSTS.find(p => p.id === 'post-borderline-50');
    const { maxScore } = evaluatePostConflictPairs(post50);
    assert.strictEqual(maxScore, 50, `Expected score 50, got ${maxScore}`);
    assert.ok(maxScore >= 50, 'Score 50 clears threshold (>= 50)');
  });

  test('Borderline Fixture 48: Dual profs, same conclusion (+0), viewCount=2 (+0), resolving comment (+0), confused=4 (+8), nontech tag (+0) -> score EXACTLY 48', () => {
    const post48 = INITIAL_FIXTURE_POSTS.find(p => p.id === 'post-borderline-48');
    const { maxScore } = evaluatePostConflictPairs(post48);
    assert.strictEqual(maxScore, 48, `Expected score 48, got ${maxScore}`);
    assert.ok(maxScore < 50, 'Score 48 fails threshold (< 50)');
  });

  test('REGRESSION TEST: Student-vs-professor conflict with 100 views and CS tag returns score = 0', () => {
    const postStudentProfHighViews = INITIAL_FIXTURE_POSTS.find(p => p.id === 'post-student-prof-high-views');
    const answerS = postStudentProfHighViews.answers[0];
    const answerP = postStudentProfHighViews.answers[1];

    const pairScore = calculateConflictPriority(postStudentProfHighViews, answerS, answerP);
    const { maxScore } = evaluatePostConflictPairs(postStudentProfHighViews);

    assert.strictEqual(pairScore, 0, 'Student-vs-professor pair MUST score 0');
    assert.strictEqual(maxScore, 0, 'Post with no dual-verified-prof pair MUST evaluate to 0');
  });

});
