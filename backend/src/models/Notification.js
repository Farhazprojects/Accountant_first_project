const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define("Notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    entityType: {
      type: DataTypes.STRING, // e.g., 'Proposal', 'Task', 'Workflow'
    },
    entityId: {
      type: DataTypes.UUID, // ID of the related entity
    },
    triggeredBy: {
      type: DataTypes.UUID, // User who triggered the notification
      references: {
        model: "users",
        key: "id",
      },
    },
  }, {
    tableName: "notifications",
    timestamps: true,
  });

  return Notification;
};
