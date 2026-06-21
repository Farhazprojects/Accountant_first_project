
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaskActivityLog = sequelize.define('TaskActivityLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true, // Can be null if activity is system-generated
      references: {
        model: 'users',
        key: 'id',
      },
    },
    activityType: {
      type: DataTypes.ENUM('created', 'assigned', 'status_updated', 'commented', 'due_date_updated', 'document_uploaded'),
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
    tableName: 'task_activity_logs',
    timestamps: false, // We manage timestamp manually with `timestamp` field
  });

  TaskActivityLog.associate = (models) => {
    TaskActivityLog.belongsTo(models.Task, { foreignKey: 'taskId', as: 'task' });
    TaskActivityLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return TaskActivityLog;
};
