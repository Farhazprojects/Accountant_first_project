const { XeroClient } = require('xero-node');
const { Client } = require('../models');

// Initialize the Xero Client using environment variables
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: ['accounting.contacts', 'offline_access']
});

const XeroService = {
  // Sync a single client to Xero as a Contact
  async syncClientToXero(clientId, activeTenantId) {
    try {
      const clientRecord = await Client.findByPk(clientId);
      
      if (!clientRecord) {
        throw new Error('Client not found in the database.');
      }

      // Format data according to Xero API requirements
      const contactPayload = {
        contacts: [
          {
            name: clientRecord.name,
            emailAddress: clientRecord.email || '',
            phones: clientRecord.phone ? [
              {
                phoneType: 'DEFAULT',
                phoneNumber: clientRecord.phone
              }
            ] : []
          }
        ]
      };

      // Call the Xero API
      const response = await xero.accountingApi.createContacts(
        activeTenantId, 
        contactPayload
      );

      // Extract the Xero-generated ID and save it to our database
      const xeroContactId = response.body.contacts[0].contactID;
      
      clientRecord.xeroContactId = xeroContactId;
      await clientRecord.save();

      return clientRecord;
    } catch (error) {
      console.error('[XeroService.syncClientToXero Error]:', error.message);
      throw error;
    }
  }
};

module.exports = XeroService;