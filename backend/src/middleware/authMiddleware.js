const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;


  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }


  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error('Account is deactivated');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * Admin role authorization
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('User role not authorized to access this route');
    }

    next();
  };
};

/**
 * Check resource ownership
 */
const checkOwnership = (resourceUserIdField = 'userId') => {
  return asyncHandler(async (req, res, next) => {
    const resource = req.resource; // Should be set by previous middleware

    if (!resource) {
      res.status(404);
      throw new Error('Resource not found');
    }

    // Admin can access all resources
    if (req.user.role === 'admin') {
      return next();
    }


    const resourceUserId = resource[resourceUserIdField];
    if (!resourceUserId || resourceUserId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this resource');
    }

    next();
  });
};

module.exports = {
  protect,
  authorize,
  checkOwnership
};
