const Subject = require('../models/Subject');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get all subjects with optional search and pagination
// @route   GET /api/subjects
// @access  Public
const getSubjects = async (req, res, next) => {
  try {
    const { search, tag, page, limit } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Subject.countDocuments(query);
    const subjects = await Subject.find(query)
      .sort({ membersCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
      subjects,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum
      }
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Public
const getSubjectById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Subject not found', code: 'NOT_FOUND' },
        message: 'Subject not found'
      });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: { message: 'Subject not found', code: 'NOT_FOUND' },
        message: 'Subject not found'
      });
    }

    res.status(200).json({ success: true, data: subject, subject });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res, next) => {
  try {
    const { name, description, tags } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Subject name is required', code: 'BAD_REQUEST' },
        message: 'Subject name is required'
      });
    }

    const existingSubject = await Subject.findOne({ name: name.trim() });
    if (existingSubject) {
      return res.status(409).json({
        success: false,
        error: { message: 'Subject already exists', code: 'CONFLICT' },
        message: 'Subject already exists'
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      description: description || '',
      tags: tags || []
    });

    res.status(201).json({ success: true, data: subject, subject });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts belonging to a subject
// @route   GET /api/subjects/:id/posts
// @access  Public
const getSubjectPosts = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Subject not found', code: 'NOT_FOUND' },
        message: 'Subject not found'
      });
    }

    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: { message: 'Subject not found', code: 'NOT_FOUND' },
        message: 'Subject not found'
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ subjectId: req.params.id });
    const posts = await Post.find({ subjectId: req.params.id })
      .populate('authorId', 'name username avatar profilePic role')
      .populate('reserouseIds')
      .populate('resourceIds')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit
      }
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubjects,
  getSubjectById,
  createSubject,
  getSubjectPosts
};
