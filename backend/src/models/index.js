const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize (Update credentials via environment variables in production)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'accountant_first',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, 
  }
);

// Import Models
const User = require('./User')(sequelize);
const Client = require('./Client')(sequelize);
const Workflow = require('./Workflow')(sequelize);
const Task = require('./Task')(sequelize);

// Define Associations

// Client <-> Workflow (One-to-Many)
Client.hasMany(Workflow, { foreignKey: 'clientId', as: 'workflows' });
Workflow.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Workflow <-> Task (One-to-Many)
Workflow.hasMany(Task, { foreignKey: 'workflowId', as: 'tasks' });
Task.belongsTo(Workflow, { foreignKey: 'workflowId', as: 'workflow' });

// User <-> Task (One-to-Many for Assignments)
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

// Export the sequelize instance and models
module.exports = {
  sequelize,
  User,
  Client,
  Workflow,
  Task
};