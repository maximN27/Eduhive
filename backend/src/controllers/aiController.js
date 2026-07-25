const Resource = require('../models/Resource');
const aiServiceClient = require('../services/aiServiceClient');

const RECOMMENDATION_CANDIDATE_LIMIT = 50;

const recommendResourcesHandler = async (req, res, next) => {
  try {
    const resources = await Resource.find({})
      .sort({ votes: -1, createdAt: -1, _id: -1 })
      .limit(RECOMMENDATION_CANDIDATE_LIMIT);

    const recommendation = await aiServiceClient.recommendWithAIService({
      userProfile: {
        experienceLevel: req.user.experienceLevel,
        interests: req.user.interests,
        preferredLanguage: req.user.preferredLanguage,
        preferredResourceType: req.user.preferredResourceType
      },
      candidateResources: resources.map((resource) => ({
        id: resource._id.toString(),
        title: resource.title,
        type: resource.type,
        url: resource.url,
        tags: resource.tags
      }))
    });

    res.status(200).json(recommendation);
  } catch (error) {
    if (error instanceof aiServiceClient.AIServiceError) {
      return res.status(error.status).json({
        success: false,
        error: { message: error.message, code: error.code },
        message: error.message
      });
    }

    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { recommendResourcesHandler };
