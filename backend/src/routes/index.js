const express = require('express');
const router = express.Router();
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');
const clientRoutes = require('./clientRoutes');
const proposalRoutes = require('./proposalRoutes');
const proposalActivityLogRoutes = require('./proposalActivityLogRoutes');
const workflowRoutes = require('./workflowRoutes');
const workflowTemplateRoutes = require('./workflowTemplateRoutes');
const taskActivityLogRoutes = require('./taskActivityLogRoutes');
const documentRoutes = require('./documentRoutes');
const xeroRoutes = require('./xeroRoutes');

const AuthController = require('../controllers/AuthController');
const OnboardingController = require('../controllers/OnboardingController');
const ProposalController = require('../controllers/ProposalController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API routes are connected and responding.' });
});

// Authentication
router.post('/auth/login', AuthController.login);
router.get('/auth/me', requireAuth, (req, res) => {
  res.json({ 
    data: { 
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.role === 'admin'
      } 
    } 
  });
});

// Primary Entities
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/proposals', proposalRoutes);
router.use('/proposal-activity-logs', proposalActivityLogRoutes);
router.use('/workflows', workflowRoutes);
router.use('/workflow-templates', workflowTemplateRoutes);
router.use('/tasks', taskRoutes);
router.use('/task-activity-logs', taskActivityLogRoutes);
router.use('/documents', documentRoutes);
router.use('/xero', xeroRoutes);

// Onboarding
router.post('/onboarding/clients', requireAuth, OnboardingController.autoSaveProgress);
router.put('/onboarding/:clientId', requireAuth, OnboardingController.autoSaveProgress);

// Billing (Integration with StripeService via BillingController)
router.get('/billing/status', requireAuth, (req, res) => {
  // TODO: Implement BillingController.getStatus
  res.status(501).json({ error: 'Billing status service not yet implemented.' });
});

router.post('/billing/checkout', requireAuth, (req, res) => {
  // TODO: Implement BillingController.createCheckout
  res.status(501).json({ error: 'Checkout service not yet implemented.' });
});

router.post('/billing/portal', requireAuth, (req, res) => {
  // TODO: Implement BillingController.openPortal
  res.status(501).json({ error: 'Billing portal service not yet implemented.' });
});

module.exports = router;
