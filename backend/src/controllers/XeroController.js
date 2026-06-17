const XeroService = require('../services/XeroService');

const XeroController = {
  async syncClient(req, res, next) {
    try {
      const { clientId } = req.params;
      
      // In a real scenario, the activeTenantId comes from the authenticated user's session
      // after they have connected their Xero account via OAuth2.
      const activeTenantId = req.headers['x-xero-tenant-id'] || process.env.XERO_DEFAULT_TENANT_ID;

      if (!activeTenantId) {
        return res.status(400).json({ error: 'Xero Tenant ID is required to sync.' });
      }

      const updatedClient = await XeroService.syncClientToXero(clientId, activeTenantId);

      return res.status(200).json({ 
        data: { 
          message: 'Client successfully synced with Xero.',
          client: updatedClient 
        } 
      });
    } catch (error) {
      console.error('[XeroController.syncClient Error]:', error.message);
      next(error);
    }
  }
};

module.exports = XeroController;