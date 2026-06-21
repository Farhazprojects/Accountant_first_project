const { WorkflowTemplate, TaskTemplate, User, AuditLog } = require('../models');

const WorkflowTemplateService = {
  async getTemplateById(templateId) {
    console.log('[WorkflowTemplateService]: Fetching workflow template by ID...');
    const template = await WorkflowTemplate.findByPk(templateId, {
      include: [
        { association: 'taskTemplates' },
        { association: 'creator' },
      ],
    });
    return template;
  },

  async getAllTemplates() {
    console.log('[WorkflowTemplateService]: Fetching all workflow templates...');
    const templates = await WorkflowTemplate.findAll({
      order: [['createdAt', 'DESC']],
    });
    return templates;
  },

  async createTemplate(templateData, createdBy) {
    console.log('[WorkflowTemplateService]: Creating new workflow template...');
    const template = await WorkflowTemplate.create({
      ...templateData,
      createdBy,
    });
    await AuditLog.create({
      actorId: createdBy,
      action: 'CREATE',
      entity: 'WorkflowTemplate',
      entityId: template.id,
      metadata: { data: templateData },
    });
    return template;
  },

  async updateTemplate(templateId, updates, actorId) {
    console.log('[WorkflowTemplateService]: Updating workflow template...');
    const template = await WorkflowTemplate.findByPk(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    await template.update(updates);
    await AuditLog.create({
      actorId,
      action: 'UPDATE',
      entity: 'WorkflowTemplate',
      entityId: templateId,
      changes: { before: template.toJSON(), after: template.toJSON() },
    });
    return template;
  },
};

module.exports = WorkflowTemplateService;
