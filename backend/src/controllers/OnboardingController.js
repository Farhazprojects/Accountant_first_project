const { Client } = require('../models');

const OnboardingController = {
  // Auto-save client details during the onboarding wizard
  async autoSaveProgress(req, res, next) {
    try {
      const { clientId } = req.params;
      const { name, email, phone, onboardingStep } = req.body;

      // If no clientId is provided, create a new draft client
      if (clientId === 'new' || !clientId) {
        if (!name) {
          return res.status(400).json({ error: 'Client name is required to start onboarding.' });
        }

        const newClient = await Client.create({
          name,
          email,
          phone,
          onboardingStatus: 'pending'
        });

        return res.status(201).json({ data: { client: newClient, step: onboardingStep || 1 } });
      }

      // Otherwise, update the existing draft
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      // Update fields if they are provided
      if (name) client.name = name;
      if (email !== undefined) client.email = email;
      if (phone !== undefined) client.phone = phone;

      await client.save();

      return res.status(200).json({ 
        data: { 
          message: 'Progress auto-saved successfully.',
          client,
          step: onboardingStep
        } 
      });
    } catch (error) {
      console.error('[OnboardingController.autoSaveProgress Error]:', error.message);
      next(error);
    }
  }
};

module.exports = OnboardingController;