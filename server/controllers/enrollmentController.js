const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const { generateCertificate } = require('../utils/pdfGenerator');

// Create enrollment (after payment)
const createEnrollment = async (req, res) => {
  try {
    const { courseId, paymentId } = req.body;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      paymentId
    });

    // Update course enrollment count
    course.enrolledStudents.push(req.user._id);
    course.totalEnrollments += 1;
    await course.save();

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrollment by ID
const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('courseId')
      .populate('certificateId');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update lecture progress
const updateProgress = async (req, res) => {
  try {
    const { chapterId, lectureId, completed } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Find or create progress entry
    const progressIndex = enrollment.progress.findIndex(
      p => p.chapterId.toString() === chapterId && p.lectureId.toString() === lectureId
    );

    if (progressIndex > -1) {
      enrollment.progress[progressIndex].completed = completed;
      if (completed) {
        enrollment.progress[progressIndex].completedAt = new Date();
      }
    } else {
      enrollment.progress.push({
        chapterId,
        lectureId,
        completed,
        completedAt: completed ? new Date() : null
      });
    }

    // Calculate completion percentage
    const course = await Course.findById(enrollment.courseId);
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      totalLectures += chapter.chapterContent.length;
    });

    const completedLectures = enrollment.progress.filter(p => p.completed).length;
    enrollment.completionPercentage = Math.round((completedLectures / totalLectures) * 100);

    // Check if course is completed
    if (enrollment.completionPercentage === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();

      // Generate certificate
      const certificate = await generateCertificate({
        userId: req.user._id,
        courseId: enrollment.courseId,
        studentName: req.user.name,
        courseName: course.courseTitle,
        instructorName: course.instructorName
      });

      enrollment.certificateIssued = true;
      enrollment.certificateId = certificate._id;
    }

    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course progress
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId
    }).populate('courseId');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
    }

    res.json({ success: true, progress: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEnrollment,
  getEnrollment,
  updateProgress,
  getCourseProgress
};
