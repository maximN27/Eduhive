const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  getSubjectPosts
} = require('../controllers/subjectController');
const { getSubjectResources } = require('../controllers/resourceController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(getSubjects)
  .post(protect, createSubject);

router.route('/:id')
  .get(getSubjectById);

router.route('/:id/posts')
  .get(getSubjectPosts);

router.route('/:id/resources')
  .get(getSubjectResources);

module.exports = router;
