const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for task management
router.post('/', requireAuth, requireRole(['admin', 'staff']), TaskController.createTask);
router.get('/workflow/:workflowId', requireAuth, requireRole(['admin', 'staff']), TaskController.getTasksByWorkflow);
router.get('/:id', requireAuth, requireRole(['admin', 'staff']), TaskController.getTaskById);
router.put('/:id', requireAuth, requireRole(['admin', 'staff']), TaskController.updateTask);
router.delete('/:id', requireAuth, requireRole(['admin']), TaskController.deleteTask);
router.put('/:id/assign', requireAuth, requireRole(['admin', 'staff']), TaskController.assignTask);
router.put('/reorder', requireAuth, requireRole(['admin', 'staff']), TaskController.updateTaskOrder);

module.exports = router;