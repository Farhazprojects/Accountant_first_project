const { Proposal, Client, AuditLog, ProposalActivityLog } = require('../models');

const ProposalService = {
  async getProposalById(proposalId) {
    console.log('[ProposalService]: Fetching proposal by ID...');
    const proposal = await Proposal.findByPk(proposalId, {
      include: [
        { association: 'client' },
        { association: 'activityLogs' },
      ],
    });
    return proposal;
  },

  async getProposalsByClient(clientId) {
    console.log('[ProposalService]: Fetching proposals for client...');
    const proposals = await Proposal.findAll({
      where: { clientId },
      order: [['createdAt', 'DESC']],
    });
    return proposals;
  },

  async createProposal(proposalData, actorId) {
    console.log('[ProposalService]: Creating new proposal...');
    const proposal = await Proposal.create(proposalData);
    await AuditLog.create({
      actorId,
      action: 'CREATE',
      entity: 'Proposal',
      entityId: proposal.id,
      metadata: { data: proposalData },
    });
    await ProposalActivityLog.create({
      proposalId: proposal.id,
      userId: actorId,
      activityType: 'created',
      description: 'Proposal created',
    });
    return proposal;
  },

  async updateProposalStatus(proposalId, newStatus, actorId) {
    console.log('[ProposalService]: Updating proposal status...');
    const proposal = await Proposal.findByPk(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }
    const oldStatus = proposal.status;
    await proposal.update({ status: newStatus });
    await AuditLog.create({
      actorId,
      action: 'UPDATE_STATUS',
      entity: 'Proposal',
      entityId: proposalId,
      changes: { before: oldStatus, after: newStatus },
    });
    return proposal;
  },
};

module.exports = ProposalService;
