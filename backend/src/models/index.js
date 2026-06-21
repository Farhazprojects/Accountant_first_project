const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'accountant_first_dev',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const User = require('./User')(sequelize);
const Client = require('./Client')(sequelize);
const Workflow = require('./Workflow')(sequelize);
const Task = require('./Task')(sequelize);
const Proposal = require('./Proposal')(sequelize);
const ProposalActivityLog = require('./ProposalActivityLog')(sequelize);
const WorkflowTemplate = require('./WorkflowTemplate')(sequelize);
const TaskTemplate = require('./TaskTemplate')(sequelize);
const TaskActivityLog = require('./TaskActivityLog')(sequelize);
const Document = require('./Document')(sequelize);
const Notification = require('./Notification')(sequelize);
const Firm = require('./Firm')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);

// Associations
Client.hasMany(Workflow, { foreignKey: 'clientId', as: 'workflows' });
Workflow.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Workflow.hasMany(Task, { foreignKey: 'workflowId', as: 'tasks' });
Task.belongsTo(Workflow, { foreignKey: 'workflowId', as: 'workflow' });

// Notification Associations
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });
Notification.belongsTo(User, { foreignKey: 'triggeredBy', as: 'notifier' });

User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

Client.hasMany(Proposal, { foreignKey: 'clientId', as: 'proposals' });
Proposal.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Proposal Activity Log Associations
Proposal.hasMany(ProposalActivityLog, { foreignKey: 'proposalId', as: 'activityLogs' });
ProposalActivityLog.belongsTo(Proposal, { foreignKey: 'proposalId', as: 'proposal' });
User.hasMany(ProposalActivityLog, { foreignKey: 'userId', as: 'proposalActivityLogs' });
ProposalActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Workflow Template Associations
User.hasMany(WorkflowTemplate, { foreignKey: 'createdBy', as: 'workflowTemplates' });
WorkflowTemplate.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
WorkflowTemplate.hasMany(TaskTemplate, { foreignKey: 'templateId', as: 'taskTemplates' });
TaskTemplate.belongsTo(WorkflowTemplate, { foreignKey: 'templateId', as: 'workflowTemplate' });

// Task Activity Log Associations
Task.hasMany(TaskActivityLog, { foreignKey: 'taskId', as: 'activityLogs' });
TaskActivityLog.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
User.hasMany(TaskActivityLog, { foreignKey: 'userId', as: 'taskActivityLogs' });
TaskActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Document Associations
Client.hasMany(Document, { foreignKey: 'clientId', as: 'documents' });
Document.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
User.hasMany(Document, { foreignKey: 'uploadedBy', as: 'uploadedDocuments' });
Document.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// Call associate methods if they exist
Object.values(module.exports).forEach(model => {
  if (model.associate) {
    model.associate(module.exports);
  }
});

module.exports = {
  sequelize,
  User,
  Client,
  Workflow,
  Task,
  Proposal,
  ProposalActivityLog,
  WorkflowTemplate,
  TaskTemplate,
  TaskActivityLog,
  Document,
  Notification,
  Firm,
  AuditLog,
};
