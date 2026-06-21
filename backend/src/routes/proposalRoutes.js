
const express = require('express');
const router = express.Router();
const ProposalController = require('../controllers/ProposalController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Admin and Staff routes for proposal management
router.post('/', requireAuth, requireRole(['admin', 'staff']), ProposalController.createProposal);
router.put('/:id', requireAuth, requireRole(['admin', 'staff']), ProposalController.updateProposal);
router.post('/send', requireAuth, requireRole(['admin', 'staff']), ProposalController.createAndSendProposal);
router.post('/:id/accept', ProposalController.acceptProposal); // Client-facing, no auth required
router.get('/:id', requireAuth, requireRole(['admin', 'staff']), ProposalController.getProposalById); // Assuming getProposalById exists or will be added

module.exports = router;
