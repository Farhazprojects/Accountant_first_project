const { Workflow, Task, User } = require('../models');
// Assuming you have Template and TemplateTask models structurally similar to Workflow/Task
const { Template, TemplateTask } = require('../models');

const WorkflowEngineService = {
  /**
   * Generates a new active workflow for a client based on a predefined template.
   * Satisfies the "Recurring workflow generation engine" requirement.
   */
  async generateWorkflowFromTemplate(clientId, templateId, startDate) {
    try {
      const template = await Template.findByPk(templateId, {
        include: [{ model: TemplateTask, as: 'templateTasks' }]
      });

      if (!template) {
        throw new Error('Template not found.');
      }

      // Create the live workflow instance
      const newWorkflow = await Workflow.create({
        clientId,
        name: template.name,
        status: 'active',
        recurrenceRule: template.recurrenceRule,
        progress: 0
      });

      // Fetch users for auto-assignment logic
      const availableStaff = await User.findAll({ where: { isActive: true } });

      // Generate the tasks
      const generatedTasks = [];
      for (const tTask of template.templateTasks) {
        let assignedUserId = null;

        // Auto-assign logic: Assign to the default user if specified, 
        // otherwise find the first available staff member with a matching role.
        if (tTask.defaultAssigneeId) {
          assignedUserId = tTask.defaultAssigneeId;
        } else if (tTask.targetRole) {
          const matchedUser = availableStaff.find(u => u.role === tTask.targetRole);
          if (matchedUser) {
            assignedUserId = matchedUser.id;
          }
        }

        const newTask = await Task.create({
          workflowId: newWorkflow.id,
          title: tTask.title,
          description: tTask.description,
          order: tTask.order,
          status: 'pending',
          assigneeId: assignedUserId,
          // Simple due date logic: Add the template's offset days to the start date
          dueDate: new Date(new Date(startDate).getTime() + (tTask.daysToComplete * 24 * 60 * 60 * 1000))
        });

        generatedTasks.push(newTask);
      }

      return {
        workflow: newWorkflow,
        tasks: generatedTasks
      };
    } catch (error) {
      console.error('[WorkflowEngineService.generateWorkflow Error]:', error.message);
      throw error;
    }
  }
};

module.exports = WorkflowEngineService;