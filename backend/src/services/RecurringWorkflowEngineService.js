
const { Workflow, WorkflowTemplate, Task, TaskTemplate, Client } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const RecurringWorkflowEngineService = {
  async generateRecurringWorkflows() {
    console.log('[RecurringWorkflowEngineService]: Starting recurring workflow generation...');
    const today = moment().startOf('day');

    // Find all active workflow templates with recurrence rules
    const recurringTemplates = await WorkflowTemplate.findAll({
      where: {
        recurrenceRule: { [Op.ne]: 'none' },
      },
      include: [{ model: TaskTemplate, as: 'taskTemplates' }],
    });

    for (const template of recurringTemplates) {
      // For simplicity, we'll assume workflows are linked to clients. 
      // In a real system, you'd have logic to determine which clients get which recurring workflows.
      // For now, let's assume all clients get all recurring workflows.
      const clients = await Client.findAll(); 

      for (const client of clients) {
        // Check if a workflow based on this template for this client has already been created for the current period
        const existingWorkflow = await Workflow.findOne({
          where: {
            name: { [Op.like]: `%${template.name}%` }, // Basic check, could be improved with a templateId on Workflow model
            clientId: client.id,
            createdAt: { [Op.gte]: today.startOf(template.recurrenceRule === 'monthly' ? 'month' : template.recurrenceRule === 'quarterly' ? 'quarter' : 'year') }
          },
        });

        if (!existingWorkflow) {
          console.log(`[RecurringWorkflowEngineService]: Generating new workflow for client ${client.name} from template ${template.name}`);
          const newWorkflow = await Workflow.create({
            name: `${template.name} - ${client.name} - ${moment().format('YYYY-MM')}`,
            clientId: client.id,
            status: 'active',
            recurrenceRule: template.recurrenceRule,
            progress: 0,
          });

          for (const taskTemplate of template.taskTemplates) {
            await Task.create({
              workflowId: newWorkflow.id,
              title: taskTemplate.title,
              description: taskTemplate.description,
              order: taskTemplate.order,
              // Calculate due date based on workflow creation date and task template duration
              dueDate: taskTemplate.durationDays ? moment(newWorkflow.createdAt).add(taskTemplate.durationDays, 'days').toDate() : null,
              status: 'pending',
            });
          }
        }
      }
    }
    console.log('[RecurringWorkflowEngineService]: Recurring workflow generation completed.');
  },
};

module.exports = RecurringWorkflowEngineService;
