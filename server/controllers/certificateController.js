const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate certificate
const generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('courseId')
      .populate('userId');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course not completed yet' 
      });
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const certificate = await Certificate.create({
      userId: enrollment.userId._id,
      courseId: enrollment.courseId._id,
      certificateId,
      studentName: enrollment.userId.name,
      courseName: enrollment.courseId.courseTitle,
      instructorName: enrollment.courseId.instructorName,
      completionDate: enrollment.completedAt
    });

    // Update enrollment
    enrollment.certificateIssued = true;
    enrollment.certificateId = certificate._id;
    await enrollment.save();

    res.json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get certificate by ID
const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('courseId', 'courseTitle instructor');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify certificate
const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('userId', 'name')
      .populate('courseId', 'courseTitle');

    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found or invalid'
      });
    }

    res.json({ 
      success: true, 
      verified: certificate.verified,
      certificate: {
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        certificateId: certificate.certificateId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download certificate PDF
const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate.certificateId}.pdf`);

    doc.pipe(res);

    // Design certificate
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

    doc.fontSize(40).text('Certificate of Completion', 100, 100, { align: 'center' });
    doc.fontSize(20).text('This is to certify that', 100, 180, { align: 'center' });
    doc.fontSize(30).text(certificate.studentName, 100, 220, { align: 'center' });
    doc.fontSize(20).text('has successfully completed', 100, 280, { align: 'center' });
    doc.fontSize(25).text(certificate.courseName, 100, 320, { align: 'center' });

    const issueDate = new Date(certificate.issueDate).toLocaleDateString();
    doc.fontSize(15).text(`Issue Date: ${issueDate}`, 100, 400, { align: 'center' });
    doc.fontSize(12).text(`Certificate ID: ${certificate.certificateId}`, 100, 430, { align: 'center' });

    if (certificate.instructorName) {
      doc.fontSize(15).text(certificate.instructorName, 100, 480, { align: 'center' });
      doc.fontSize(12).text('Instructor', 100, 500, { align: 'center' });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user certificates
const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate('courseId', 'courseTitle courseThumbnail')
      .sort({ issueDate: -1 });

    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  downloadCertificate,
  getUserCertificates
};
