const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/adminAuth');
const {
  getAllUsers,
  getAllEnrollments,
  getAllPayments,
  getStatistics,
  deleteUser,
  updateUserRole
} = require('../controllers/adminController');

router.use(authenticateUser);
router.use(getUserFromClerk);
router.use(authorizeAdmin);

router.get('/users', getAllUsers);
router.get('/enrollments', getAllEnrollments);
router.get('/payments', getAllPayments);
router.get('/statistics', getStatistics);
router.delete('/user/:id', deleteUser);
router.put('/user/:id/role', updateUserRole);

module.exports = router;
