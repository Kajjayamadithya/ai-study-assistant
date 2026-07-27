/**
 * Centralized express error handler middleware.
 */
function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message || err);

  const statusCode = err.statusCode || 500;
  const response = {
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred while generating study materials.',
  };

  if (err.isConfigError) {
    response.isConfigRequired = true;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
