const mongoose = require('mongoose');
const StudySet = require('../models/StudySet');
const { generateStudyContent } = require('../services/groqService');

/**
 * POST /api/generate
 * Generates flashcards and quiz using Groq AI, and saves to MongoDB Atlas if connected.
 */
async function generateMaterial(req, res, next) {
  try {
    const input = req.validatedInput;
    const studyData = await generateStudyContent(input);

    let savedDocument = null;

    // Save to MongoDB Atlas if connection is active
    if (mongoose.connection.readyState === 1) {
      try {
        savedDocument = await StudySet.create({
          topic: input,
          title: studyData.title,
          description: studyData.description,
          flashcards: studyData.flashcards,
          quiz: studyData.quiz,
        });
      } catch (dbErr) {
        console.warn('⚠️ Could not save study set to MongoDB Atlas:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...studyData,
        _id: savedDocument?._id || null,
        savedToDb: !!savedDocument,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history
 * Fetches all saved study sets from MongoDB Atlas.
 */
async function getHistory(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        history: [],
        message: 'MongoDB Atlas is not connected.',
      });
    }

    const history = await StudySet.find()
      .select('title description topic flashcards quiz createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const formattedHistory = history.map((item) => ({
      _id: item._id,
      title: item.title,
      description: item.description,
      topic: item.topic,
      flashcardCount: item.flashcards?.length || 0,
      quizCount: item.quiz?.length || 0,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      success: true,
      history: formattedHistory,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history/:id
 * Fetches a single study set by ID from MongoDB Atlas.
 */
async function getStudySetById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const studySet = await StudySet.findById(id).lean();
    if (!studySet) {
      return res.status(404).json({ error: 'Study set not found' });
    }

    return res.status(200).json({
      success: true,
      data: studySet,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/history/:id
 * Deletes a study set by ID from MongoDB Atlas.
 */
async function deleteStudySet(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deleted = await StudySet.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Study set not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Study set deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/health
 * Health check endpoint for system readiness and database connection.
 */
function getHealth(req, res) {
  const hasKey = !!(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_groq_api_key_here'));
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown';

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    configured: {
      groqApiKeySet: hasKey,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      mongoDbState: dbState,
      isDbConnected: mongoose.connection.readyState === 1,
    },
  });
}

module.exports = {
  generateMaterial,
  getHistory,
  getStudySetById,
  deleteStudySet,
  getHealth,
};
