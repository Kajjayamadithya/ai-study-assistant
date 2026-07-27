# ⚡ AI Study Assistant

A production-grade, full-stack AI-powered study web application that transforms any study topic or raw educational notes into interactive 3D **Flashcards** and multiple-choice **Quizzes** using the **Groq AI SDK** (`llama-3.3-70b-versatile`).

---

## 📌 Project Overview

The **AI Study Assistant** is built to help students and developers turn dense study material into digestible flashcards and self-assessment quizzes in seconds.

- **Frontend**: Built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. Includes 3D card flip animations, progress tracking, local flashcard bookmarking, keyboard navigation, score analytics, history management, and dark/light mode.
- **Backend**: **Node.js** + **Express.js** REST API with production-grade AI prompt engineering, JSON schema validation, self-healing 2-tier retry logic, input rate limiting, and MongoDB Atlas cloud persistence.
- **Security & Architecture**: Zero direct client calls to Groq or MongoDB. API keys and credentials are strictly isolated within the Node.js backend `.env` environment. The Groq key is **never** exposed to the browser.

---

## ✨ Features

- 🎯 **Instant Material Generation**: Paste raw lecture notes or type any subject (e.g. *Operating Systems*, *DBMS*, *Computer Networks*, *Machine Learning*).
- 🧠 **Production-Grade AI Prompt**: University-professor level system prompt with:
  - Dynamic topic scope analysis (Broad vs Specific)
  - **25 Flashcards / 15 Quizzes** for broad subjects
  - **8 Flashcards / 6 Quizzes** for specific topics
  - Difficulty balancing: 30% Beginner, 40% Intermediate, 30% Advanced
- 🎴 **Interactive 3D Flashcards**:
  - CSS 3D perspective flip animation (click or press `Space`).
  - Next/Previous card navigation (`←` / `→` arrow keys).
  - Shuffle card deck & Restart functionality.
  - Bookmark favorite or difficult cards for targeted review.
- 📝 **Self-Assessment Quiz**:
  - Single-question focus with clear option selection.
  - Progress indicator bar.
  - Instant explanation breakdown for each question.
  - **"Retry Incorrect Questions"** mode for focused re-study.
- 📊 **Comprehensive Results Analytics**:
  - Score percentage breakdown and performance evaluation.
  - Detailed summary of correct vs. wrong answers.
  - **Export Study Set** feature (download notes as Markdown `.md` or `.json`).
- 🗄️ **MongoDB Atlas Cloud Persistence**:
  - All generated study sets are automatically saved to MongoDB Atlas.
  - Full **Study History** tab to browse, reload, or delete past sessions.
  - Graceful fallback if database is unavailable — app continues to work offline.
- 🌓 **Modern SaaS UI**:
  - Dark / Light mode toggle (persisted in `localStorage`).
  - Fully responsive across Desktop, Tablet, and Mobile.
  - Accessible keyboard shortcuts and ARIA labels.
- 🛡️ **Robust Error Handling & Security**:
  - Strict JSON validation verifying array types, 4 options per quiz question, and zero-indexed correct answer bounds (`0–3`).
  - 2-tier self-correcting AI prompt retry fallback if JSON is ever malformed.
  - Request cancellation (`AbortController`) to prevent stale API responses.

---

## 🏗️ System Architecture

```
[ React 19 Frontend ]  <--- HTTP/JSON --->  [ Express Backend ]  <--- (Groq SDK) --->  [ Groq AI ]
   • Vite & Tailwind CSS                      • Prompt Engineering                       • llama-3.3-70b-versatile
   • Theme & Study Context                    • 2-tier Self-Healing JSON Retry
   • Custom Hooks (useStudy, useTheme)        • Rate Limiting & Error Handler
   • LocalStorage & MongoDB Persistence       • MongoDB Atlas Save/Load/Delete
```

---

## 📁 Folder Structure

