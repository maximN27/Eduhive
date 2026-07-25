const request = require('supertest');
const express = require('express');
const suggestionRoutes = require('../../src/routes/suggestionRoutes');
const { getPostById, getUserById } = require('../../src/data/mockSuggestionsStore');
const { DEFAULT_FALLBACK_MESSAGE } = require('../../src/services/geminiService');

// Create test express app
const app = express();
app.use(express.json());
app.use('/api', suggestionRoutes);

describe('Conflict-Priority Suggestion System Integration API Tests', () => {

  // 1. Evaluate Endpoint Basic Mock Data Evaluation
  describe('POST /api/suggestions/evaluate', () => {

    test('Qualifying conflict post returns hasSuggestion: true with message and relatedAnswerIds', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-conflict-1', userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(true);
      expect(res.body.triggerType).toBe('conflict');
      expect(res.body.priorityScore).toBeGreaterThanOrEqual(50);
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.relatedAnswerIds)).toBe(true);
      expect(res.body.relatedAnswerIds.length).toBe(2);
    });

    test('Dismissed post suppression returns hasSuggestion: false', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-dismissed-1', userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(false);
    });

    test('Missing postId or userId returns clean HTTP 400 error', async () => {
      const res1 = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ userId: 'user-1' });

      expect(res1.status).toBe(400);
      expect(res1.body.error).toBeDefined();

      const res2 = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-conflict-1' });

      expect(res2.status).toBe(400);
      expect(res2.body.error).toBeDefined();
    });

    test('Nonexistent postId or userId returns clean HTTP 404 error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'nonexistent-post', userId: 'user-1' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Post or User not found');
    });

    test('Student-vs-Professor post returns hasSuggestion: false due to gate rejection', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-student-prof', userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(false);
    });

    test('Borderline score 50 post returns hasSuggestion: true', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-borderline-50', userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(true);
      expect(res.body.priorityScore).toBe(50);
    });

    test('Borderline score 48 post returns hasSuggestion: false', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-borderline-48', userId: 'user-1' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(false);
    });

  });

  // 2. Toggle Behavior & Evaluator Registry Mechanics
  describe('Toggle Behavior & Registry Mechanics', () => {

    test('Conflict evaluator with bypassesToggle: true runs even when user.suggestionsEnabled is false', async () => {
      // user-2 has suggestionsEnabled === false
      const user2 = getUserById('user-2');
      expect(user2.suggestionsEnabled).toBe(false);

      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-conflict-1', userId: 'user-2' });

      expect(res.status).toBe(200);
      expect(res.body.hasSuggestion).toBe(true);
      expect(res.body.triggerType).toBe('conflict');
    });

    test('Test-only stub evaluator with bypassesToggle: false IS suppressed when user.suggestionsEnabled is false', async () => {
      const testStubEvaluator = {
        triggerType: 'test-stub',
        bypassesToggle: false,
        threshold: 30,
        evaluate: (post) => ({
          triggerType: 'test-stub',
          priorityScore: 80,
          candidate: true
        })
      };

      // Custom express app endpoint for testing custom registry runner
      const { runEvaluators } = require('../../src/services/evaluatorRegistry');
      const post = getPostById('post-conflict-1');
      const user2Disabled = getUserById('user-2'); // suggestionsEnabled: false

      // Run custom registry with stub evaluator only
      const resultDisabled = runEvaluators(post, user2Disabled, [testStubEvaluator]);
      expect(resultDisabled).toBeNull(); // Suppressed because bypassesToggle is false and suggestionsEnabled is false!

      const user1Enabled = getUserById('user-1'); // suggestionsEnabled: true
      const resultEnabled = runEvaluators(post, user1Enabled, [testStubEvaluator]);
      expect(resultEnabled).not.toBeNull();
      expect(resultEnabled.triggerType).toBe('test-stub');
    });

  });

  // 3. User Preferences Endpoints
  describe('User Preferences Endpoints GET & POST /api/users/:id/preferences', () => {

    test('GET /api/users/:id/preferences reads initial user preferences', async () => {
      const res = await request(app).get('/api/users/user-1/preferences');

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe('user-1');
      expect(res.body.suggestionsEnabled).toBe(true);
    });

    test('POST /api/users/:id/preferences updates and persists user preference', async () => {
      const updateRes = await request(app)
        .post('/api/users/user-3/preferences')
        .send({ suggestionsEnabled: false });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.userId).toBe('user-3');
      expect(updateRes.body.suggestionsEnabled).toBe(false);

      // Confirm persistence via GET
      const getRes = await request(app).get('/api/users/user-3/preferences');
      expect(getRes.status).toBe(200);
      expect(getRes.body.suggestionsEnabled).toBe(false);
    });

    test('GET & POST /api/users/:id/preferences returns 404 for nonexistent user', async () => {
      const getRes = await request(app).get('/api/users/user-nonexistent/preferences');
      expect(getRes.status).toBe(404);
      expect(getRes.body.error).toBe('User not found');

      const postRes = await request(app)
        .post('/api/users/user-nonexistent/preferences')
        .send({ suggestionsEnabled: true });
      expect(postRes.status).toBe(404);
      expect(postRes.body.error).toBe('User not found');
    });

    test('POST /api/users/:id/preferences returns 400 when suggestionsEnabled is not boolean', async () => {
      const res = await request(app)
        .post('/api/users/user-1/preferences')
        .send({ suggestionsEnabled: 'invalid-string' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('suggestionsEnabled must be a boolean');
    });

  });

  // 4. Gemini Integration & Fallback Guarantee
  describe('Gemini AI Message Generator & Fallback', () => {

    test('Gemini message is non-empty, under ~20 words, and free of forbidden correctness assertions', async () => {
      const { generateConflictMessage } = require('../../src/services/geminiService');
      const post = getPostById('post-conflict-1');
      const answerA = post.answers[0];
      const answerB = post.answers[1];

      const msg = await generateConflictMessage(post, answerA, answerB);

      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);

      const words = msg.split(/\s+/);
      expect(words.length).toBeLessThanOrEqual(25);

      const lower = msg.toLowerCase();
      expect(lower).not.toContain('wrong');
      expect(lower).not.toContain('incorrect');
      expect(lower).not.toContain('mistake');
    });

    test('Simulated API failure or timeout produces safe generic fallback message without throwing error', async () => {
      // Temporarily clear API key to simulate API error/fallback
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const { generateConflictMessage } = require('../../src/services/geminiService');
      const post = getPostById('post-conflict-1');

      const msg = await generateConflictMessage(post, post.answers[0], post.answers[1]);
      expect(msg).toBe(DEFAULT_FALLBACK_MESSAGE);

      process.env.GEMINI_API_KEY = originalKey;
    });

  });

  // 5. Answer Confused Reaction Counter Endpoint
  describe('POST /api/answers/:id/confused', () => {

    test('Increments and returns confusedReactionCount for valid answer', async () => {
      const res = await request(app).post('/api/answers/ans-1/confused');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('ans-1');
      expect(res.body.confusedReactionCount).toBe(3); // Initial was 2 -> 3
    });

    test('Returns HTTP 404 for nonexistent answer ID', async () => {
      const res = await request(app).post('/api/answers/nonexistent-ans/confused');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Answer not found');
    });

  });

  // 6. Suggestion Dismissal Endpoint
  describe('POST /api/suggestions/dismiss', () => {

    test('Appends triggerType to post.dismissedSuggestions and returns dismissed: true', async () => {
      const res = await request(app)
        .post('/api/suggestions/dismiss')
        .send({ postId: 'post-conflict-1', triggerType: 'conflict' });

      expect(res.status).toBe(200);
      expect(res.body.dismissed).toBe(true);

      const post = getPostById('post-conflict-1');
      expect(post.dismissedSuggestions).toContain('conflict');

      // Evaluating post now returns hasSuggestion: false due to dismissal!
      const evalRes = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-conflict-1', userId: 'user-1' });

      expect(evalRes.status).toBe(200);
      expect(evalRes.body.hasSuggestion).toBe(false);
    });

    test('Returns HTTP 404 for nonexistent postId on dismiss', async () => {
      const res = await request(app)
        .post('/api/suggestions/dismiss')
        .send({ postId: 'nonexistent-post', triggerType: 'conflict' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Post not found');
    });

  });

});
