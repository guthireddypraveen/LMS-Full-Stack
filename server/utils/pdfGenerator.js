const Certificate = require('../models/Certificate');
const crypto = require('crypto');

const generateCertificate = async ({ userId, courseId, studentName, courseName, instructorName }) => {
  try {
    const certificateId = `CERT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateId,
      studentName,
      courseName,
      instructorName,
      completionDate: new Date()
    });

    return certificate;
  } catch (error) {
    throw new Error('Certificate generation failed: ' + error.message);
  }
};

module.exports = { generateCertificate };
