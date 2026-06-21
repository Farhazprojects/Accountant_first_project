const { ProposalActivityLog, Proposal, User } = require('../models');

const ProposalActivityLogService = {
  async logActivity(proposalId, userId, activityType, description = '') {
    console.log('[ProposalActivityLogService]: Logging proposal activity...');
    const activityLog = await ProposalActivityLog.create({
      proposalId,
      userId,
      activityType,
      description,
    });
    return activityLog;
  },

  async getProposalActivityLog(proposalId) {
    console.log('[ProposalActivityLogService]: Fetching activity log for proposal...');
    const activities = await ProposalActivityLog.findAll({
      where: { proposalId },
      include: [
        { association: 'proposal' },
        { association: 'user' },
      ],
      order: [['timestamp', 'DESC']],
    });
    return activities;
  },

  async logProposalViewed(proposalId, userId) {
    console.log('[ProposalActivityLogService]: Logging proposal viewed...');
    return await this.logActivity(proposalId, userId, 'viewed', 'Proposal viewed');
  },

  async logProposalSent(proposalId, userId, recipients) {
    console.log('[ProposalActivityLogService]: Logging proposal sent...');
    return await this.logActivity(
      proposalId,
      userId,
      'sent',
      `Proposal sent to ${recipients.join(', ')}`
    );
  },
};

module.exports = ProposalActivityLogService;
