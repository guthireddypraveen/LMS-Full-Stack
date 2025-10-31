const authorizeEducator = (req, res, next) => {
  if (req.user.role !== 'educator' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Educator privileges required.' 
    });
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

module.exports = { authorizeEducator, authorizeAdmin };
