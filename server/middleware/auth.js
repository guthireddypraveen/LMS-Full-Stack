const { requireAuth } = require('@clerk/express');

// Clerk authentication middleware
const authenticateUser = requireAuth();

// Extract user from Clerk
const getUserFromClerk = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const User = require('../models/User');
    let user = await User.findOne({ clerkUserId: req.auth.userId });

    // Create user if doesn't exist
    if (!user) {
      const clerkUser = await req.auth.getUser();
      user = await User.create({
        clerkUserId: req.auth.userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        profileImage: clerkUser.imageUrl,
        role: clerkUser.publicMetadata?.role || 'student'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { authenticateUser, getUserFromClerk };
