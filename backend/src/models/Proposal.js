const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proposal = sequelize.define('Proposal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'viewed', 'accepted', 'declined'),
      defaultValue: 'draft',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Stores the Base64 image string of the client signature',
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    tableName: 'proposals',
    timestamps: true,
  });

  return Proposal;
};