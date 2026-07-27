const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studyRoutes = require('./routes/studyRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize MongoDB Atlas Connection
connectDB();

const app = express();

// CORS configuration — supports comma-separated CLIENT_URL for multiple origins
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim())
  .concat(['http://localhost:5173', 'http://127.0.0.1:5173']);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '⚡ AI Study Assistant API Server is running!',
    endpoints: {
      health: '/api/health',
      generate: 'POST /api/generate',
      history: '/api/history',
    },
  });
});

// Mount API routes
app.use('/api', studyRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Endpoint ${req.originalUrl} does not exist.`,
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
