/**
 * Middleware to validate POST /api/generate payload.
 */
function validateGeneratePayload(req, res, next) {
  const { topic, notes } = req.body;
  const input = (topic || notes || '').trim();

  if (!input) {
    return res.status(400).json({
      error: 'Invalid Request',
      message: 'Please provide a study topic or notes to generate material.',
    });
  }

  if (input.length < 3) {
    return res.status(400).json({
      error: 'Payload Too Short',
      message: 'Study topic or notes must be at least 3 characters long.',
    });
  }

  if (input.length > 15000) {
    return res.status(400).json({
      error: 'Payload Too Large',
      message: 'Input notes exceed maximum limit of 15,000 characters.',
    });
  }

  req.validatedInput = input;
  next();
}

module.exports = {
  validateGeneratePayload,
};
