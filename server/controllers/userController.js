const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// Get user data
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses')
      .populate('certificates');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const enrolledCourses = await Enrollment.find({ userId: req.user._id })
      .populate('courseId')
      .populate('certificateId')
      .sort({ enrollmentDate: -1 });

    res.json({ success: true, enrolledCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserData,
  getEnrolledCourses,
  updateProfile
};
