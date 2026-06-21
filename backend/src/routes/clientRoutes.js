
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for client management
router.post('/', requireAuth, requireRole(['admin', 'staff']), ClientController.createClient);
router.get('/', requireAuth, requireRole(['admin', 'staff']), ClientController.getAllClients);
router.get('/:id', requireAuth, requireRole(['admin', 'staff']), ClientController.getClientById);
router.put('/:id', requireAuth, requireRole(['admin', 'staff']), ClientController.updateClient);
router.delete('/:id', requireAuth, requireRole(['admin']), ClientController.deleteClient);
router.put('/:id/onboarding-status', requireAuth, requireRole(['admin', 'staff']), ClientController.updateOnboardingStatus);

module.exports = router;
