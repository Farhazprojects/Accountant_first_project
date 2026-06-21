
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WorkflowTemplate = sequelize.define('WorkflowTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recurrenceRule: {
      type: DataTypes.ENUM('none', 'monthly', 'quarterly', 'annual'),
      defaultValue: 'none',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'workflow_templates',
    timestamps: true,
  });

  WorkflowTemplate.associate = (models) => {
    WorkflowTemplate.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    WorkflowTemplate.hasMany(models.TaskTemplate, { foreignKey: 'templateId', as: 'taskTemplates' });
  };

  return WorkflowTemplate;
};
