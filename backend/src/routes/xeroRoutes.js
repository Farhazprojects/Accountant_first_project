
const express = require('express');
const router = express.Router();
const XeroController = require('../controllers/XeroController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Route for syncing a client with Xero (Admin/Staff only)
router.post('/client/:clientId/sync', 
  requireAuth, 
  requireRole(['admin', 'staff']),
  XeroController.syncClient
);

// TODO: Add routes for Xero OAuth2 callback and token management

module.exports = router;
