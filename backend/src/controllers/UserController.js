
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const EmailService = require('../services/EmailService');

const UserController = {
  async inviteUser(req, res, next) {
    try {
      const { firstName, lastName, email, role = 'staff' } = req.body;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'firstName, lastName, and email are required.' });
      }

      if (!['admin', 'staff'].includes(role)) {
        return res.status(400).json({ error: 'role must be admin or staff.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      const tempPassword = crypto.randomBytes(12).toString('base64url');
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const invitedUser = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        role,
        isActive: false,
      });

      const inviteToken = jwt.sign(
        {
          type: 'staff_invite',
          userId: invitedUser.id,
          email: invitedUser.email,
          role: invitedUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const appUrl = process.env.REACT_APP_URL || 'http://localhost:3000';
      const inviteUrl = `${appUrl}/accept-invite?token=${inviteToken}`;
      await EmailService.sendEmail({
        to: email,
        subject: 'You have been invited to Accountant First',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${firstName},</h2>
            <p>You have been invited as <strong>${role}</strong> to Accountant First.</p>
            <p>Use the temporary password below to sign in after accepting the invitation.</p>
            <p><strong>Temporary password:</strong> ${tempPassword}</p>
            <p>
              <a href="${inviteUrl}" style="background:#0f172a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
                Accept Invitation
              </a>
            </p>
          </div>
        `,
      });

      return res.status(201).json({
        data: {
          message: 'Staff invitation sent successfully.',
          user: {
            id: invitedUser.id,
            firstName: invitedUser.firstName,
            lastName: invitedUser.lastName,
            email: invitedUser.email,
            role: invitedUser.role,
            isActive: invitedUser.isActive,
          },
        },
      });
    } catch (error) {
      console.error('[UserController.inviteUser Error]:', error.message);
      next(error);
    }
  },

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
