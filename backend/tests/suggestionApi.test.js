const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const express = require('express');

const dataStore = require('../src/data/dataStore');
const suggestionRoutes = require('../src/routes/suggestionRoutes');
const evaluatorRegistry = require('../src/evaluators/evaluatorRegistry');
const conflictEvaluator = require('../src/evaluators/conflictEvaluator');
const { containsJudgmentWords, DEFAULT_SAFE_MESSAGE } = require('../src/services/geminiService');

// Create test Express app
const app = express();
app.use(express.json());
app.use('/api', suggestionRoutes);

describe('Suggestion System API & Framework Integration Tests', () => {

  beforeEach(() => {
    // Reset dataStore to clean initial state before each test
    dataStore.reset();

    // Reset evaluator registry to contain only official conflictEvaluator
    evaluatorRegistry.clear();
    evaluatorRegistry.registerEvaluator(conflictEvaluator);
  });

  // -------------------------------------------------------------
  // STEP 2: Evaluate Endpoint Mock Data Tests (/api/suggestions/evaluate)
  // -------------------------------------------------------------
  describe('STEP 2: Mock Evaluation Endpoint Tests', () => {
    
    test('High-conflict post with valid user returns hasSuggestion: true and priorityScore 95', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', userId: 'user-1', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.triggerType, 'conflict');
      assert.strictEqual(res.body.priorityScore, 95);
      assert.deepStrictEqual(res.body.relatedAnswerIds, ['ans-101', 'ans-102']);
    });

    test('Borderline post-50 returns hasSuggestion: true with priorityScore 50', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-borderline-50', userId: 'user-1', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.priorityScore, 50);
    });

    test('Borderline post-48 returns hasSuggestion: false (score < 50 threshold)', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-borderline-48', userId: 'user-1', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, false);
    });

    test('Regression post-student-prof-high-views returns hasSuggestion: false', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-student-prof-high-views', userId: 'user-1', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, false);
    });

    test('Dismissed conflict post returns hasSuggestion: false despite score >= 50', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-dismissed-conflict', userId: 'user-1', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, false);
    });

    test('Missing postId returns clean 400 Bad Request error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ userId: 'user-1' });

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
      assert.match(res.body.error, /postId is required/i);
    });

    test('Missing userId returns clean 400 Bad Request error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict' });

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
      assert.match(res.body.error, /userId is required/i);
    });

    test('Nonexistent postId returns clean 404 error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'unknown-post-id', userId: 'user-1' });

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error);
    });

    test('Nonexistent userId returns clean 404 error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', userId: 'unknown-user-id' });

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error);
    });

  });

  // -------------------------------------------------------------
  // STEP 3: Toggle Behavior & Stub Evaluator Tests
  // -------------------------------------------------------------
  describe('STEP 3: Toggle Behavior & Stub Evaluator Tests', () => {

    test('Conflict evaluator (bypassesToggle: true) still triggers for user-2 (suggestionsEnabled: false)', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', userId: 'user-2', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.triggerType, 'conflict');
    });

    test('Toggle-respecting stub evaluator (bypassesToggle: false) IS suppressed when user suggestionsEnabled is false', async () => {
      // Create test-only stub evaluator with bypassesToggle: false
      const testStubEvaluator = {
        triggerType: 'test_stub_eval',
        bypassesToggle: false,
        threshold: 30,
        evaluate: (post) => ({
          triggerType: 'test_stub_eval',
          priorityScore: 60,
          relatedAnswerIds: ['ans-1']
        })
      };

      // Register test stub evaluator alongside conflictEvaluator
      evaluatorRegistry.registerEvaluator(testStubEvaluator);

      // Evaluate for user-1 (suggestionsEnabled: true) -> should trigger test_stub_eval (highest score 60 vs 0 on non-conflict post)
      const resUser1 = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-same-conclusion', userId: 'user-1', mock: true });

      assert.strictEqual(resUser1.status, 200);
      assert.strictEqual(resUser1.body.hasSuggestion, true);
      assert.strictEqual(resUser1.body.triggerType, 'test_stub_eval');

      // Evaluate for user-2 (suggestionsEnabled: false) -> test_stub_eval MUST be suppressed
      const resUser2 = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-same-conclusion', userId: 'user-2', mock: true });

      assert.strictEqual(resUser2.status, 200);
      assert.strictEqual(resUser2.body.hasSuggestion, false);

      // Cleanup: unregister test stub evaluator
      evaluatorRegistry.unregisterEvaluator('test_stub_eval');
    });

  });

  // -------------------------------------------------------------
  // STEP 4: User Preference Endpoints Tests
  // -------------------------------------------------------------
  describe('STEP 4: User Preference Endpoints (/api/users/:id/preferences)', () => {

    test('GET /api/users/:id/preferences reads existing user preferences', async () => {
      const res = await request(app)
        .get('/api/users/user-1/preferences');

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.id, 'user-1');
      assert.strictEqual(res.body.suggestionsEnabled, true);
    });

    test('POST /api/users/:id/preferences updates preferences and persists change', async () => {
      // Update user-1 suggestionsEnabled to false
      const postRes = await request(app)
        .post('/api/users/user-1/preferences')
        .send({ suggestionsEnabled: false });

      assert.strictEqual(postRes.status, 200);
      assert.strictEqual(postRes.body.id, 'user-1');
      assert.strictEqual(postRes.body.suggestionsEnabled, false);

      // GET user-1 preferences to verify persistence
      const getRes = await request(app)
        .get('/api/users/user-1/preferences');

      assert.strictEqual(getRes.status, 200);
      assert.strictEqual(getRes.body.suggestionsEnabled, false);
    });

    test('GET /api/users/:id/preferences returns 404 for unknown user', async () => {
      const res = await request(app)
        .get('/api/users/unknown-user/preferences');

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error);
    });

    test('POST /api/users/:id/preferences returns 400 for invalid body payload', async () => {
      const res = await request(app)
        .post('/api/users/user-1/preferences')
        .send({}); // missing suggestionsEnabled

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
    });

  });

  // -------------------------------------------------------------
  // STEP 5: Gemini API Message Generation & Fallback Tests
  // -------------------------------------------------------------
  describe('STEP 5: Gemini Message Generation & Fallback Tests', () => {

    test('Gemini fallback simulation returns safe message on error or timeout', async () => {
      app.use((req, res, next) => {
        req.serviceOptions = { forceFail: true };
        next();
      });

      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', userId: 'user-1' });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.message, DEFAULT_SAFE_MESSAGE);
      assert.strictEqual(containsJudgmentWords(res.body.message), false);
    });

  });

  // -------------------------------------------------------------
  // STEP 6: Confused Reaction & Dismissal Endpoint Tests
  // -------------------------------------------------------------
  describe('STEP 6: Confused Reaction & Dismissal Endpoint Tests', () => {

    test('POST /api/answers/:id/confused increments and returns count', async () => {
      const res1 = await request(app)
        .post('/api/answers/ans-101/confused');

      assert.strictEqual(res1.status, 200);
      assert.strictEqual(res1.body.id, 'ans-101');
      assert.strictEqual(res1.body.confusedReactionCount, 1);
    });

    test('POST /api/suggestions/dismiss adds triggerType to dismissedSuggestions', async () => {
      const dismissRes = await request(app)
        .post('/api/suggestions/dismiss')
        .send({ postId: 'post-high-conflict', triggerType: 'conflict' });

      assert.strictEqual(dismissRes.status, 200);
      assert.strictEqual(dismissRes.body.dismissed, true);
      assert.ok(dismissRes.body.dismissedSuggestions.includes('conflict'));

      // Evaluating post-high-conflict now returns hasSuggestion: false
      const evalAfter = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', userId: 'user-1', mock: true });

      assert.strictEqual(evalAfter.body.hasSuggestion, false);
    });

  });

});
