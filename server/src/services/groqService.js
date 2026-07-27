const Groq = require('groq-sdk');
const { SYSTEM_PROMPT, createStudyPrompt, createRetryPrompt } = require('../utils/promptTemplates');
const { validateStudyContent, cleanJsonString } = require('../validators/jsonValidator');

/**
 * Initializes and invokes Groq client to generate structured study data.
 * @param {string} input - Topic or notes from user.
 * @returns {Promise<Object>} Validated JSON object with flashcards and quiz.
 */
async function generateStudyContent(input) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_api_key_here')) {
    const err = new Error('Groq API key is missing or not configured.');
    err.statusCode = 401;
    err.isConfigError = true;
    throw err;
  }

  const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const groq = new Groq({ apiKey });

  // Tier 1: Primary Generation Attempt
  const firstPrompt = createStudyPrompt(input);
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: firstPrompt },
      ],
      model: modelName,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content || '';
    const cleanedJson = cleanJsonString(rawContent);

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch (parseErr) {
      console.warn('First JSON parse failed, initiating retry...', parseErr.message);
      return await retryGeneration(groq, modelName, input, 'JSON Syntax Error');
    }

    const validation = validateStudyContent(parsedData);
    if (!validation.isValid) {
      console.warn('First validation failed:', validation.error);
      return await retryGeneration(groq, modelName, input, validation.error);
    }

    return validation.data;
  } catch (error) {
    // If it's a rate limit or auth error from Groq SDK, format cleanly
    if (error.status === 401) {
      const err = new Error('Invalid Groq API key provided.');
      err.statusCode = 401;
      throw err;
    }
    if (error.status === 429) {
      const err = new Error('Groq API rate limit exceeded. Please wait a moment and try again.');
      err.statusCode = 429;
      throw err;
    }
    throw error;
  }
}

/**
 * Fallback retry execution if first attempt returns malformed JSON or invalid schema.
 */
async function retryGeneration(groq, modelName, input, errorReason) {
  const retryPrompt = createRetryPrompt(input, errorReason);
  
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: retryPrompt },
    ],
    model: modelName,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const rawContent = completion.choices[0]?.message?.content || '';
  const cleanedJson = cleanJsonString(rawContent);

  let parsedData;
  try {
    parsedData = JSON.parse(cleanedJson);
  } catch (err) {
    const error = new Error('AI returned an invalid JSON response after retry.');
    error.statusCode = 502;
    throw error;
  }

  const validation = validateStudyContent(parsedData);
  if (!validation.isValid) {
    const error = new Error(`AI returned invalid schema: ${validation.error}`);
    error.statusCode = 502;
    throw error;
  }

  return validation.data;
}

module.exports = {
  generateStudyContent,
};
