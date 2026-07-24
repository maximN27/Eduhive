const Post = require('../models/Post');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Resource = require('../models/Resource');

// @desc    Search posts, users, or subjects by query
// @route   GET /search?q=&type=posts|users|subjects
// @access  Public
const searchAll = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    const type = req.query.type ? req.query.type.toLowerCase() : 'posts';

    if (!q) {
      return res.status(200).json({ results: [], count: 0 });
    }

    let results = [];

    if (type === 'posts') {
      try {
        results = await Post.find({ $text: { $search: q } })
          .populate('authorId', 'username name profilePic role')
          .populate('subjectId', 'name description tags')
          .populate('resourceIds')
          .sort({ createdAt: -1 });
      } catch (err) {
        results = [];
      }

      // Regex fallback if text search produced no results
      if (results.length === 0) {
        const regex = new RegExp(q, 'i');
        results = await Post.find({
          $or: [
            { title: regex },
            { content: regex },
            { tags: regex }
          ]
        })
          .populate('authorId', 'username name profilePic role')
          .populate('subjectId', 'name description tags')
          .populate('resourceIds')
          .sort({ createdAt: -1 });
      }
    } else if (type === 'users') {
      const regex = new RegExp(q, 'i');
      results = await User.find({
        $or: [
          { username: regex },
          { name: regex },
          { email: regex }
        ]
      }).select('-passwordHash');
    } else if (type === 'subjects') {
      const regex = new RegExp(q, 'i');
      results = await Subject.find({
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex }
        ]
      });
    } else {
      return res.status(400).json({
        error: {
          message: 'Invalid search type. Must be posts, users, or subjects',
          code: 'BAD_REQUEST'
        }
      });
    }

    res.status(200).json({
      results,
      count: results.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchAll
};
