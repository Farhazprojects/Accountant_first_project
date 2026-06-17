const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Route for getting tasks by workflow ID
router.get('/workflow/:workflowId', TaskController.getTasksByWorkflow);

// Route for creating a new task
router.post('/', TaskController.createTask);

// Route specifically for drag-and-drop order persistence
router.put('/reorder', TaskController.updateTaskOrder);

module.exports = router;