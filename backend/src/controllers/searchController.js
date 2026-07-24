const Post = require('../models/Post');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Resource = require('../models/Resource');

// @desc    Universal search across posts, users, or subjects
// @route   GET /api/search
// @access  Public
const searchAll = async (req, res, next) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    const type = req.query.type ? req.query.type.toLowerCase() : '';

    if (!q) {
      return res.status(200).json({ success: true, results: [], data: [], count: 0 });
    }

    const regex = new RegExp(q, 'i');
    let results = {};

    if (!type || type === 'posts') {
      try {
        results.posts = await Post.find({ $text: { $search: q } })
          .populate('subjectId', 'name description tags')
          .populate('authorId', 'name username avatar profilePic role')
          .sort({ createdAt: -1 })
          .limit(20);
      } catch (e) {
        results.posts = [];
      }

      if (!results.posts || results.posts.length === 0) {
        results.posts = await Post.find({
          $or: [
            { title: regex },
            { content: regex },
            { tags: regex }
          ]
        })
          .populate('subjectId', 'name description tags')
          .populate('authorId', 'name username avatar profilePic role')
          .sort({ createdAt: -1 })
          .limit(20);
      }
    }

    if (!type || type === 'users') {
      results.users = await User.find({
        $or: [
          { username: regex },
          { name: regex },
          { college: regex },
          { bio: regex },
          { email: regex }
        ]
      })
        .select('-passwordHash')
        .limit(20);
    }

    if (!type || type === 'subjects') {
      results.subjects = await Subject.find({
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex }
        ]
      }).limit(20);
    }

    const responseData = type ? (results[type] || []) : results;
    const count = Array.isArray(responseData) ? responseData.length : Object.keys(results).reduce((acc, k) => acc + results[k].length, 0);

    res.status(200).json({
      success: true,
      data: responseData,
      results: responseData,
      count
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchAll,
  search: searchAll
};
