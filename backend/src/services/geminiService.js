/**
 * Gemini API Integration & Suggestion Message Generator
 * 
 * Generates calm, non-alarming suggestion messages (<20 words) for conflicting answers.
 * Implements strict keyword validation filtering against judgment words ('wrong', 'incorrect', 'mistake').
 * Provides automatic fallback to a safe generic message on API error, timeout, or repeated validation rejection.
 */

const { GoogleGenAI } = require('@google/genai');

const DEFAULT_SAFE_MESSAGE = "Professors have offered differing insights on this topic. Review both perspectives below.";
const JUDGMENT_KEYWORDS = ['wrong', 'incorrect', 'mistake', 'flawed', 'error', 'fault', 'falsehood'];
const MAX_WORD_COUNT = 25; // Target is < 20 words, allowing minor slack up to 25 words before fallback

/**
 * Checks if generated message contains any prohibited judgment words.
 * 
 * @param {string} message 
 * @returns {boolean} True if message contains judgment words, false otherwise.
 */
function containsJudgmentWords(message) {
  if (!message || typeof message !== 'string') return true;
  const lower = message.toLowerCase();
  return JUDGMENT_KEYWORDS.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * Validates the generated message:
 * - Must be non-empty string
 * - Must not contain judgment words
 * - Must be concise (< ~20-25 words)
 * 
 * @param {string} message 
 * @returns {boolean}
 */
function validateSuggestionMessage(message) {
  if (!message || typeof message !== 'string') return false;
  const clean = message.trim();
  if (clean.length === 0) return false;
  if (containsJudgmentWords(clean)) return false;
  const wordCount = clean.split(/\s+/).length;
  if (wordCount > MAX_WORD_COUNT) return false;
  return true;
}

/**
 * Generate suggestion message using Gemini API with timeout & validation fallback.
 * 
 * @param {Object} post 
 * @param {Object} answerA 
 * @param {Object} answerB 
 * @param {Object} [options] - Optional parameter overrides for testing/mocking
 * @returns {Promise<string>} Validated suggestion message or fallback message
 */
async function generateConflictSuggestionMessage(post, answerA, answerB, options = {}) {
  // If simulated error/timeout passed in options for testing
  if (options.forceFail) {
    return DEFAULT_SAFE_MESSAGE;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback when API key is missing
    return DEFAULT_SAFE_MESSAGE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a neutral academic assistant for a university Q&A portal.
Two verified professors have provided different conclusions on a student's post.

Post Title: "${post.title || ''}"
Professor Answer 1 Conclusion: "${answerA.conclusion || ''}"
Professor Answer 2 Conclusion: "${answerB.conclusion || ''}"

Task: Write a single, calm, neutral, and non-alarming suggestion message for the student.
Strict Guidelines:
1. Keep it under 20 words.
2. DO NOT state or suggest which answer is right or wrong.
3. DO NOT use words like "wrong", "incorrect", "mistake", "error", or "false".
4. Simply invite the student to review both perspectives.

Output only the message text.`;

    // 4-second timeout promise wrapper
    const apiCallPromise = (async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text ? response.text.trim() : null;
    })();

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API call timed out')), 4000);
    });

    const rawMessage = await Promise.race([apiCallPromise, timeoutPromise]);
    
    // Clean surrounding quotes if any
    const cleanedMessage = (rawMessage || '').replace(/^["']|["']$/g, '').trim();

    if (validateSuggestionMessage(cleanedMessage)) {
      return cleanedMessage;
    } else {
      console.warn('Gemini output failed validation (judgment word or length constraint), falling back to safe message.');
      return DEFAULT_SAFE_MESSAGE;
    }
  } catch (err) {
    console.warn(`Gemini API error/timeout: ${err.message}. Falling back to default safe message.`);
    return DEFAULT_SAFE_MESSAGE;
  }
}

module.exports = {
  generateConflictSuggestionMessage,
  validateSuggestionMessage,
  containsJudgmentWords,
  DEFAULT_SAFE_MESSAGE
};
