
const { TaskActivityLog, User, Task } = require('../models');

const TaskActivityLogController = {
  async createLog(req, res, next) {
    try {
      const { taskId, userId, activityType, description } = req.body;

      if (!taskId || !activityType) {
        return res.status(400).json({ error: 'Task ID and activity type are required.' });
      }

      const log = await TaskActivityLog.create({
        taskId,
        userId,
        activityType,
        description,
      });

      return res.status(201).json({ data: log });
    } catch (error) {
      console.error('[TaskActivityLogController.createLog Error]:', error.message);
      next(error);
    }
  },

  async getLogsForTask(req, res, next) {
    try {
      const { taskId } = req.params;

      const logs = await TaskActivityLog.findAll({
        where: { taskId },
        include: [
          { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Task, as: 'task', attributes: ['id', 'title'] }
        ],
        order: [['timestamp', 'DESC']],
      });

      return res.status(200).json({ data: logs });
    } catch (error) {
      console.error('[TaskActivityLogController.getLogsForTask Error]:', error.message);
      next(error);
    }
  },
};

module.exports = TaskActivityLogController;
