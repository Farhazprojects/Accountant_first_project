const { AuditLog, User } = require('../models');
const { Op } = require('sequelize');

const AuditLogService = {
  async logAction(actorId, action, entity, entityId, changes = null, metadata = null) {
    console.log('[AuditLogService]: Creating audit log entry...');
    const auditLog = await AuditLog.create({
      actorId,
      action,
      entity,
      entityId,
      changes,
      metadata,
    });
    return auditLog;
  },

  async getAuditLogsByEntity(entity, entityId) {
    console.log('[AuditLogService]: Fetching audit logs by entity...');
    const logs = await AuditLog.findAll({
      where: { entity, entityId },
      include: [{ association: 'actor' }],
      order: [['timestamp', 'DESC']],
    });
    return logs;
  },

  async getAuditLogsByActor(actorId, limit = 50) {
    console.log('[AuditLogService]: Fetching audit logs by actor...');
    const logs = await AuditLog.findAll({
      where: { actorId },
      include: [{ association: 'actor' }],
      order: [['timestamp', 'DESC']],
      limit,
    });
    return logs;
  },

  async getAuditLogsByDateRange(startDate, endDate) {
    console.log('[AuditLogService]: Fetching audit logs by date range...');
    const logs = await AuditLog.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{ association: 'actor' }],
      order: [['timestamp', 'DESC']],
    });
    return logs;
  },
};

module.exports = AuditLogService;
