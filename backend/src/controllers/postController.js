const Post = require('../models/Post');
const Subject = require('../models/Subject');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');
const aiServiceClient = require('../services/aiServiceClient');

// @desc    Get all posts with optional filtering and pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { subjectId, tag, search, authorId, page, limit } = req.query;
    let query = {};

    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) query.subjectId = subjectId;
    if (authorId && mongoose.Types.ObjectId.isValid(authorId)) query.authorId = authorId;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('subjectId', 'name description tags')
      .populate('authorId', 'name username avatar profilePic role')
      .populate('resourceIds')
      .populate('resourceIds')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
      posts,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    const post = await Post.findById(req.params.id)
      .populate('subjectId', 'name description tags')
      .populate('authorId', 'name username avatar profilePic bio college role')
      .populate('resourceIds')
      .populate('resourceIds');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    res.status(200).json({ success: true, data: post, post });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { subjectId, title, content, tags, resourceIds } = req.body;

    if (!subjectId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide subjectId, title, and content', code: 'BAD_REQUEST' },
        message: 'Please provide subjectId, title, and content'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid subjectId', code: 'BAD_REQUEST' },
        message: 'Invalid subjectId'
      });
    }

    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res.status(400).json({
        success: false,
        error: { message: 'Subject does not exist', code: 'BAD_REQUEST' },
        message: 'Subject does not exist'
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const post = await Post.create({
      subjectId,
      authorId: userId,
      title: title.trim(),
      content,
      tags: tags || [],
      resourceIds: resourceIds || []
    });

    const populatedPost = await Post.findById(post._id)
      .populate('subjectId', 'name')
      .populate('authorId', 'name username avatar profilePic role');

    res.status(201).json({ success: true, data: populatedPost, post: populatedPost });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden: Not authorized to update this post', code: 'FORBIDDEN' },
        message: 'Not authorized to update this post'
      });
    }

    const { title, content, tags, resourceIds } = req.body;
    if (title) post.title = title.trim();
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (resourceIds) {
      post.resourceIds = resourceIds;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('subjectId', 'name')
      .populate('authorId', 'name username avatar profilePic role');

    res.status(200).json({ success: true, data: updatedPost, post: updatedPost });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden: Not authorized to delete this post', code: 'FORBIDDEN' },
        message: 'Not authorized to delete this post'
      });
    }

    const comments = await Comment.find({ postId: post._id }).select('_id');
    const resources = await Resource.find({ postId: post._id }).select('_id');
    const commentIds = comments.map(c => c._id);
    const resourceIds = resources.map(r => r._id);

    await Vote.deleteMany({ targetType: 'post', targetId: post._id });
    if (commentIds.length > 0) {
      await Vote.deleteMany({ targetType: 'comment', targetId: { $in: commentIds } });
    }
    if (resourceIds.length > 0) {
      await Vote.deleteMany({ targetType: 'resource', targetId: { $in: resourceIds } });
    }

    await Comment.deleteMany({ postId: post._id });
    await Resource.deleteMany({ postId: post._id });
    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('authorId', 'name username avatar profilePic role')
      .populate('mentions', 'name username')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: comments.length, data: comments, comments });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a top-level comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addPostComment = async (req, res, next) => {
  try {
    const { content, mentions } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const comment = await Comment.create({
      postId: req.params.id,
      authorId: userId,
      content,
      parentComment: null,
      mentions: mentions || []
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'name username avatar profilePic role')
      .populate('mentions', 'name username');

    res.status(201).json({ success: true, data: populatedComment, comment: populatedComment });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resources attached to a post
// @route   GET /api/posts/:id/resources
// @access  Public
const getPostResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ postId: req.params.id }).sort({ votes: -1 });
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Attach a resource to a post
// @route   POST /api/posts/:id/resources
// @access  Private
const addPostResource = async (req, res, next) => {
  try {
    const { title, type, url, tags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (!title || !type || !url) {
      return res.status(400).json({ success: false, message: 'Please provide title, type, and url for the resource' });
    }

    const resource = await Resource.create({
      postId: req.params.id,
      title,
      type,
      url,
      tags: tags || []
    });

    post.resourceIds = post.resourceIds || [];
    post.resourceIds.push(resource._id);
    await post.save();

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Summarize post & top comments using Gemini AI
// @route   POST /api/posts/:id/summarize
// @access  Private
const summarizePostHandler = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', code: 'NOT_FOUND' },
        message: 'Post not found'
      });
    }

    const currentCommentCount = await Comment.countDocuments({ postId });

    if (
      post.cachedSummary &&
      Math.abs(currentCommentCount - (post.commentCountAtSummary || 0)) <= 3
    ) {
      return res.status(200).json({
        success: true,
        summary: post.cachedSummary,
        cached: true,
        commentCountAtSummary: post.commentCountAtSummary
      });
    }

    const topComments = await Comment.find({ postId })
      .sort({ voteScore: -1 })
      .limit(10);

    const preferences = {};
    if (req.user.experienceLevel && req.user.experienceLevel.trim()) {
      preferences.experienceLevel = req.user.experienceLevel;
    }
    if (req.user.preferredLanguage && req.user.preferredLanguage.trim()) {
      preferences.preferredLanguage = req.user.preferredLanguage;
    }

    let summary;
    try {
      const aiResponse = await aiServiceClient.summarizeWithAIService({
        title: post.title,
        content: post.content,
        comments: topComments.map((comment) => ({
          content: comment.content,
          isDeleted: comment.isDeleted,
          parentComment: comment.parentComment ? comment.parentComment.toString() : null
        })),
        ...(Object.keys(preferences).length > 0 ? { preferences } : {})
      });
      summary = aiResponse.summary;
    } catch (err) {
      const isAIServiceError = err instanceof aiServiceClient.AIServiceError;
      const status = isAIServiceError ? err.status : 503;
      const message = isAIServiceError
        ? err.message
        : 'AI service is currently unavailable';
      const code = isAIServiceError
        ? err.code
        : 'AI_SERVICE_UNAVAILABLE';

      return res.status(status).json({
        success: false,
        error: {
          message,
          code
        },
        message
      });
    }

    post.cachedSummary = summary;
    post.commentCountAtSummary = currentCommentCount;
    await post.save();

    res.status(200).json({
      success: true,
      summary,
      cached: false,
      commentCountAtSummary: currentCommentCount
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostComments,
  addPostComment,
  getPostResources,
  addPostResource,
  summarizePostHandler
};