```
d:/assignment/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/              # All reusable UI components (flat, no sub-folders)
│   │   │   ├── ErrorBoundary.jsx    # Global React Error Boundary
│   │   │   ├── Flashcard.jsx        # Single 3D flip card component
│   │   │   ├── FlashcardList.jsx    # Full flashcard deck with navigation & bookmarks
│   │   │   ├── Navbar.jsx           # Responsive header & tab navigation
│   │   │   ├── ProgressBar.jsx      # Reusable animated progress bar
│   │   │   ├── QuizCard.jsx         # Single quiz question with options
│   │   │   ├── QuizSummary.jsx      # Score breakdown & answer review
│   │   │   ├── SkeletonLoader.jsx   # Animated skeleton loading state
│   │   │   └── ThemeToggle.jsx      # Dark/Light mode switcher
│   │   ├── context/
│   │   │   ├── StudyContext.jsx     # StudyProvider component (React Fast Refresh compliant)
│   │   │   ├── ThemeContext.jsx     # ThemeProvider component (React Fast Refresh compliant)
│   │   │   ├── studyCtx.js          # Plain createContext() object for StudyContext
│   │   │   └── themeCtx.js          # Plain createContext() object for ThemeContext
│   │   ├── hooks/
│   │   │   ├── useStudy.js          # Custom hook for StudyContext access
│   │   │   └── useTheme.js          # Custom hook for ThemeContext access
│   │   ├── pages/                   # Tab-level page views (flat, no sub-folders)
│   │   │   ├── FlashcardsPage.jsx   # Flashcards tab view
│   │   │   ├── HistoryPage.jsx      # Study history tab with MongoDB Atlas records
│   │   │   ├── Home.jsx             # Hero section, text input & preset topic chips
│   │   │   ├── QuizPage.jsx         # Active quiz step view
│   │   │   └── ResultsPage.jsx      # Score analytics page
│   │   ├── services/
│   │   │   └── api.js               # Axios API client with AbortController support
│   │   ├── utils/
│   │   │   └── exportUtils.js       # Export study set as .md or .json download
│   │   ├── App.jsx                  # Main App entry point & tab router
│   │   ├── index.css                # Tailwind base + 3D CSS flip keyframes + glassmorphism
│   │   └── main.jsx                 # React DOM entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Express Backend REST API
│   ├── src/                         # All application source code lives under src/
│   │   ├── config/
│   │   │   └── db.js                # Mongoose MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   └── studyController.js   # Route handlers: generate, history, delete, health
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Centralized Express error handler
│   │   │   └── validateRequest.js   # Input payload validator (3–15,000 chars)
│   │   ├── models/
│   │   │   └── StudySet.js          # Mongoose schema for saved study sets
│   │   ├── routes/
│   │   │   └── studyRoutes.js       # API routes + rate limiting configuration
│   │   ├── services/
│   │   │   └── groqService.js       # Groq SDK integration + 2-tier retry logic
│   │   ├── utils/
│   │   │   └── promptTemplates.js   # Production-grade system & user prompt templates
│   │   ├── validators/
│   │   │   └── jsonValidator.js     # Strict JSON schema validator + cleanJsonString
│   │   └── app.js                   # Express application setup, CORS, middleware assembly
│   ├── server.js                    # Server entry point (imports ./src/app)
│   ├── package.json
│   └── .env                         # Environment variables (never commit to Git)
│
└── README.md                        # Project Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Groq API Key**: Obtain a free key from [Groq Console](https://console.groq.com/)
- **MongoDB Atlas URI** *(optional)*: Obtain a free connection string from [MongoDB Atlas](https://cloud.mongodb.com/)

---

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install
```

Create `server/.env` and add your environment variables:

```env
PORT=5000
NODE_ENV=development
GROQ_API_KEY=gsk_your_actual_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/AI_study_Assistent?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

> **Note**: `MONGODB_URI` is optional. If not provided, the app runs without persistence (history tab will be empty). The Groq API is fully functional without MongoDB.

Start the backend server with hot-reload:

```bash
npm start
```
*(Server runs at `http://localhost:5000`)*

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
|:---|:---:|:---|:---|
| `PORT` | No | `5000` | Express server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `GROQ_API_KEY` | **Yes** | — | Groq API key from console.groq.com |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model ID |
| `MONGODB_URI` | No | — | MongoDB Atlas connection string |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed CORS origin |

---

## 🤖 AI Integration

### Model
This application uses Groq's fast LPU inference engine with the **`llama-3.3-70b-versatile`** model by default.

To change the model, update `GROQ_MODEL` in `server/.env`:
```env
GROQ_MODEL=llama-3.3-70b-versatile
```

