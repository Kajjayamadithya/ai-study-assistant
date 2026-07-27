const express = require('express');
const router = express.Router();
const {
  generateMaterial,
  getHistory,
  getStudySetById,
  deleteStudySet,
  getHealth,
} = require('../controllers/studyController');
const { validateGeneratePayload } = require('../middleware/validateRequest');
const rateLimit = require('express-rate-limit');

// Rate limiter for generation endpoint
const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    error: 'Too Many Requests',
    message: 'You have sent too many generation requests. Please wait a few minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/generate', generateLimiter, validateGeneratePayload, generateMaterial);
router.get('/history', getHistory);
router.get('/history/:id', getStudySetById);
router.delete('/history/:id', deleteStudySet);
router.get('/health', getHealth);

module.exports = router;
