const { Client } = require('../models');

const ClientController = {
  async createClient(req, res, next) {
    try {
      const { name, email, phone, xeroContactId, onboardingStatus } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Client name is required.' });
      }

      const client = await Client.create({
        name,
        email,
        phone,
        xeroContactId,
        onboardingStatus,
      });

      return res.status(201).json({ data: client });
    } catch (error) {
      console.error('[ClientController.createClient Error]:', error.message);
      next(error);
    }
  },

  async getAllClients(req, res, next) {
    try {
      const clients = await Client.findAll();
      return res.status(200).json({ data: clients });
    } catch (error) {
      console.error('[ClientController.getAllClients Error]:', error.message);
      next(error);
    }
  },

  async getClientById(req, res, next) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      return res.status(200).json({ data: client });
    } catch (error) {
      console.error('[ClientController.getClientById Error]:', error.message);
      next(error);
    }
  },

  async updateClient(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, phone, xeroContactId, onboardingStatus } = req.body;

      const client = await Client.findByPk(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      client.name = name || client.name;
      client.email = email || client.email;
      client.phone = phone || client.phone;
      client.xeroContactId = xeroContactId || client.xeroContactId;
      client.onboardingStatus = onboardingStatus || client.onboardingStatus;

      await client.save();

      return res.status(200).json({ data: client });
    } catch (error) {
      console.error('[ClientController.updateClient Error]:', error.message);
      next(error);
    }
  },

  async deleteClient(req, res, next) {
    try {
      const { id } = req.params;
      const client = await Client.findByPk(id);

      if (!client) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      await client.destroy();
      return res.status(204).send(); // No Content
    } catch (error) {
      console.error('[ClientController.deleteClient Error]:', error.message);
      next(error);
    }
  },

  async updateOnboardingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { onboardingStatus } = req.body;

      const client = await Client.findByPk(id);
      if (!client) {
        return res.status(404).json({ error: 'Client not found.' });
      }

      client.onboardingStatus = onboardingStatus;
      await client.save();

      return res.status(200).json({ data: client });
    } catch (error) {
      console.error('[ClientController.updateOnboardingStatus Error]:', error.message);
      next(error);
    }
  },
};

module.exports = ClientController;