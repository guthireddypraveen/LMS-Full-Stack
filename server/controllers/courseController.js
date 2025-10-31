const Course = require('../models/Course');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profileImage bio')
      .populate('quizzes');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search courses
const searchCourses = async (req, res) => {
  try {
    const { query, category, level } = req.query;
    let filter = { isPublished: true };

    if (query) {
      filter.$or = [
        { courseTitle: { $regex: query, $options: 'i' } },
        { courseDescription: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) filter.courseCategory = category;
    if (level) filter.courseLevel = level;

    const courses = await Course.find(filter)
      .populate('instructor', 'name profileImage');

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create course (Educator)
const createCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      courseCategory,
      courseLevel,
      coursePrice,
      instructorBio
    } = req.body;

    let courseThumbnail = '';

    // Upload thumbnail to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'lms/thumbnails' },
        (error, result) => {
          if (error) throw error;
          return result.secure_url;
        }
      );
      courseThumbnail = result;
    }

    const course = await Course.create({
      courseTitle,
      courseDescription,
      courseCategory,
      courseLevel,
      coursePrice,
      courseThumbnail,
      instructor: req.user._id,
      instructorName: req.user.name,
      instructorBio,
      instructorImage: req.user.profileImage
    });

    // Add to user's created courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add chapter to course
const addChapter = async (req, res) => {
  try {
    const { chapterTitle, chapterDescription, chapterOrder } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.courseContent.push({
      chapterTitle,
      chapterDescription,
      chapterOrder,
      chapterContent: []
    });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add lecture to chapter
const addLecture = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { lectureTitle, lectureType, lectureContent, lectureDuration, lectureOrder } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const chapter = course.courseContent.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    // Upload video/document to Cloudinary if provided
    let uploadedContent = lectureContent;
    if (req.file && (lectureType === 'video' || lectureType === 'document')) {
      const resourceType = lectureType === 'video' ? 'video' : 'raw';
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `lms/courses/${course._id}`,
        resource_type: resourceType
      });
      uploadedContent = result.secure_url;
    }

    chapter.chapterContent.push({
      lectureTitle,
      lectureType,
      lectureContent: uploadedContent,
      lectureDuration,
      lectureOrder
    });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get instructor courses
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add course rating
const addCourseRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already rated
    const existingRating = course.courseRatings.find(
      r => r.userId.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      course.courseRatings.push({
        userId: req.user._id,
        rating,
        review
      });
    }

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  searchCourses,
  createCourse,
  updateCourse,
  addChapter,
  addLecture,
  getInstructorCourses,
  deleteCourse,
  addCourseRating
};
