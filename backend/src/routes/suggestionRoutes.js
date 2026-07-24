/**
 * Routes for Suggestion System API & User Preferences
 */

const express = require('express');
const router = express.Router();
const {
  evaluateSuggestions,
  incrementConfusedReaction,
  dismissSuggestion
} = require('../controllers/suggestionController');
const {
  getUserPreferences,
  updateUserPreferences
} = require('../controllers/userController');

// Suggestion Evaluation Endpoint
router.post('/suggestions/evaluate', evaluateSuggestions);

// Suggestion Dismissal Endpoint
router.post('/suggestions/dismiss', dismissSuggestion);

// Answer Confused Reaction Incrementor Endpoint
router.post('/answers/:id/confused', incrementConfusedReaction);

// User Preferences Endpoints
router.get('/users/:id/preferences', getUserPreferences);
router.post('/users/:id/preferences', updateUserPreferences);

module.exports = router;
