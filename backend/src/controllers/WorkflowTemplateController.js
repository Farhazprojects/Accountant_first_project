
const { WorkflowTemplate, TaskTemplate, User } = require('../models');

const WorkflowTemplateController = {
  async createTemplate(req, res, next) {
    try {
      const { name, description, recurrenceRule, createdBy, taskTemplates } = req.body;

      if (!name || !createdBy) {
        return res.status(400).json({ error: 'Template name and creator are required.' });
      }

      const workflowTemplate = await WorkflowTemplate.create({
        name,
        description,
        recurrenceRule: recurrenceRule || 'none',
        createdBy,
      });

      if (taskTemplates && taskTemplates.length > 0) {
        const templatesWithId = taskTemplates.map(task => ({ ...task, templateId: workflowTemplate.id }));
        await TaskTemplate.bulkCreate(templatesWithId);
      }

      const fullTemplate = await WorkflowTemplate.findByPk(workflowTemplate.id, {
        include: [{ model: TaskTemplate, as: 'taskTemplates' }],
      });

      return res.status(201).json({ data: fullTemplate });
    } catch (error) {
      console.error('[WorkflowTemplateController.createTemplate Error]:', error.message);
      next(error);
    }
  },

  async getAllTemplates(req, res, next) {
    try {
      const templates = await WorkflowTemplate.findAll({
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: TaskTemplate, as: 'taskTemplates', order: [['order', 'ASC']] },
        ],
        order: [['name', 'ASC']],
      });
      return res.status(200).json({ data: templates });
    } catch (error) {
      console.error('[WorkflowTemplateController.getAllTemplates Error]:', error.message);
      next(error);
    }
  },

  async getTemplateById(req, res, next) {
    try {
      const { id } = req.params;
      const template = await WorkflowTemplate.findByPk(id, {
        include: [
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          { model: TaskTemplate, as: 'taskTemplates', order: [['order', 'ASC']] },
        ],
      });

      if (!template) {
        return res.status(404).json({ error: 'Workflow template not found.' });
      }

      return res.status(200).json({ data: template });
    } catch (error) {
      console.error('[WorkflowTemplateController.getTemplateById Error]:', error.message);
      next(error);
    }
  },

  async updateTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, recurrenceRule, taskTemplates } = req.body;

      const workflowTemplate = await WorkflowTemplate.findByPk(id);
      if (!workflowTemplate) {
        return res.status(404).json({ error: 'Workflow template not found.' });
      }

      workflowTemplate.name = name || workflowTemplate.name;
      workflowTemplate.description = description || workflowTemplate.description;
      workflowTemplate.recurrenceRule = recurrenceRule || workflowTemplate.recurrenceRule;
      await workflowTemplate.save();

      // Update or create task templates
      if (taskTemplates) {
        // Delete existing tasks not in the new list
        const existingTaskTemplateIds = workflowTemplate.taskTemplates.map(t => t.id);
        const newTaskTemplateIds = taskTemplates.filter(t => t.id).map(t => t.id);
        const tasksToDelete = existingTaskTemplateIds.filter(id => !newTaskTemplateIds.includes(id));
        if (tasksToDelete.length > 0) {
          await TaskTemplate.destroy({ where: { id: tasksToDelete } });
        }

        // Create or update tasks
        for (const task of taskTemplates) {
          if (task.id) {
            // Update existing task
            await TaskTemplate.update(task, { where: { id: task.id } });
          } else {
            // Create new task
            await TaskTemplate.create({ ...task, templateId: workflowTemplate.id });
          }
        }
      }

      const updatedTemplate = await WorkflowTemplate.findByPk(id, {
        include: [{ model: TaskTemplate, as: 'taskTemplates', order: [['order', 'ASC']] }],
      });

      return res.status(200).json({ data: updatedTemplate });
    } catch (error) {
      console.error('[WorkflowTemplateController.updateTemplate Error]:', error.message);
      next(error);
    }
  },

  async deleteTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const workflowTemplate = await WorkflowTemplate.findByPk(id);

      if (!workflowTemplate) {
        return res.status(404).json({ error: 'Workflow template not found.' });
      }

      await workflowTemplate.destroy();
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error('[WorkflowTemplateController.deleteTemplate Error]:', error.message);
      next(error);
    }
  },
};

module.exports = WorkflowTemplateController;
