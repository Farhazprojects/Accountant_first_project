
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaskTemplate = sequelize.define('TaskTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflow_templates',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Expected duration in days for this task',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Order of task within a template',
    },
  }, {
    tableName: 'task_templates',
    timestamps: true,
  });

  TaskTemplate.associate = (models) => {
    TaskTemplate.belongsTo(models.WorkflowTemplate, { foreignKey: 'templateId', as: 'workflowTemplate' });
  };

  return TaskTemplate;
};
