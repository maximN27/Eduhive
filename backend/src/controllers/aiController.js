const Resource = require('../models/Resource');
const aiServiceClient = require('../services/aiServiceClient');

const RECOMMENDATION_CANDIDATE_LIMIT = 50;

function generateSmartRecommendations(userProfile = {}, candidateResources = []) {
  const level = (userProfile.experienceLevel || 'Beginner').toLowerCase();
  const userInterests = (userProfile.interests || []).map(i => String(i).toLowerCase());

  return candidateResources.map(res => {
    const resId = res.id || res._id || 'res-id';
    const title = res.title || 'Learning Resource';
    const tags = (res.tags || []).map(t => String(t).toLowerCase());

    let matchCount = 0;
    userInterests.forEach(interest => {
      if (title.toLowerCase().includes(interest) || tags.some(t => t.includes(interest))) {
        matchCount++;
      }
    });

    const isLevelMatch = tags.includes(level) || title.toLowerCase().includes(level);

    let score = 5.0;
    let reason = `Resource covering ${tags.join(', ') || 'general topic'}.`;

    if (matchCount > 0 && isLevelMatch) {
      score = 9.5;
      reason = `Perfect match for your interest in ${userInterests.slice(0, 2).join(' and ')} and ${userProfile.experienceLevel || 'beginner'} experience level.`;
    } else if (matchCount > 0) {
      score = 8.5;
      reason = `Great match for your interest in ${userInterests.slice(0, 2).join(' and ')}.`;
    } else if (isLevelMatch) {
      score = 7.0;
      reason = `Matches your ${userProfile.experienceLevel || 'beginner'} experience level.`;
    } else {
      score = 1.0;
      reason = `This resource is for ${tags.find(t => ['advanced', 'intermediate', 'beginner'].includes(t)) || 'other'} users and does not cover ${userInterests.slice(0, 2).join(' or ') || 'your primary interests'}.`;
    }

    return {
      resourceId: String(resId),
      title,
      reason,
      score
    };
  });
}

const recommendResourcesHandler = async (req, res, next) => {
  try {
    const userProfile = req.body?.userProfile || {
      experienceLevel: req.user?.experienceLevel || 'Beginner',
      interests: req.user?.interests || ['Python', 'Machine Learning'],
      preferredLanguage: req.user?.preferredLanguage || 'English',
      preferredResourceType: req.user?.preferredResourceType || 'All'
    };

    let candidateResources = req.body?.candidateResources;

    if (!candidateResources || !Array.isArray(candidateResources) || candidateResources.length === 0) {
      const resources = await Resource.find({})
        .sort({ votes: -1, createdAt: -1, _id: -1 })
        .limit(RECOMMENDATION_CANDIDATE_LIMIT);

      candidateResources = resources.map((resource) => ({
        id: resource._id.toString(),
        title: resource.title,
        type: resource.type,
        url: resource.url,
        tags: resource.tags
      }));
    }

    try {
      const recommendation = await aiServiceClient.recommendWithAIService({
        userProfile,
        candidateResources
      });
      return res.status(200).json(recommendation);
    } catch (aiErr) {
      // Return smart recommendations fallback matching requested format
      const recommendations = generateSmartRecommendations(userProfile, candidateResources);
      return res.status(200).json({ recommendations });
    }
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { recommendResourcesHandler };
