/**
 * Validates the structured JSON object returned by Groq AI.
 * Ensures strict compliance with required application schema.
 */

function validateStudyContent(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { isValid: false, error: 'Output is not a valid JSON object' };
  }

  // 1. Validate top-level title and description
  if (typeof data.title !== 'string' || !data.title.trim()) {
    return { isValid: false, error: 'Missing or invalid "title" field' };
  }
  if (typeof data.description !== 'string' || !data.description.trim()) {
    return { isValid: false, error: 'Missing or invalid "description" field' };
  }

  // 2. Validate flashcards array
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    return { isValid: false, error: '"flashcards" must be a non-empty array' };
  }

  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];
    if (!card || typeof card !== 'object') {
      return { isValid: false, error: `Flashcard at index ${i} is not an object` };
    }
    if (typeof card.question !== 'string' || !card.question.trim()) {
      return { isValid: false, error: `Flashcard ${i + 1} has missing or empty "question"` };
    }
    if (typeof card.answer !== 'string' || !card.answer.trim()) {
      return { isValid: false, error: `Flashcard ${i + 1} has missing or empty "answer"` };
    }
    // Normalize id
    card.id = card.id || i + 1;
  }

  // 3. Validate quiz array
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return { isValid: false, error: '"quiz" must be a non-empty array' };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    if (!q || typeof q !== 'object') {
      return { isValid: false, error: `Quiz question at index ${i} is not an object` };
    }
    if (typeof q.question !== 'string' || !q.question.trim()) {
      return { isValid: false, error: `Quiz item ${i + 1} has missing or empty "question"` };
    }

    // Validate options
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { isValid: false, error: `Quiz item ${i + 1} must contain exactly 4 options` };
    }
    for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
      if (typeof q.options[optIdx] !== 'string' || !q.options[optIdx].trim()) {
        return { isValid: false, error: `Quiz item ${i + 1} option ${optIdx + 1} is empty or invalid` };
      }
    }

    // Validate correctAnswer index
    if (
      typeof q.correctAnswer !== 'number' ||
      !Number.isInteger(q.correctAnswer) ||
      q.correctAnswer < 0 ||
      q.correctAnswer > 3
    ) {
      return { isValid: false, error: `Quiz item ${i + 1} "correctAnswer" must be an integer index between 0 and 3` };
    }

    // Validate explanation
    if (typeof q.explanation !== 'string') {
      q.explanation = `Option ${q.correctAnswer + 1} is the correct answer.`;
    }

    // Normalize id
    q.id = q.id || i + 1;
  }

  return { isValid: true, data };
}

/**
 * Strips markdown code blocks if AI outputs ```json ... ``` wrapper.
 */
function cleanJsonString(rawString) {
  if (!rawString) return '';
  let cleaned = rawString.trim();
  // Remove starting ```json or ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  // Remove trailing ```
  cleaned = cleaned.replace(/\s*```$/i, '');
  return cleaned.trim();
}

module.exports = {
  validateStudyContent,
  cleanJsonString,
};
