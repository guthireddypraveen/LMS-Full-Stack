const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEnrollmentEmail = async (userEmail, courseName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Enrollment Confirmation - ${courseName}`,
      html: `
        <h1>Welcome to ${courseName}!</h1>
        <p>You have successfully enrolled in this course.</p>
        <p>Start learning now!</p>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
};

const sendCertificateEmail = async (userEmail, certificateId) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Congratulations! Your Certificate is Ready',
      html: `
        <h1>Congratulations!</h1>
        <p>You have successfully completed the course.</p>
        <p>Your certificate ID: ${certificateId}</p>
      `
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
};

module.exports = {
  sendEnrollmentEmail,
  sendCertificateEmail
};
