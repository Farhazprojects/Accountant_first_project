const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const StripeService = {
  /**
   * Creates a Stripe customer profile when a new firm signs up
   */
  async createCustomer(email, name) {
    try {
      const customer = await stripe.customers.create({ email, name });
      return customer.id;
    } catch (error) {
      console.error('[StripeService.createCustomer Error]:', error.message);
      throw error;
    }
  },

  /**
   * Generates a Hosted Checkout Session URL for a subscription tier
   */
  async createCheckoutSession(stripeCustomerId, priceId, returnUrl) {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${returnUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}/billing`,
      });
      return session.url;
    } catch (error) {
      console.error('[StripeService.createCheckoutSession Error]:', error.message);
      throw error;
    }
  },

  /**
   * Generates a link to the Stripe Customer Portal where clients 
   * can update cards, view invoices, or cancel their plans.
   */
  async createBillingPortalSession(stripeCustomerId, returnUrl) {
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${returnUrl}/billing`,
      });
      return portalSession.url;
    } catch (error) {
      console.error('[StripeService.createPortal Error]:', error.message);
      throw error;
    }
  }
};

module.exports = StripeService;