Supported Groq models:
| Model | Speed | Accuracy |
|:---|:---:|:---:|
| `llama-3.3-70b-versatile` | Fast | ⭐⭐⭐⭐⭐ |
| `llama-3.1-8b-instant` | Fastest | ⭐⭐⭐ |
| `mixtral-8x7b-32768` | Medium | ⭐⭐⭐⭐ |

### Production-Grade Prompt Architecture

The system prompt was designed at GPT-4 / Claude Sonnet level:

- **Dynamic Scope Analysis**: Automatically detects whether the topic is broad or specific.
- **Broad Topics** (e.g. Operating Systems, DBMS, Machine Learning, Computer Networks):
  - Generates **25 flashcards** distributed across all major subtopics.
  - Generates **15 quiz questions**.
- **Specific Topics** (e.g. TCP 3-Way Handshake, ACID Properties, Binary Search Trees):
  - Generates **8 flashcards** with deep mechanisms and edge cases.
  - Generates **6 quiz questions**.
- **Difficulty Balancing**: 30% Beginner, 40% Intermediate, 30% Advanced.
- **2-Tier Self-Healing Retry**: If the AI response fails JSON parsing or schema validation, the backend automatically re-invokes Groq at a lower temperature (`0.1`) with explicit error context.

### AI Usage Declaration
- All flashcard questions/answers, quiz questions, options, and explanations are generated **100% dynamically** using Groq AI.
- **Zero mock or hardcoded content** exists in the codebase.
- Every AI output is validated against a strict JSON schema before being returned to the UI.

---

## 🛡️ Security Design

| Security Measure | Implementation |
|:---|:---|
| API Key Isolation | Groq API key lives exclusively in `server/.env`, never sent to the browser |
| CORS Restriction | Only `localhost:5173` and `CLIENT_URL` environment origins allowed |
| Rate Limiting | 15 requests per 15-minute window per IP on `/api/generate` |
| Input Validation | 3–15,000 character input length enforced in middleware before reaching AI |
| JSON Schema Validation | Every AI response verified for type correctness, array length, and integer bounds |
| Error Sanitization | Stack traces never exposed to the client in production |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/generate` | Generate flashcards & quiz from topic/notes |
| `GET` | `/api/history` | Fetch all saved study sets (sorted by newest) |
| `GET` | `/api/history/:id` | Fetch a single study set by MongoDB ID |
| `DELETE` | `/api/history/:id` | Delete a saved study set by MongoDB ID |
| `GET` | `/api/health` | Health check: Groq key status & DB connection |

### POST `/api/generate` — Request Body

```json
{
  "topic": "Operating Systems"
}
```

### POST `/api/generate` — Response Shape

```json
{
  "success": true,
  "data": {
    "_id": "64f2b...",
    "title": "Operating Systems",
    "description": "Covers processes, scheduling, memory management, and file systems.",
    "flashcards": [
      { "id": 1, "question": "...", "answer": "..." }
    ],
    "quiz": [
      {
        "id": 1,
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 2,
        "explanation": "..."
      }
    ],
    "savedToDb": true
  }
}
```

---

## ⚠️ Known Limitations

1. **Groq API Rate Limits**: Free tier accounts may experience `429` rate limit responses under heavy usage. The app catches this gracefully and displays a user-friendly retry banner.
2. **Context Length**: Notes inputs are capped at **15,000 characters** to stay within LLM token window limits and maintain low response latency.
3. **In-Memory Rate Limiting**: The current `express-rate-limit` implementation stores limits in Node.js process memory. For horizontal scaling across multiple instances, a Redis-backed store (`rate-limit-redis`) should be configured.

---

## ⏱️ Time Spent

| Phase | Time |
|:---|:---|
| Architecture & System Design | ~45 mins |
| Backend API, AI Prompt Engineering & JSON Schema Validation | ~1.5 hours |
| MongoDB Atlas Integration & History Feature | ~30 mins |
| Frontend UI/UX, 3D Flashcards & Quiz Engine | ~2 hours |
| Context Refactoring, Hooks Architecture & Fast Refresh Fixes | ~30 mins |
| Folder Structure Cleanup & README | ~30 mins |
| Testing, Error Handling & Refinement | ~45 mins |
| **Total** | **~6.5 hours** |
