const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  lectureTitle: { type: String, required: true },
  lectureType: { type: String, enum: ['video', 'text', 'document'], required: true },
  lectureContent: { type: String, required: true }, // URL for video/document, or text content
  lectureDuration: { type: Number, default: 0 }, // in minutes
  lectureOrder: { type: Number, required: true }
});

const chapterSchema = new mongoose.Schema({
  chapterTitle: { type: String, required: true },
  chapterDescription: String,
  chapterContent: [lectureSchema],
  chapterOrder: { type: Number, required: true }
});

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: String,
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseCategory: { type: String, required: true },
  courseLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  coursePrice: { type: Number, required: true, default: 0 },
  courseThumbnail: String,
  courseContent: [chapterSchema],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructorName: String,
  instructorBio: String,
  instructorImage: String,
  courseRatings: [ratingSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalEnrollments: { type: Number, default: 0 },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
