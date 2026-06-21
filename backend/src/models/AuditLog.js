const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: 'audit_logs',
    timestamps: false,
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'actorId', as: 'actor' });
  };

  return AuditLog;
};
