const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create quiz (Educator)
const createQuiz = async (req, res) => {
  try {
    const {
      quizTitle,
      quizDescription,
      courseId,
      chapterId,
      questions,
      passingScore,
      timeLimit,
      isTimed
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Calculate total points
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const quiz = await Quiz.create({
      quizTitle,
      quizDescription,
      courseId,
      chapterId,
      questions,
      totalPoints,
      passingScore,
      timeLimit,
      isTimed
    });

    // Add quiz to course
    course.quizzes.push(quiz._id);
    await course.save();

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get quiz by ID (without answers)
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit quiz attempt
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.points;
      }
    });

    const scorePercentage = Math.round((score / quiz.totalPoints) * 100);

    // Save attempt
    quiz.attempts.push({
      userId: req.user._id,
      score: scorePercentage,
      answers,
      timeTaken
    });
    await quiz.save();

    // Update enrollment quiz scores
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: quiz.courseId
    });

    if (enrollment) {
      const quizScoreIndex = enrollment.quizScores.findIndex(
        qs => qs.quizId.toString() === quiz._id.toString()
      );

      if (quizScoreIndex > -1) {
        enrollment.quizScores[quizScoreIndex] = {
          quizId: quiz._id,
          score: scorePercentage,
          totalQuestions: quiz.questions.length,
          attemptedAt: new Date()
        };
      } else {
        enrollment.quizScores.push({
          quizId: quiz._id,
          score: scorePercentage,
          totalQuestions: quiz.questions.length,
          attemptedAt: new Date()
        });
      }

      await enrollment.save();
    }

    res.json({ 
      success: true, 
      score: scorePercentage,
      passed: scorePercentage >= quiz.passingScore,
      totalPoints: quiz.totalPoints,
      earnedPoints: score
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course quizzes
const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId }).select('-questions.correctAnswer');

    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update quiz (Educator)
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.courseId);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.courseId);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await quiz.deleteOne();

    // Remove from course
    course.quizzes = course.quizzes.filter(q => q.toString() !== quiz._id.toString());
    await course.save();

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuiz,
  submitQuiz,
  getCourseQuizzes,
  updateQuiz,
  deleteQuiz
};
