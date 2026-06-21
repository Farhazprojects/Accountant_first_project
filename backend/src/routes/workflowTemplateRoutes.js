
const express = require('express');
const router = express.Router();
const WorkflowTemplateController = require('../controllers/WorkflowTemplateController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin-only routes for workflow template management
router.post('/', requireAuth, requireRole(['admin']), WorkflowTemplateController.createTemplate);
router.get('/', requireAuth, requireRole(['admin', 'staff']), WorkflowTemplateController.getAllTemplates);
router.get('/:id', requireAuth, requireRole(['admin', 'staff']), WorkflowTemplateController.getTemplateById);
router.put('/:id', requireAuth, requireRole(['admin']), WorkflowTemplateController.updateTemplate);
router.delete('/:id', requireAuth, requireRole(['admin']), WorkflowTemplateController.deleteTemplate);

module.exports = router;
