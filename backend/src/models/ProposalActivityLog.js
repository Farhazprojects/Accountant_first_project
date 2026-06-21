
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProposalActivityLog = sequelize.define('ProposalActivityLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    proposalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'proposals',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null if activity is system-generated or by client (unauthenticated)
      references: {
        model: 'users',
        key: 'id',
      },
    },
    activityType: {
      type: DataTypes.ENUM('created', 'sent', 'viewed', 'signed', 'commented', 'updated_status'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'proposal_activity_logs',
    timestamps: false, // We manage timestamp manually with `timestamp` field
  });

  ProposalActivityLog.associate = (models) => {
    ProposalActivityLog.belongsTo(models.Proposal, { foreignKey: 'proposalId', as: 'proposal' });
    ProposalActivityLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return ProposalActivityLog;
};
