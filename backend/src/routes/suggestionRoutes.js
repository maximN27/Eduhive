const express = require('express');
const router = express.Router();
const {
  evaluateSuggestions,
  incrementConfused,
  dismissSuggestion,
  getUserPreferences,
  updateUserPreferences
} = require('../controllers/suggestionController');

// Suggestion Evaluation & Dismissal Endpoints
router.post('/suggestions/evaluate', evaluateSuggestions);
router.post('/suggestions/dismiss', dismissSuggestion);

// Answer Confused Reaction Counter Endpoint
router.post('/answers/:id/confused', incrementConfused);

// Per-User Preferences Endpoints
router.get('/users/:id/preferences', getUserPreferences);
router.post('/users/:id/preferences', updateUserPreferences);

module.exports = router;
