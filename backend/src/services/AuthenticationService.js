const { User, AuditLog } = require('../models');
const bcrypt = require('bcryptjs');

const AuthenticationService = {
  async authenticateUser(email, password) {
    console.log('[AuthenticationService]: Authenticating user...');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return user;
  },

  async createUser(firstName, lastName, email, password, role = 'staff') {
    console.log('[AuthenticationService]: Creating new user...');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
    });
    return user;
  },

  async updatePassword(userId, newPassword) {
    console.log('[AuthenticationService]: Updating user password...');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update({ passwordHash });
    return user;
  },

  async logAuthenticationAction(userId, action, metadata = {}) {
    console.log(`[AuthenticationService]: Logging ${action} action for user ${userId}`);
    await AuditLog.create({
      actorId: userId,
      action,
      entity: 'User',
      entityId: userId,
      metadata,
    });
  },
};

module.exports = AuthenticationService;
