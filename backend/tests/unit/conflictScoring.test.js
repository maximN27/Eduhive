const { calculateConflictPriority } = require('../../src/utils/conflictScoring');

describe('calculateConflictPriority Unit Tests', () => {

  // Case 1: Clear Positive
  test('Case 1: Clear positive conflict between two verified professors', () => {
    const post = { viewCount: 25, communityTag: 'cs' };
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Conclusion A', confusedReactionCount: 1, hasResolvingComment: false };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Conclusion B', confusedReactionCount: 1, hasResolvingComment: false };

    // Calculation: 40 + 30 (diff conclusion) + 10 (views>20) + 10 (no resolving) + 4 (confused=2*2) + 5 (tag=cs) = 99
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(99);
    expect(score >= 50).toBe(true);
  });

  // Case 2: Student vs Professor (Gate Rejected)
  test('Case 2: Student-vs-Professor conflict rejects at precondition gate and scores 0', () => {
    const post = { viewCount: 100, communityTag: 'cs' };
    const answerA = { authorRole: 'student', isVerified: false, conclusion: 'Conclusion A', confusedReactionCount: 5, hasResolvingComment: false };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Conclusion B', confusedReactionCount: 5, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(0);
    expect(score >= 50).toBe(false);
  });

  // Case 3: Same Conclusion
  test('Case 3: Both verified professors with identical conclusion', () => {
    const post = { viewCount: 25, communityTag: 'history' };
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Identical Conclusion', confusedReactionCount: 0, hasResolvingComment: false };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Identical Conclusion', confusedReactionCount: 0, hasResolvingComment: false };

    // Calculation: 40 + 0 (same conclusion) + 10 (views>20) + 10 (no resolving) + 0 + 0 = 60
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(60);
    expect(score >= 50).toBe(true);
  });

  // Case 4: Resolved in Comments
  test('Case 4: Professors differing conclusions with resolving comment', () => {
    const post = { viewCount: 25, communityTag: 'history' };
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Option A', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Option B', confusedReactionCount: 0, hasResolvingComment: false };

    // Calculation: 40 + 30 (diff conclusion) + 10 (views>20) + 0 (hasResolving) + 0 + 0 = 80
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(80);
    expect(score >= 50).toBe(true);
  });

  // Case 5: Low Traffic
  test('Case 5: Low traffic post (viewCount <= 5)', () => {
    const post = { viewCount: 2, communityTag: 'history' };
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Option A', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Option B', confusedReactionCount: 0, hasResolvingComment: false };

    // Calculation: 40 + 30 (diff conclusion) + 0 (views<=5) + 0 (hasResolving) + 0 + 0 = 70
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(70);
    expect(score >= 50).toBe(true);
  });

  // Case 6: Fast-Changing Field Bonus Isolation
  test('Case 6: Fast-changing field community tag bonus isolation', () => {
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 0, hasResolvingComment: false };

    const postAI = { viewCount: 2, communityTag: 'ai' };
    const postHistory = { viewCount: 2, communityTag: 'history' };

    const scoreAI = calculateConflictPriority(postAI, answerA, answerB); // 40 + 5 = 45
    const scoreHistory = calculateConflictPriority(postHistory, answerA, answerB); // 40 + 0 = 40

    expect(scoreAI - scoreHistory).toBe(5);
  });

  // Borderline Case: Exactly 50 (Qualifies)
  test('Borderline Pair: Exactly 50 points qualifies (score >= 50)', () => {
    const post = { viewCount: 6, communityTag: 'cs' }; // views > 5 (+5), tag cs (+5)
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 0, hasResolvingComment: true };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 0, hasResolvingComment: false };

    // Calculation: 40 + 0 (same conclusion) + 5 (views=6>5) + 0 (hasResolving=true) + 0 (confused=0) + 5 (tag=cs) = 50
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(50);
    expect(score >= 50).toBe(true);
  });

  // Borderline Case: Exactly 48 (Does NOT Qualify)
  test('Borderline Pair: Exactly 48 points does NOT qualify (score >= 50 is false)', () => {
    const post = { viewCount: 4, communityTag: 'history' }; // views <= 5 (+0), tag history (+0)
    const answerA = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 4, hasResolvingComment: true }; // confused=4 -> +8
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Same', confusedReactionCount: 0, hasResolvingComment: false };

    // Calculation: 40 + 0 (same conclusion) + 0 (views=4<=5) + 0 (hasResolving=true) + 8 (confused=4*2) + 0 (tag=history) = 48
    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(48);
    expect(score >= 50).toBe(false);
  });

  // Hard Precondition Regression Test
  test('Regression Test: Student-vs-Professor conflict NEVER qualifies regardless of high views, differing conclusions or AI tags', () => {
    const post = { viewCount: 1000, communityTag: 'ai' };
    const answerA = { authorRole: 'student', isVerified: false, conclusion: 'Student Opinion A', confusedReactionCount: 10, hasResolvingComment: false };
    const answerB = { authorRole: 'professor', isVerified: true, conclusion: 'Prof Conclusion B', confusedReactionCount: 10, hasResolvingComment: false };

    const score = calculateConflictPriority(post, answerA, answerB);
    expect(score).toBe(0);
    expect(score >= 50).toBe(false);
  });

});
