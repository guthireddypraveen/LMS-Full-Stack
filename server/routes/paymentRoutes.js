const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const {
  createSandboxPayment,
  createStripePayment,
  verifyStripePayment,
  getReceipt,
  getUserPayments
} = require('../controllers/paymentController');

router.use(authenticateUser);
router.use(getUserFromClerk);

router.post('/sandbox', createSandboxPayment);
router.post('/stripe/create', createStripePayment);
router.post('/stripe/verify', verifyStripePayment);
router.get('/receipt/:transactionId', getReceipt);
router.get('/user/all', getUserPayments);

module.exports = router;
