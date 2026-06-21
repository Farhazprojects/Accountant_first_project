
const { ProposalActivityLog, User, Proposal } = require('../models');

const ProposalActivityLogController = {
  async createLog(req, res, next) {
    try {
      const { proposalId, userId, activityType, description } = req.body;

      if (!proposalId || !activityType) {
        return res.status(400).json({ error: 'Proposal ID and activity type are required.' });
      }

      const log = await ProposalActivityLog.create({
        proposalId,
        userId,
        activityType,
        description,
      });

      return res.status(201).json({ data: log });
    } catch (error) {
      console.error('[ProposalActivityLogController.createLog Error]:', error.message);
      next(error);
    }
  },

  async getLogsForProposal(req, res, next) {
    try {
      const { proposalId } = req.params;

      const logs = await ProposalActivityLog.findAll({
        where: { proposalId },
        include: [
          { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
          { model: Proposal, as: 'proposal', attributes: ['id', 'title'] }
        ],
        order: [['timestamp', 'DESC']],
      });

      return res.status(200).json({ data: logs });
    } catch (error) {
      console.error('[ProposalActivityLogController.getLogsForProposal Error]:', error.message);
      next(error);
    }
  },
};

module.exports = ProposalActivityLogController;
