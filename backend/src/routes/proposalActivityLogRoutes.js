
const express = require('express');
const router = express.Router();
const ProposalActivityLogController = require('../controllers/ProposalActivityLogController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for proposal activity logs
router.post('/', requireAuth, requireRole(['admin', 'staff']), ProposalActivityLogController.createLog);
router.get('/proposal/:proposalId', requireAuth, requireRole(['admin', 'staff']), ProposalActivityLogController.getLogsForProposal);

module.exports = router;
