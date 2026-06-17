const { Proposal, Client, User } = require('../models');
const PdfService = require('../services/PdfService');
const S3Service = require('../services/S3Service');
const EmailService = require('../services/EmailService'); // Import our new engine

const ProposalController = {
  // Triggered when an accountant generates a proposal and hits "Send"
  async createAndSendProposal(req, res, next) {
    try {
      // ... assume proposal logic creates record in database ...
      const proposal = { id: 'prop_123', totalAmount: 450, clientId: 'client_789' }; 
      const client = { name: 'Acme Corp', email: 'billing@acmecorp.com' };

      // Dispatch the email asynchronously to not block the API response
      EmailService.sendProposalToClient(
        client.email, 
        client.name, 
        proposal.id, 
        proposal.totalAmount
      );

      return res.status(201).json({ data: { message: 'Proposal drafted and emailed to client.' } });
    } catch (error) { next(error); }
  },

  // Triggered when the client writes their signature on the screen
  async acceptProposal(req, res, next) {
    try {
      const { id } = req.params;
      const { signatureData } = req.body;

      const proposal = await Proposal.findByPk(id, { include: [{ model: Client, as: 'client' }] });
      // ... (Step 11 code logic: Generates PDF, stamps signature, uploads to S3) ...
      const s3Url = 'https://accountantfirst-bucket.s3.amazonaws.com/proposals/signed.pdf';

      // Capture operational updates 
      proposal.status = 'accepted';
      await proposal.save();

      // Trigger Notification: Email the Firm Administrator that the deal is closed
      const firmAdmin = await User.findOne({ where: { role: 'admin', isActive: true } });
      if (firmAdmin) {
        EmailService.notifyAdminProposalSigned(
          firmAdmin.email, 
          proposal.client.name, 
          s3Url
        );
      }

      return res.status(200).json({ data: { message: 'Proposal accepted.', documentUrl: s3Url } });
    } catch (error) { next(error); }
  }
};

module.exports = ProposalController;