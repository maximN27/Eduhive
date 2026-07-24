/**
 * Routes for Suggestion System API
 */

const express = require('express');
const router = express.Router();
const {
  evaluateSuggestions,
  incrementConfusedReaction,
  dismissSuggestion
} = require('../controllers/suggestionController');

// Suggestion Evaluation Endpoint
router.post('/suggestions/evaluate', evaluateSuggestions);

// Suggestion Dismissal Endpoint
router.post('/suggestions/dismiss', dismissSuggestion);

// Answer Confused Reaction Incrementor Endpoint
router.post('/answers/:id/confused', incrementConfusedReaction);

module.exports = router;
