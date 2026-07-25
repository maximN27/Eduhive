const AI_SERVICE_TIMEOUT_MS = 30000;

class AIServiceError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'AIServiceError';
    this.status = status;
    this.code = code;
  }
}

const getAIServiceUrl = () => {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (!aiServiceUrl || !aiServiceUrl.trim()) {
    throw new AIServiceError(
      'AI service is currently unavailable',
      503,
      'AI_SERVICE_UNAVAILABLE'
    );
  }

  return aiServiceUrl.replace(/\/$/, '');
};

const postToAIService = async (path, payload) => {
  if (typeof fetch !== 'function') {
    throw new AIServiceError(
      'AI service is currently unavailable',
      503,
      'AI_SERVICE_UNAVAILABLE'
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_SERVICE_TIMEOUT_MS);

  try {
    const response = await fetch(`${getAIServiceUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new AIServiceError(
          'AI service rejected the request',
          502,
          'AI_SERVICE_VALIDATION_ERROR'
        );
      }

      throw new AIServiceError(
        'AI service is currently unavailable',
        503,
        'AI_SERVICE_UNAVAILABLE'
      );
    }

    if (!responseBody || typeof responseBody !== 'object') {
      throw new AIServiceError(
        'AI service returned an invalid response',
        502,
        'AI_SERVICE_INVALID_RESPONSE'
      );
    }

    return responseBody;
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new AIServiceError(
        'AI service request timed out',
        503,
        'AI_SERVICE_TIMEOUT'
      );
    }

    throw new AIServiceError(
      'AI service is currently unavailable',
      503,
      'AI_SERVICE_UNAVAILABLE'
    );
  } finally {
    clearTimeout(timeout);
  }
};

const summarizeWithAIService = (payload) =>
  postToAIService('/api/ai/summarize', payload);

const recommendWithAIService = (payload) =>
  postToAIService('/api/ai/recommend', payload);

module.exports = {
  AIServiceError,
  summarizeWithAIService,
  recommendWithAIService
};
