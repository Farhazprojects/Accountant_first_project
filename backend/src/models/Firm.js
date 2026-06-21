const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Firm = sequelize.define('Firm', {
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
      allowNull: false,
      unique: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'inactive',
    },
    stripePriceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'firms',
    underscored: false,
  });

  return Firm;
};