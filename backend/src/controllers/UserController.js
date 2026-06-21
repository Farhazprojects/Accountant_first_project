
const { User } = require('../models');
const bcrypt = require('bcrypt');

const UserController = {
  async createUser(req, res, next) {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        role,
      });

      return res.status(201).json({ data: user });
    } catch (error) {
      console.error('[UserController.createUser Error]:', error.message);
      next(error);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
      });
      return res.status(200).json({ data: users });
    } catch (error) {
      console.error('[UserController.getAllUsers Error]:', error.message);
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({ data: user });
    } catch (error) {
      console.error('[UserController.getUserById Error]:', error.message);
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role, isActive } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.role = role || user.role;
      user.isActive = typeof isActive === 'boolean' ? isActive : user.isActive;

      await user.save();

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] },
      });

      return res.status(200).json({ data: updatedUser });
    } catch (error) {
      console.error('[UserController.updateUser Error]:', error.message);
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      await user.destroy();
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error('[UserController.deleteUser Error]:', error.message);
      next(error);
    }
  },
};

module.exports = UserController;
