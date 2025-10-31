const { body, validationResult } = require('express-validator');

const validateCourse = [
  body('courseTitle').notEmpty().withMessage('Course title is required'),
  body('courseDescription').notEmpty().withMessage('Course description is required'),
  body('courseCategory').notEmpty().withMessage('Course category is required'),
  body('coursePrice').isNumeric().withMessage('Course price must be a number')
];

const validateQuiz = [
  body('quizTitle').notEmpty().withMessage('Quiz title is required'),
  body('questions').isArray().withMessage('Questions must be an array'),
  body('questions').isLength({ min: 1 }).withMessage('At least one question is required')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateCourse,
  validateQuiz,
  handleValidationErrors
};
