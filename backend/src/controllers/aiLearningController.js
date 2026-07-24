const Post = require('../models/Post');
const KnowledgeGap = require('../models/KnowledgeGap');
const LearningPath = require('../models/LearningPath');
const MentorMatch = require('../models/MentorMatch');
const Notification = require('../models/Notification');
const aiLearningEngine = require('../services/aiLearningEngine');

// @desc    Analyze active post and get/generate knowledge gaps
// @route   POST /api/ai-learning/analyze-post
// @access  Public / Authenticated
const analyzePost = async (req, res) => {
  try {
    const { postId, postData } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'anonymous_guest';

    let postObj = null;
    if (postId && postId.length === 24) {
      postObj = await Post.findById(postId);
    }

    // Fallback to client-provided post payload if post not in DB (e.g. mock/draft post)
    if (!postObj && postData) {
      postObj = {
        _id: postId || 'demo-post-1',
        title: postData.title || 'Academic Question',
        content: postData.content || '',
        codeSnippet: postData.codeSnippet || '',
        subjectId: postData.subjectId || 'cs',
        subjectName: postData.subjectName || 'Computer Science',
        tags: postData.tags || ['Programming']
      };
    }

    if (!postObj) {
      return res.status(404).json({
        success: false,
        message: 'Post data not found'
      });
    }

    const gaps = await aiLearningEngine.analyzePostKnowledgeGaps(postObj, userId);

    res.status(200).json({
      success: true,
      data: gaps
    });
  } catch (error) {
    console.error('aiLearningController analyzePost error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get or generate adaptive learning path for a post
// @route   POST /api/ai-learning/generate-path
// @access  Public / Authenticated
const generateLearningPath = async (req, res) => {
  try {
    const { postId, gapId, postData } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'anonymous_guest';

    let postObj = null;
    if (postId && postId.length === 24) {
      postObj = await Post.findById(postId);
    }

    if (!postObj && postData) {
      postObj = {
        _id: postId || 'demo-post-1',
        title: postData.title || 'Academic Question',
        content: postData.content || '',
        codeSnippet: postData.codeSnippet || '',
        subjectId: postData.subjectId || 'cs',
        subjectName: postData.subjectName || 'Computer Science',
        tags: postData.tags || ['Programming']
      };
    }

    if (!postObj) {
      return res.status(404).json({
        success: false,
        message: 'Post data not found'
      });
    }

    const learningPath = await aiLearningEngine.generateAdaptiveLearningPath(postObj, userId, gapId);

    res.status(200).json({
      success: true,
      data: learningPath
    });
  } catch (error) {
    console.error('aiLearningController generateLearningPath error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress on a specific module in learning path
// @route   PATCH /api/ai-learning/paths/:pathId/modules/:stepNumber
// @access  Public / Authenticated
const updateModuleProgress = async (req, res) => {
  try {
    const { pathId, stepNumber } = req.params;
    const { isCompleted } = req.body;

    const pathObj = await LearningPath.findById(pathId);
    if (!pathObj) {
      return res.status(404).json({ success: false, message: 'Learning path not found' });
    }

    const stepNum = parseInt(stepNumber, 10);
    const mod = pathObj.modules.find(m => m.stepNumber === stepNum);
    if (mod) {
      mod.isCompleted = Boolean(isCompleted);
      mod.completedAt = isCompleted ? new Date() : null;
    }

    // Calculate new overall percentage
    const completedCount = pathObj.modules.filter(m => m.isCompleted).length;
    pathObj.overallProgress = Math.round((completedCount / pathObj.modules.length) * 100);

    if (pathObj.overallProgress === 100) {
      pathObj.status = 'completed';
    } else {
      pathObj.status = 'active';
    }

    await pathObj.save();

    res.status(200).json({
      success: true,
      data: pathObj
    });
  } catch (error) {
    console.error('aiLearningController updateModuleProgress error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended peer mentors for a post / concept
// @route   POST /api/ai-learning/mentor-matches
// @access  Public / Authenticated
const getMentorMatches = async (req, res) => {
  try {
    const { postId, conceptTag, postData } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'anonymous_guest';

    let postObj = null;
    if (postId && postId.length === 24) {
      postObj = await Post.findById(postId);
    }

    if (!postObj && postData) {
      postObj = {
        _id: postId || 'demo-post-1',
        title: postData.title || 'Academic Question',
        subjectName: postData.subjectName || 'Computer Science',
        tags: postData.tags || ['Programming']
      };
    }

    const targetConcept = conceptTag || (postObj ? postObj.tags[0] : 'Academic Concept');
    const mentors = await aiLearningEngine.findPeerMentors(userId, postObj || {}, targetConcept);

    res.status(200).json({
      success: true,
      data: mentors
    });
  } catch (error) {
    console.error('aiLearningController getMentorMatches error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Connect with a matched mentor (sends notification)
// @route   POST /api/ai-learning/mentors/connect
// @access  Authenticated
const connectMentor = async (req, res) => {
  try {
    const { mentorId, conceptTag } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (userId && mentorId && mentorId.length === 24) {
      await Notification.create({
        recipientId: mentorId,
        senderId: userId,
        type: 'mentor_request',
        content: `requested academic mentorship on topic "${conceptTag || 'Academic Concept'}"`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mentorship connection request sent successfully!'
    });
  } catch (error) {
    console.error('aiLearningController connectMentor error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzePost,
  generateLearningPath,
  updateModuleProgress,
  getMentorMatches,
  connectMentor
};
