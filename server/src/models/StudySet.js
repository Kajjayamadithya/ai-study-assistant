const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const QuizQuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
});

const StudySetSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    flashcards: [FlashcardSchema],
    quiz: [QuizQuestionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudySet', StudySetSchema);
