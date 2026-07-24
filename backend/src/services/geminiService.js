const { GoogleGenAI } = require('@google/genai');

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

module.exports = {
  summarizePost
};
