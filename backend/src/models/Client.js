const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    xeroContactId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID linked to Xero integration',
    },
    onboardingStatus: {
      type: DataTypes.ENUM('pending', 'proposal_sent', 'proposal_accepted', 'active'),
      defaultValue: 'pending',
    }
  }, {
    tableName: 'clients',
    timestamps: true,
  });

  return Client;
};