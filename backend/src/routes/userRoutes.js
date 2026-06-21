
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin-only routes for user management
router.post('/invite', requireAuth, requireRole(['admin']), UserController.inviteUser);
router.post('/', requireAuth, requireRole(['admin']), UserController.createUser);
router.get('/', requireAuth, requireRole(['admin']), UserController.getAllUsers);
router.get('/:id', requireAuth, requireRole(['admin']), UserController.getUserById);
router.put('/:id', requireAuth, requireRole(['admin']), UserController.updateUser);
router.delete('/:id', requireAuth, requireRole(['admin']), UserController.deleteUser);

module.exports = router;
