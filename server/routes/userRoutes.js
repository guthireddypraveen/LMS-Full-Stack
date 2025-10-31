const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const {
  getUserData,
  getEnrolledCourses,
  updateProfile
} = require('../controllers/userController');

router.use(authenticateUser);
router.use(getUserFromClerk);

router.get('/data', getUserData);
router.get('/enrolled-courses', getEnrolledCourses);
router.put('/profile', updateProfile);

module.exports = router;
