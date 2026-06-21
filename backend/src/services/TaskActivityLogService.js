const { TaskActivityLog, Task, User } = require('../models');

const TaskActivityLogService = {
  async logActivity(taskId, userId, activityType, description = '') {
    console.log('[TaskActivityLogService]: Logging task activity...');
    const activityLog = await TaskActivityLog.create({
      taskId,
      userId,
      activityType,
      description,
    });
    return activityLog;
  },

  async getTaskActivityLog(taskId) {
    console.log('[TaskActivityLogService]: Fetching activity log for task...');
    const activities = await TaskActivityLog.findAll({
      where: { taskId },
      include: [
        { association: 'task' },
        { association: 'user' },
      ],
      order: [['timestamp', 'DESC']],
    });
    return activities;
  },

  async logTaskCompleted(taskId, userId) {
    console.log('[TaskActivityLogService]: Logging task completed...');
    return await this.logActivity(taskId, userId, 'completed', 'Task completed');
  },

  async logTaskUpdated(taskId, userId, updateDetails) {
    console.log('[TaskActivityLogService]: Logging task updated...');
    return await this.logActivity(taskId, userId, 'updated', `Task updated: ${updateDetails}`);
  },
};

module.exports = TaskActivityLogService;
