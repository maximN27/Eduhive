const express = require('express');
const router = express.Router();
const { voteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:id/vote', protect, voteResource);

module.exports = router;
