const { User, AuditLog } = require('../models');

const UserService = {
  async getUserById(userId) {
    console.log('[UserService]: Fetching user by ID...');
    const user = await User.findByPk(userId);
    return user;
  },

  async getAllUsers(filters = {}) {
    console.log('[UserService]: Fetching all users...');
    const users = await User.findAll({
      where: filters,
      order: [['createdAt', 'DESC']],
    });
    return users;
  },

  async updateUser(userId, updates) {
    console.log('[UserService]: Updating user...');
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const oldData = user.toJSON();
    await user.update(updates);
    const changes = { before: oldData, after: user.toJSON() };
    await AuditLog.create({
      actorId: userId,
      action: 'UPDATE',
      entity: 'User',
      entityId: userId,
      changes,
    });
    return user;
  },

  async deactivateUser(userId, actorId) {
    console.log('[UserService]: Deactivating user...');
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update({ isActive: false });
    await AuditLog.create({
      actorId,
      action: 'DEACTIVATE',
      entity: 'User',
      entityId: userId,
    });
    return user;
  },
};

module.exports = UserService;
