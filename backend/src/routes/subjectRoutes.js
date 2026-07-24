const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  getSubjectPosts
} = require('../controllers/subjectController');
const { getSubjectResources } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getSubjects);
router.post('/', authMiddleware, createSubject);
router.get('/:id', getSubjectById);
router.get('/:id/posts', getSubjectPosts);
router.get('/:id/resources', getSubjectResources);

module.exports = router;
