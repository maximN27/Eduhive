const Post = require('../models/Post');
const User = require('../models/User');
const Subject = require('../models/Subject');

// @desc    Universal search across posts, users, or subjects
// @route   GET /api/search
// @access  Public
exports.search = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Query string parameter "q" is required' });
    }

    const regex = new RegExp(q, 'i');
    let results = {};

    if (!type || type === 'posts') {
      results.posts = await Post.find({
        $or: [
          { title: regex },
          { content: regex },
          { tags: regex }
        ]
      })
      .populate('subjectId', 'name')
      .populate('authorId', 'name username avatar profilePic')
      .sort({ createdAt: -1 })
      .limit(20);
    }

    if (!type || type === 'users') {
      results.users = await User.find({
        $or: [
          { username: regex },
          { name: regex },
          { college: regex },
          { bio: regex }
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
      })
      .limit(20);
    }

    res.status(200).json({
      success: true,
      data: type ? (results[type] || []) : results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
