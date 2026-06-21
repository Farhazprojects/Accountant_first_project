const { Workflow, Task, Client, AuditLog } = require('../models');

const WorkflowService = {
  async getWorkflowById(workflowId) {
    console.log('[WorkflowService]: Fetching workflow by ID...');
    const workflow = await Workflow.findByPk(workflowId, {
      include: [
        { association: 'client' },
        { association: 'tasks' },
      ],
    });
    return workflow;
  },

  async getWorkflowsByClient(clientId) {
    console.log('[WorkflowService]: Fetching workflows for client...');
    const workflows = await Workflow.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']],
    });
    return workflows;
  },

  async createWorkflow(workflowData, actorId) {
    console.log('[WorkflowService]: Creating new workflow...');
    const workflow = await Workflow.create(workflowData);
    await AuditLog.create({
      actorId,
      action: 'CREATE',
      entity: 'Workflow',
      entityId: workflow.id,
      metadata: { data: workflowData },
    });
    return workflow;
  },

  async updateWorkflowStatus(workflowId, newStatus, actorId) {
    console.log('[WorkflowService]: Updating workflow status...');
    const workflow = await Workflow.findByPk(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    const oldStatus = workflow.status;
    await workflow.update({ status: newStatus });
    await AuditLog.create({
      actorId,
      action: 'UPDATE_STATUS',
      entity: 'Workflow',
      entityId: workflowId,
      changes: { before: oldStatus, after: newStatus },
    });
    return workflow;
  },
};

module.exports = WorkflowService;
