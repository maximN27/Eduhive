const express = require('express');
const { recommendResourcesHandler } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/recommend', protect, recommendResourcesHandler);

module.exports = router;
