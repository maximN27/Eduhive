const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');

// @desc    Get all posts with optional filtering
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { subjectId, tag, search, authorId } = req.query;
    let query = {};

    if (subjectId) query.subjectId = subjectId;
    if (authorId) query.authorId = authorId;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('subjectId', 'name description')
      .populate('authorId', 'name username avatar profilePic')
      .populate('reserouseIds')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('subjectId', 'name description tags')
      .populate('authorId', 'name username avatar profilePic bio college')
      .populate('reserouseIds');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { subjectId, title, content, tags, resourceIds } = req.body;

    if (!subjectId || !title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide subjectId, title, and content' });
    }

    const post = await Post.create({
      subjectId,
      authorId: req.user._id,
      title,
      content,
      tags: tags || [],
      reserouseIds: resourceIds || []
    });

    const populatedPost = await Post.findById(post._id)
      .populate('subjectId', 'name')
      .populate('authorId', 'name username avatar profilePic');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
    }

    const { title, content, tags, resourceIds } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (resourceIds) post.reserouseIds = resourceIds;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('subjectId', 'name')
      .populate('authorId', 'name username avatar profilePic');

    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a top-level comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addPostComment = async (req, res) => {
  try {
    const { content, mentions } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      postId: req.params.id,
      authorId: req.user._id,
      content,
      parentComment: null,
      mentions: mentions || []
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resources attached to a post
// @route   GET /api/posts/:id/resources
// @access  Public
exports.getPostResources = async (req, res) => {
  try {
    const resources = await Resource.find({ postId: req.params.id }).sort({ votes: -1 });
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Attach a resource to a post
// @route   POST /api/posts/:id/resources
// @access  Private
exports.addPostResource = async (req, res) => {
  try {
    const { title, type, URL, tags } = req.body;

    if (!title || !type || !URL) {
      return res.status(400).json({ success: false, message: 'Please provide title, type, and URL for the resource' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const resource = await Resource.create({
      postId: req.params.id,
      title,
      type,
      URL,
      tags: tags || []
    });

    // Push resource ID to post's reserouseIds array
    post.reserouseIds.push(resource._id);
    await post.save();

    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
