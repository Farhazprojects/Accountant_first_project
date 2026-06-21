const { Proposal, Client, User } = require('../models');
const PdfService = require('../services/PdfService');
const S3Service = require('../services/S3Service');
const EmailService = require('../services/EmailService'); // Import our new engine

const ProposalController = {
  async createProposal(req, res, next) {
    try {
      const { clientId, title, description, totalAmount, status, createdBy } = req.body;

      if (!clientId || !title || !totalAmount) {
        return res.status(400).json({ error: 'Client ID, title, and total amount are required.' });
      }

      const proposal = await Proposal.create({
        clientId,
        title,
        description,
        totalAmount,
        status: status || 'pending',
        createdBy,
      });

      return res.status(201).json({ data: { proposal } });
    } catch (error) {
      console.error('[ProposalController.createProposal Error]:', error.message);
      next(error);
    }
  },

  async getProposalById(req, res, next) {
    try {
      const { id } = req.params;
      const proposal = await Proposal.findByPk(id);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found.' });
      }
      return res.status(200).json({ data: proposal });
    } catch (error) {
      console.error('[ProposalController.getProposalById Error]:', error.message);
      next(error);
    }
  },

  async updateProposal(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, totalAmount, status } = req.body;

      const proposal = await Proposal.findByPk(id);
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found.' });
      }

      proposal.title = title || proposal.title;
      proposal.description = description || proposal.description;
      proposal.totalAmount = totalAmount || proposal.totalAmount;
      proposal.status = status || proposal.status;

      await proposal.save();

      return res.status(200).json({ data: proposal });
    } catch (error) {
      console.error('[ProposalController.updateProposal Error]:', error.message);
      next(error);
    }
  },

  // Triggered when an accountant generates a proposal and hits "Send"
  async createAndSendProposal(req, res, next) {
    try {
      const { proposalId } = req.body;

      if (!proposalId) {
        return res.status(400).json({ error: 'proposalId is required in request body.' });
      }

      // Fetch the actual proposal and client from the database
      const proposal = await Proposal.findByPk(proposalId, {
        include: [{ model: Client, as: 'client' }]
      });

      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found.' });
      }

      const { client } = proposal;
      if (!client || !client.email) {
        return res.status(400).json({ error: 'Client email not found for this proposal.' });
      }

      // Dispatch the email and wait for resolution to handle potential failures
      await EmailService.sendProposalToClient(
        client.email, 
        client.name, 
        proposal.id, 
        proposal.totalAmount
      );

      // Update proposal status to 'sent'
      proposal.status = 'sent';
      await proposal.save();

      return res.status(200).json({ 
        data: { 
          message: 'Proposal successfully dispatched to client.',
          proposalId: proposal.id,
          recipient: client.email
        } 
      });
    } catch (error) { 
      console.error('[ProposalController.createAndSendProposal Error]:', error.message);
      next(error); 
    }
  },

  // Triggered when the client writes their signature on the screen
  async acceptProposal(req, res, next) {
    try {
      const { id } = req.params;
      const { signatureData } = req.body;

      const proposal = await Proposal.findByPk(id, { include: [{ model: Client, as: 'client' }] });
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found.' });
      }

      // 1. Generate the base proposal document (HTML -> PDF)
      const htmlContent = `<h1>Proposal for ${proposal.client.name}</h1><p>Amount: $${proposal.totalAmount}</p>`;
      const basePdfBuffer = await PdfService.generatePdfFromHtml(htmlContent);

      // 2. Stamp the signature onto the PDF
      const signedPdfBuffer = await PdfService.stampSignatureOnPdf(basePdfBuffer, signatureData);

      // 3. Persist the signed PDF to S3
      const s3Data = await S3Service.uploadToS3(
        { buffer: signedPdfBuffer, originalname: `signed-proposal-${id}.pdf`, mimetype: 'application/pdf' },
        proposal.clientId
      );

      const s3Url = s3Data.url;

      // Capture operational updates 
      proposal.status = 'accepted';
      proposal.signedDocumentUrl = s3Url;
      await proposal.save();

      // Sync client with Xero to map Xero Contact ID
      try {
        const XeroService = require('../services/XeroService');
        const activeTenantId = process.env.XERO_DEFAULT_TENANT_ID || 'mock-tenant-id';
        await XeroService.syncClientToXero(proposal.clientId, activeTenantId);
      } catch (xeroError) {
        console.error('[Xero Sync Error during acceptProposal]:', xeroError.message);
      }

      // Trigger Notification: Email the Firm Administrator that the deal is closed
      const firmAdmin = await User.findOne({ where: { role: 'admin', isActive: true } });
      if (firmAdmin) {
        await EmailService.notifyAdminProposalSigned(
          firmAdmin.email, 
          proposal.client.name, 
          s3Url
        );
      }

      return res.status(200).json({ data: { message: 'Proposal accepted.', documentUrl: s3Url } });
    } catch (error) { 
      console.error('[ProposalController.acceptProposal Error]:', error.message);
      next(error); 
    }
  }
};

module.exports = ProposalController;