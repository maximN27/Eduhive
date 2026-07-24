const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const express = require('express');

const dataStore = require('../src/data/dataStore');
const suggestionRoutes = require('../src/routes/suggestionRoutes');
const { containsJudgmentWords, DEFAULT_SAFE_MESSAGE } = require('../src/services/geminiService');

// Create test Express app
const app = express();
app.use(express.json());
app.use('/api', suggestionRoutes);

describe('Suggestion System API Integration Tests', () => {

  beforeEach(() => {
    // Reset dataStore to clean initial state before each test
    dataStore.reset();
  });

  // -------------------------------------------------------------
  // STEP 2: Evaluate endpoint mock-data-only tests
  // -------------------------------------------------------------
  describe('STEP 2: Mock Evaluation Endpoint Tests (/api/suggestions/evaluate)', () => {
    
    test('High-conflict post returns hasSuggestion: true with priorityScore >= 50 and correct relatedAnswerIds', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.triggerType, 'conflict');
      assert.strictEqual(res.body.priorityScore, 101);
      assert.deepStrictEqual(res.body.relatedAnswerIds, ['ans-101', 'ans-102']);
      assert.strictEqual(res.body.message, DEFAULT_SAFE_MESSAGE);
    });

    test('Low-scoring post returns hasSuggestion: false', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-student-prof', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, false);
      assert.strictEqual(res.body.priorityScore, undefined);
    });

    test('Dismissed post returns hasSuggestion: false despite score >= 50', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-dismissed-conflict', mock: true });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, false);
    });

    test('Missing postId returns 400 Bad Request clean error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({});

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
      assert.match(res.body.error, /postId is required/i);
    });

    test('Non-existent postId returns 404 Not Found clean error', async () => {
      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'non-existent-id' });

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error);
    });

  });

  // -------------------------------------------------------------
  // STEP 3: Gemini Message Generation & Fallback Tests
  // -------------------------------------------------------------
  describe('STEP 3: Gemini Message Generation & Fallback Tests', () => {

    test('Gemini fallback simulation returns safe message on error/timeout', async () => {
      // Pass serviceOptions to force fail/timeout simulation
      app.use((req, res, next) => {
        req.serviceOptions = { forceFail: true };
        next();
      });

      const res = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict' });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.hasSuggestion, true);
      assert.strictEqual(res.body.message, DEFAULT_SAFE_MESSAGE);
      assert.strictEqual(containsJudgmentWords(res.body.message), false);
    });

    test('Automated check: verified safe message contains no judgment words and is under 25 words', () => {
      const message = DEFAULT_SAFE_MESSAGE;
      assert.strictEqual(containsJudgmentWords(message), false, 'Message must not contain judgment words');
      const wordCount = message.trim().split(/\s+/).length;
      assert.ok(wordCount <= 25, `Message should be under 25 words, got ${wordCount}`);
    });

  });

  // -------------------------------------------------------------
  // STEP 4: Confused Reaction & Dismissal Endpoint Tests
  // -------------------------------------------------------------
  describe('STEP 4: Confused Reaction & Dismissal Endpoint Tests', () => {

    test('POST /api/answers/:id/confused increments and returns confusedReactionCount', async () => {
      // ans-101 initial confusedReactionCount is 2
      const res1 = await request(app)
        .post('/api/answers/ans-101/confused')
        .send();

      assert.strictEqual(res1.status, 200);
      assert.strictEqual(res1.body.id, 'ans-101');
      assert.strictEqual(res1.body.confusedReactionCount, 3);

      const res2 = await request(app)
        .post('/api/answers/ans-101/confused')
        .send();

      assert.strictEqual(res2.status, 200);
      assert.strictEqual(res2.body.confusedReactionCount, 4);
    });

    test('POST /api/answers/:id/confused returns 404 for unknown answer ID', async () => {
      const res = await request(app)
        .post('/api/answers/unknown-ans-id/confused')
        .send();

      assert.strictEqual(res.status, 404);
      assert.ok(res.body.error);
    });

    test('POST /api/suggestions/dismiss adds triggerType to dismissedSuggestions', async () => {
      // Initially post-high-conflict is not dismissed
      const evalBefore = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', mock: true });
      assert.strictEqual(evalBefore.body.hasSuggestion, true);

      // Dismiss conflict suggestion
      const dismissRes = await request(app)
        .post('/api/suggestions/dismiss')
        .send({ postId: 'post-high-conflict', triggerType: 'conflict' });

      assert.strictEqual(dismissRes.status, 200);
      assert.strictEqual(dismissRes.body.dismissed, true);
      assert.strictEqual(dismissRes.body.postId, 'post-high-conflict');
      assert.ok(dismissRes.body.dismissedSuggestions.includes('conflict'));

      // Evaluating again now returns hasSuggestion: false
      const evalAfter = await request(app)
        .post('/api/suggestions/evaluate')
        .send({ postId: 'post-high-conflict', mock: true });
      assert.strictEqual(evalAfter.body.hasSuggestion, false);
    });

    test('POST /api/suggestions/dismiss returns 400 if params are missing', async () => {
      const res = await request(app)
        .post('/api/suggestions/dismiss')
        .send({ postId: 'post-high-conflict' }); // missing triggerType

      assert.strictEqual(res.status, 400);
      assert.ok(res.body.error);
    });

  });

});
