const Subject = require('../models/Subject');
const Post = require('../models/Post');
const Resource = require('../models/Resource');

// @desc    Get paginated subjects
// @route   GET /subjects
// @access  Public
const getSubjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Subject.countDocuments();
    const subjects = await Subject.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      subjects,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single subject by ID
// @route   GET /subjects/:id
// @access  Public
const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        error: {
          message: 'Subject not found',
          code: 'NOT_FOUND'
        }
      });
    }

    res.status(200).json({ subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new subject
// @route   POST /subjects
// @access  Private
const createSubject = async (req, res, next) => {
  try {
    const { name, description, tags } = req.body;

    if (!name) {
      return res.status(400).json({
        error: {
          message: 'Subject name is required',
          code: 'BAD_REQUEST'
        }
      });
    }

    const existingSubject = await Subject.findOne({ name: name.trim() });
    if (existingSubject) {
      return res.status(409).json({
        error: {
          message: 'Subject already exists',
          code: 'CONFLICT'
        }
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      description: description || '',
      tags: tags || []
    });

    res.status(201).json({ subject });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts belonging to a subject (paginated)
// @route   GET /subjects/:id/posts
// @access  Public
const getSubjectPosts = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        error: {
          message: 'Subject not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ subjectId: req.params.id });
    const posts = await Post.find({ subjectId: req.params.id })
      .populate('authorId', 'username name profilePic role')
      .populate('resourceIds')
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  getSubjectPosts
};
