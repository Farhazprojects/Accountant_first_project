'use strict';

/**
 * Initial schema migration — creates all tables that were previously
 * managed by sequelize.sync({ alter: true }).
 *
 * This migration is safe to run against an existing database because
 * every CREATE TABLE uses "IF NOT EXISTS" via queryInterface semantics
 * and will be skipped if the table already exists.
 *
 * Run: npx sequelize-cli db:migrate
 * Undo: npx sequelize-cli db:migrate:undo (drops tables — destructive, use only in dev)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'staff'), allowNull: false, defaultValue: 'staff' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      lastAssigned: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Clients
    await queryInterface.createTable('clients', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      xeroContactId: { type: Sequelize.STRING, allowNull: true },
      onboardingStatus: {
        type: Sequelize.ENUM('pending', 'proposal_sent', 'proposal_accepted', 'active'),
        defaultValue: 'pending',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Workflows
    await queryInterface.createTable('workflows', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.ENUM('active', 'completed', 'archived'), defaultValue: 'active' },
      recurrenceRule: { type: Sequelize.ENUM('none', 'monthly', 'quarterly', 'annual'), defaultValue: 'none' },
      progress: { type: Sequelize.INTEGER, defaultValue: 0 },
      clientId: { type: Sequelize.UUID, allowNull: true, references: { model: 'clients', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Tasks
    await queryInterface.createTable('tasks', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'blocked'), defaultValue: 'pending' },
      dueDate: { type: Sequelize.DATE, allowNull: true },
      order: { type: Sequelize.INTEGER, defaultValue: 0 },
      workflowId: { type: Sequelize.UUID, allowNull: true, references: { model: 'workflows', key: 'id' }, onDelete: 'CASCADE' },
      assigneeId: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Proposals
    await queryInterface.createTable('proposals', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'sent', 'accepted', 'rejected'), defaultValue: 'pending' },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      signatureData: { type: Sequelize.TEXT, allowNull: true },
      documentUrl: { type: Sequelize.STRING, allowNull: true },
      signedAt: { type: Sequelize.DATE, allowNull: true },
      clientId: { type: Sequelize.UUID, allowNull: true, references: { model: 'clients', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // WorkflowTemplates
    await queryInterface.createTable('workflowtemplates', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      recurrenceRule: { type: Sequelize.ENUM('none', 'monthly', 'quarterly', 'annual'), defaultValue: 'none' },
      createdBy: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // TaskTemplates
    await queryInterface.createTable('tasktemplates', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      order: { type: Sequelize.INTEGER, defaultValue: 0 },
      durationDays: { type: Sequelize.INTEGER, allowNull: true },
      templateId: { type: Sequelize.UUID, allowNull: true, references: { model: 'workflowtemplates', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // ProposalActivityLogs
    await queryInterface.createTable('proposalactivitylogs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      action: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      proposalId: { type: Sequelize.UUID, allowNull: true, references: { model: 'proposals', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // TaskActivityLogs
    await queryInterface.createTable('taskactivitylogs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      action: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      taskId: { type: Sequelize.UUID, allowNull: true, references: { model: 'tasks', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Documents
    await queryInterface.createTable('documents', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      fileName: { type: Sequelize.STRING, allowNull: false },
      fileUrl: { type: Sequelize.STRING, allowNull: false },
      fileType: { type: Sequelize.STRING, allowNull: true },
      fileSize: { type: Sequelize.INTEGER, allowNull: true },
      clientId: { type: Sequelize.UUID, allowNull: true, references: { model: 'clients', key: 'id' }, onDelete: 'SET NULL' },
      uploadedBy: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Notifications
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      message: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: true },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      userId: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      triggeredBy: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // Firms (for Stripe webhook subscription management)
    await queryInterface.createTable('firms', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      stripeCustomerId: { type: Sequelize.STRING, allowNull: true },
      subscriptionStatus: { type: Sequelize.STRING, allowNull: true, defaultValue: 'inactive' },
      stripePriceId: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });

    // AuditLogs
    await queryInterface.createTable('auditlogs', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      actorId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      action: { type: Sequelize.STRING, allowNull: false },
      entityType: { type: Sequelize.STRING, allowNull: true },
      entityId: { type: Sequelize.UUID, allowNull: true },
      metadata: { type: Sequelize.JSONB, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    }, { ifNotExists: true });
  },

  async down(queryInterface) {
    // Reverse order (children before parents) to respect foreign keys
    await queryInterface.dropTable('auditlogs', { ifExists: true });
    await queryInterface.dropTable('firms', { ifExists: true });
    await queryInterface.dropTable('notifications', { ifExists: true });
    await queryInterface.dropTable('documents', { ifExists: true });
    await queryInterface.dropTable('taskactivitylogs', { ifExists: true });
    await queryInterface.dropTable('proposalactivitylogs', { ifExists: true });
    await queryInterface.dropTable('tasktemplates', { ifExists: true });
    await queryInterface.dropTable('workflowtemplates', { ifExists: true });
    await queryInterface.dropTable('proposals', { ifExists: true });
    await queryInterface.dropTable('tasks', { ifExists: true });
    await queryInterface.dropTable('workflows', { ifExists: true });
    await queryInterface.dropTable('clients', { ifExists: true });
    await queryInterface.dropTable('users', { ifExists: true });
  },
};
