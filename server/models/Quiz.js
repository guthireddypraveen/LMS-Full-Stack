const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'], default: 'multiple-choice' },
  options: [String], // For multiple choice
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  quizTitle: { type: String, required: true },
  quizDescription: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterId: mongoose.Schema.Types.ObjectId, // null for full-course quiz
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  passingScore: { type: Number, default: 70 }, // percentage
  timeLimit: { type: Number, default: 0 }, // in minutes, 0 for untimed
  isTimed: { type: Boolean, default: false },
  attempts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    answers: [String],
    attemptedAt: { type: Date, default: Date.now },
    timeTaken: Number // in seconds
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
