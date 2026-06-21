const { Firm } = require('../models');
const StripeService = require('../services/StripeService');

function getDefaultFirmName(userEmail) {
  const localPart = (userEmail || '').split('@')[0] || 'Accountant First';
  return `${localPart} Firm`;
}

const BillingController = {
  async getStatus(req, res, next) {
    try {
      const firmEmail = req.user.email;
      let firm = await Firm.findOne({ where: { email: firmEmail } });

      if (!firm) {
        firm = await Firm.create({
          name: getDefaultFirmName(firmEmail),
          email: firmEmail,
          subscriptionStatus: 'inactive',
        });
      }

      return res.status(200).json({
        data: {
          status: firm.subscriptionStatus || 'inactive',
          plan: firm.stripePriceId || 'None',
        },
      });
    } catch (error) {
      console.error('[BillingController.getStatus Error]:', error.message);
      next(error);
    }
  },

  async createCheckout(req, res, next) {
    try {
      const appUrl = process.env.APP_URL || process.env.REACT_APP_URL || 'http://localhost';

      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(200).json({
          data: {
            checkoutUrl: `${appUrl}/billing?billing_setup_required=true`,
          },
          meta: {
            warning: 'Stripe is not configured. Configure STRIPE_SECRET_KEY to enable live checkout.',
          },
        });
      }

      const requestedPriceId = req.body?.priceId;
      const defaultPriceId = process.env.STRIPE_PRICE_GROWTH;
      const priceId = requestedPriceId || defaultPriceId;

      if (!priceId) {
        return res.status(400).json({ error: 'Missing priceId. Configure STRIPE_PRICE_GROWTH or pass priceId.' });
      }

      const firmEmail = req.user.email;
      let firm = await Firm.findOne({ where: { email: firmEmail } });
      if (!firm) {
        firm = await Firm.create({
          name: getDefaultFirmName(firmEmail),
          email: firmEmail,
          subscriptionStatus: 'inactive',
        });
      }

      if (!firm.stripeCustomerId) {
        const stripeCustomerId = await StripeService.createCustomer(firm.email, firm.name);
        firm.stripeCustomerId = stripeCustomerId;
        await firm.save();
      }

      const checkoutUrl = await StripeService.createCheckoutSession(firm.stripeCustomerId, priceId, appUrl);

      firm.stripePriceId = priceId;
      await firm.save();

      return res.status(200).json({ data: { checkoutUrl } });
    } catch (error) {
      console.error('[BillingController.createCheckout Error]:', error.message);
      next(error);
    }
  },

  async openPortal(req, res, next) {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' });
      }

      const firm = await Firm.findOne({ where: { email: req.user.email } });
      if (!firm || !firm.stripeCustomerId) {
        return res.status(400).json({ error: 'No Stripe customer found for this account.' });
      }

      const appUrl = process.env.APP_URL || process.env.REACT_APP_URL || 'http://localhost';
      const portalUrl = await StripeService.createBillingPortalSession(firm.stripeCustomerId, appUrl);

      return res.status(200).json({ data: { portalUrl } });
    } catch (error) {
      console.error('[BillingController.openPortal Error]:', error.message);
      next(error);
    }
  },
};

module.exports = BillingController;
