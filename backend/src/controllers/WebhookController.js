const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Firm } = require('../models'); // Assuming a Firm model tracks standard plan metrics

const WebhookController = {
  async handleIncomingWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Reconstruct the event using the raw buffer to guarantee validity
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`❌ Webhook Signature Verification Failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Process asynchronous lifecycle events
    try {
      switch (event.type) {
        case 'customer.subscription.created':
const subscription = event.data.object;
          await Firm.update(
            { subscriptionStatus: 'active', stripePriceId: subscription.plan.id },
            { where: { stripeCustomerId: subscription.customer } }
          );
          console.log(`[Stripe Webhook]: Subscription created for customer ${subscription.customer}`);
          break;

        case 'invoice.payment_succeeded':
          // Keep account in active standing on recurring renewal success
          const invoice = event.data.object;
          await Firm.update(
            { subscriptionStatus: 'active' },
            { where: { stripeCustomerId: invoice.customer } }
          );
          break;

        case 'invoice.payment_failed':
          // Gracefully downgrade or flag accounts when cards fail
          const failedInvoice = event.data.object;
          await Firm.update(
            { subscriptionStatus: 'past_due' },
            { where: { stripeCustomerId: failedInvoice.customer } }
          );
          console.warn(`[Stripe Webhook]: Payment FAILED for customer ${failedInvoice.customer}`);
          break;

        case 'customer.subscription.deleted':
          // Cut off access if plan is outright canceled
          const canceledSub = event.data.object;
          await Firm.update(
            { subscriptionStatus: 'canceled', stripePriceId: null },
            { where: { stripeCustomerId: canceledSub.customer } }
          );
          break;

        default:
          console.log(`[Stripe Webhook]: Unhandled event type ${event.type}`);
      }

      // Return a 200 response to Stripe acknowledge receipt
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('[Webhook Processing Error]:', error.message);
      return res.status(500).json({ error: 'Webhook processing collapsed internal routing.' });
    }
  }
};

module.exports = WebhookController;