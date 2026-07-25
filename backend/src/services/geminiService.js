const { GoogleGenAI } = require('@google/genai');

const DEFAULT_FALLBACK_MESSAGE = "Two verified professors reached differing conclusions on this topic.";
const FORBIDDEN_WORDS = ['wrong', 'incorrect', 'mistake'];

/**
 * Original EduHive Post Summarization Service
 */
const summarizePost = async (postTitle, postContent, topComments = []) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const formattedComments = topComments
    .map((c, i) => `Answer ${i + 1} (${c.voteScore || 0} votes): ${c.content}`)
    .join('\n');

  const prompt = `You are an expert academic assistant for EduHive.
Summarize the following academic question and its community answers into a concise, neutral 2-4 sentence summary highlighting the main question and the key supported solution(s). Do not invent facts or information not present in the provided text.

[Question Title]: ${postTitle}
[Question Body]: ${postContent}

[Top Community Answers]:
${formattedComments || 'No community answers yet.'}

Provide only the summary text directly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    if (response && response.text) {
      return response.text.trim();
    }

    throw new Error('No summary generated from Gemini API');
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    throw new Error('Summary temporarily unavailable');
  }
};

/**
 * Generate concise, neutral academic conflict suggestion message using Gemini API.
 * Never asserts which answer is correct.
 * Rejects messages containing "wrong", "incorrect", or "mistake".
 * Falls back to generic message on failure/timeout.
 */
async function generateConflictMessage(post, answerA, answerB) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return DEFAULT_FALLBACK_MESSAGE;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Write a short neutral notification message under 18 words for an academic Q&A platform alerting readers that two verified professors reached differing conclusions on the topic "${post?.title || 'Academic Topic'}".
STRICT RULES:
1. Do NOT state or imply which professor is right or wrong.
2. NEVER use the words: wrong, incorrect, or mistake.
3. Keep the total length strictly under 20 words.
4. Output ONLY the message text.`;

    // Timeout protection (3 second max timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API Timeout')), 3000)
    );

    const apiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response?.text ? response.text.trim().replace(/^["']|["']$/g, '') : '';

    if (!text) {
      return DEFAULT_FALLBACK_MESSAGE;
    }

    // Check word count
    const words = text.split(/\s+/);
    if (words.length > 25) {
      return DEFAULT_FALLBACK_MESSAGE;
    }

    // Check for forbidden correctness assertions
    const lower = text.toLowerCase();
    for (const forbidden of FORBIDDEN_WORDS) {
      if (lower.includes(forbidden)) {
        return DEFAULT_FALLBACK_MESSAGE;
      }
    }

    return text;
  } catch (err) {
    console.warn('Gemini Service Fallback:', err.message);
    return DEFAULT_FALLBACK_MESSAGE;
  }
}

module.exports = {
  summarizePost,
  generateConflictMessage,
  DEFAULT_FALLBACK_MESSAGE
};
