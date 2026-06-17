const { Task } = require('../models');

const TaskController = {
  // Get all tasks for a workflow, sorted by order
  async getTasksByWorkflow(req, res, next) {
    try {
      const { workflowId } = req.params;
      
      if (!workflowId) {
        return res.status(400).json({ error: 'workflowId is required' });
      }

      const tasks = await Task.findAll({
        where: { workflowId },
        order: [['order', 'ASC']],
      });

      return res.status(200).json({ data: tasks });
    } catch (error) {
      console.error('[TaskController.getTasksByWorkflow Error]:', error.message);
      next(error);
    }
  },

  // Create a new task
  async createTask(req, res, next) {
    try {
      const { title, description, workflowId, assigneeId, dueDate } = req.body;

      if (!title || !workflowId) {
        return res.status(400).json({ error: 'Title and workflowId are required' });
      }

      // Find the highest order to append to the bottom of the list
      const maxOrderTask = await Task.findOne({
        where: { workflowId },
        order: [['order', 'DESC']],
      });
      const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

      const newTask = await Task.create({
        title,
        description,
        workflowId,
        assigneeId,
        dueDate,
        order: newOrder,
        status: 'pending'
      });

      return res.status(201).json({ data: newTask });
    } catch (error) {
      console.error('[TaskController.createTask Error]:', error.message);
      next(error);
    }
  },

  // Update task ordering (Required for Drag & Drop persistence)
  async updateTaskOrder(req, res, next) {
    try {
      const { tasks } = req.body; 

      // Expecting an array of objects: [{ id: 'uuid-1', order: 0 }, { id: 'uuid-2', order: 1 }]
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'An array of tasks with id and new order is required' });
      }

      // Update all tasks concurrently
      await Promise.all(
        tasks.map(async (taskUpdate) => {
          await Task.update(
            { order: taskUpdate.order },
            { where: { id: taskUpdate.id } }
          );
        })
      );

      return res.status(200).json({ data: { message: 'Task order updated successfully' } });
    } catch (error) {
      console.error('[TaskController.updateTaskOrder Error]:', error.message);
      next(error);
    }
  }
};

module.exports = TaskController;