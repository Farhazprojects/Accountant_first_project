
const express = require('express');
const router = express.Router();
const WorkflowController = require('../controllers/WorkflowController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for workflow management
router.post('/', requireAuth, requireRole(['admin', 'staff']), WorkflowController.createWorkflow);
router.get('/', requireAuth, requireRole(['admin', 'staff']), WorkflowController.getAllWorkflows);
router.get('/:id', requireAuth, requireRole(['admin', 'staff']), WorkflowController.getWorkflowById);
router.put('/:id', requireAuth, requireRole(['admin', 'staff']), WorkflowController.updateWorkflow);
router.delete('/:id', requireAuth, requireRole(['admin']), WorkflowController.deleteWorkflow);
router.put('/task/:taskId/status', requireAuth, requireRole(['admin', 'staff']), WorkflowController.updateTaskStatus);

module.exports = router;
