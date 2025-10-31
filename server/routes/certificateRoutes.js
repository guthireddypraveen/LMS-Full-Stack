const express = require('express');
const router = express.Router();
const { authenticateUser, getUserFromClerk } = require('../middleware/auth');
const {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  downloadCertificate,
  getUserCertificates
} = require('../controllers/certificateController');

// Public route for verification
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.use(authenticateUser);
router.use(getUserFromClerk);

router.post('/generate', generateCertificate);
router.get('/:id', getCertificate);
router.get('/:id/download', downloadCertificate);
router.get('/user/all', getUserCertificates);

module.exports = router;
