const Post = require('../models/Post');
const Subject = require('../models/Subject');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// @desc    Get paginated posts
// @route   GET /posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments();
    const posts = await Post.find()
      .populate('authorId', 'username name profilePic role')
      .populate('subjectId', 'name description tags')
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

// @desc    Get single post by ID
// @route   GET /posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username name profilePic role')
      .populate('subjectId', 'name description tags')
      .populate('resourceIds');

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { subjectId, title, content, tags, resourceIds } = req.body;

    if (!subjectId || !title || !content) {
      return res.status(400).json({
        error: {
          message: 'Please provide subjectId, title, and content',
          code: 'BAD_REQUEST'
        }
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid subjectId',
          code: 'BAD_REQUEST'
        }
      });
    }

    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res.status(400).json({
        error: {
          message: 'Subject does not exist',
          code: 'BAD_REQUEST'
        }
      });
    }

    const post = await Post.create({
      subjectId,
      authorId: req.user.userId,
      title: title.trim(),
      content,
      tags: tags || [],
      resourceIds: resourceIds || []
    });

    // Increment subject member count hackathon tracking
    await Subject.findByIdAndUpdate(subjectId, { $inc: { membersCount: 1 } });

    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'username name profilePic role')
      .populate('subjectId', 'name');

    res.status(201).json({ post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing post (author only)
// @route   PUT /posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    if (post.authorId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          message: 'Forbidden: You are not the author of this post',
          code: 'FORBIDDEN'
        }
      });
    }

    const { title, content, tags, resourceIds } = req.body;
    if (title) post.title = title.trim();
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (resourceIds) post.resourceIds = resourceIds;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('authorId', 'username name profilePic role')
      .populate('subjectId', 'name');

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post (author only)
// @route   DELETE /posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    if (post.authorId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          message: 'Forbidden: You are not the author of this post',
          code: 'FORBIDDEN'
        }
      });
    }

    await Comment.deleteMany({ postId: post._id });
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const geminiService = require('../services/geminiService');

// @desc    Summarize post & top comments using Gemini AI (with comment count caching)
// @route   POST /posts/:id/summarize
// @access  Private
const summarizePostHandler = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const currentCommentCount = await Comment.countDocuments({ postId });

    // Cache hit condition: cachedSummary exists and comment count change is <= 3
    if (
      post.cachedSummary &&
      Math.abs(currentCommentCount - (post.commentCountAtSummary || 0)) <= 3
    ) {
      return res.status(200).json({
        summary: post.cachedSummary,
        cached: true,
        commentCountAtSummary: post.commentCountAtSummary
      });
    }

    // Cache miss: fetch top 10 comments sorted by voteScore
    const topComments = await Comment.find({ postId })
      .sort({ voteScore: -1 })
      .limit(10);

    let summary;
    try {
      summary = await geminiService.summarizePost(post.title, post.content, topComments);
    } catch (err) {
      return res.status(503).json({
        error: {
          message: err.message || 'Summary temporarily unavailable',
          code: 'SERVICE_UNAVAILABLE'
        }
      });
    }

    post.cachedSummary = summary;
    post.commentCountAtSummary = currentCommentCount;
    await post.save();

    res.status(200).json({
      summary,
      cached: false,
      commentCountAtSummary: currentCommentCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  summarizePostHandler
};

