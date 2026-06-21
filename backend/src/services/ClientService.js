const { Client, AuditLog, Document } = require('../models');

const ClientService = {
  async getClientById(clientId) {
    console.log('[ClientService]: Fetching client by ID...');
    const client = await Client.findByPk(clientId, {
      include: [{ association: 'workflows' }, { association: 'proposals' }],
    });
    return client;
  },

  async getAllClients() {
    console.log('[ClientService]: Fetching all clients...');
    const clients = await Client.findAll({
      order: [['createdAt', 'DESC']],
    });
    return clients;
  },

  async createClient(clientData, actorId) {
    console.log('[ClientService]: Creating new client...');
    const client = await Client.create(clientData);
    await AuditLog.create({
      actorId,
      action: 'CREATE',
      entity: 'Client',
      entityId: client.id,
      metadata: { data: clientData },
    });
    return client;
  },

  async updateClient(clientId, updates, actorId) {
    console.log('[ClientService]: Updating client...');
    const client = await Client.findByPk(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    const oldData = client.toJSON();
    await client.update(updates);
    const changes = { before: oldData, after: client.toJSON() };
    await AuditLog.create({
      actorId,
      action: 'UPDATE',
      entity: 'Client',
      entityId: clientId,
      changes,
    });
    return client;
  },
};

module.exports = ClientService;
