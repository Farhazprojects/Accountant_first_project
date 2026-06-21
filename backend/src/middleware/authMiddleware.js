const jwt = require('jsonwebtoken');

// 1. Verify the JWT and inject the user context into the request
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// 2. Role-Based Access Control (RBAC) Factory
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'User role not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. You do not have permission to perform this action.' 
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};