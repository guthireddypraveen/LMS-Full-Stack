const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const { authorizeEducator } = require('../middleware/adminAuth');
const {
  createQuiz,
  getQuiz,
  submitQuiz,
  getCourseQuizzes,
  updateQuiz,
  deleteQuiz
} = require('../controllers/quizController');

router.use(authenticateUser);
router.use(getUserFromClerk);

// Student routes
router.get('/:id', getQuiz);
router.post('/:id/submit', submitQuiz);
router.get('/course/:courseId', getCourseQuizzes);

// Educator routes
router.post('/create', authorizeEducator, createQuiz);
router.put('/:id', authorizeEducator, updateQuiz);
router.delete('/:id', authorizeEducator, deleteQuiz);

module.exports = router;
