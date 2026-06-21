
const express = require('express');
const router = express.Router();
const TaskActivityLogController = require('../controllers/TaskActivityLogController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for task activity logs
router.post('/', requireAuth, requireRole(['admin', 'staff']), TaskActivityLogController.createLog);
router.get('/task/:taskId', requireAuth, requireRole(['admin', 'staff']), TaskActivityLogController.getLogsForTask);

module.exports = router;
