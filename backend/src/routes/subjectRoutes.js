const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  getSubjectPosts
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSubjects)
  .post(protect, createSubject);

router.route('/:id')
  .get(getSubjectById);

router.route('/:id/posts')
  .get(getSubjectPosts);

module.exports = router;
