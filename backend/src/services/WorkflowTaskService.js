const { Task, Workflow, User, AuditLog } = require('../models');
const { Op } = require('sequelize');

const WorkflowTaskService = {
  async getTaskById(taskId) {
    console.log('[WorkflowTaskService]: Fetching task by ID...');
    const task = await Task.findByPk(taskId, {
      include: [
        { association: 'workflow' },
        { association: 'assignee' },
      ],
    });
    return task;
  },

  async getTasksByWorkflow(workflowId) {
    console.log('[WorkflowTaskService]: Fetching tasks for workflow...');
    const tasks = await Task.findAll({
      where: { workflowId },
      order: [['createdAt', 'ASC']],
    });
    return tasks;
  },

  async createTask(taskData, actorId) {
    console.log('[WorkflowTaskService]: Creating new task...');
    const task = await Task.create(taskData);
    await AuditLog.create({
      actorId,
      action: 'CREATE',
      entity: 'Task',
      entityId: task.id,
      metadata: { data: taskData },
    });
    return task;
  },

  async assignTask(taskId, userId, actorId) {
    console.log('[WorkflowTaskService]: Assigning task to user...');
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    await task.update({ assigneeId: userId });
    await AuditLog.create({
      actorId,
      action: 'ASSIGN',
      entity: 'Task',
      entityId: taskId,
      changes: { userId },
    });
    return task;
  },
};

module.exports = WorkflowTaskService;
