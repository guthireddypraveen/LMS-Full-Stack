const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const {
  createEnrollment,
  getEnrollment,
  updateProgress,
  getCourseProgress
} = require('../controllers/enrollmentController');

router.use(authenticateUser);
router.use(getUserFromClerk);

router.post('/create', createEnrollment);
router.get('/:id', getEnrollment);
router.put('/:id/progress', updateProgress);
router.get('/course/:courseId/progress', getCourseProgress);

module.exports = router;
