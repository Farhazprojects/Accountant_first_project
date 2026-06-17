const { Workflow, Task } = require('../models');

const WorkflowController = {
  // Update task status and auto-calculate workflow progress
  async updateTaskStatus(req, res, next) {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value provided.' });
      }

      // 1. Find and update the task
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      task.status = status;
      await task.save();

      // 2. Fetch all tasks for the parent workflow to recalculate progress
      const workflowTasks = await Task.findAll({
        where: { workflowId: task.workflowId }
      });

      const totalTasks = workflowTasks.length;
      const completedTasks = workflowTasks.filter(t => t.status === 'completed').length;
      
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      // 3. Update the workflow progress
      const workflow = await Workflow.findByPk(task.workflowId);
      workflow.progress = progress;
      
      // Auto-complete workflow if 100%
      if (progress === 100) {
        workflow.status = 'completed';
      } else if (workflow.status === 'completed' && progress < 100) {
        workflow.status = 'active'; // Re-open if a task was marked incomplete
      }
      
      await workflow.save();

      return res.status(200).json({ 
        data: { 
          message: 'Task and workflow progress updated successfully.',
          task,
          workflowProgress: progress
        } 
      });
    } catch (error) {
      console.error('[WorkflowController.updateTaskStatus Error]:', error.message);
      next(error);
    }
  }
};

module.exports = WorkflowController;