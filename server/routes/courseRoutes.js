const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const { authorizeEducator } = require('../middleware/adminAuth');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  updateCourse,
  addChapter,
  addLecture,
  getInstructorCourses,
  deleteCourse,
  addCourseRating
} = require('../controllers/courseController');

// Public routes
router.get('/all', getAllCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);

// Protected routes
router.use(authenticateUser);
router.use(getUserFromClerk);

// Student routes
router.post('/:id/rating', addCourseRating);

// Educator routes
router.post('/create', authorizeEducator, upload.single('thumbnail'), createCourse);
router.put('/:id', authorizeEducator, updateCourse);
router.delete('/:id', authorizeEducator, deleteCourse);
router.post('/:id/chapter', authorizeEducator, addChapter);
router.post('/:id/chapter/:chapterId/lecture', authorizeEducator, upload.single('file'), addLecture);
router.get('/instructor/courses', authorizeEducator, getInstructorCourses);

module.exports = router;
