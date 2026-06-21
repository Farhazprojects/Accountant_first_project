const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      // Find user by email
      const user = await User.findOne({ where: { email, isActive: true } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials or inactive account.' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate JWT (Expires in 8 hours for standard workdays)
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'Server authentication is not configured.' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          role: user.role, 
          email: user.email 
        },
        jwtSecret,
        { expiresIn: '8h' }
      );

      return res.status(200).json({
        data: {
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('[AuthController.login Error]:', error.message);
      next(error);
    }
  }
};

module.exports = AuthController;