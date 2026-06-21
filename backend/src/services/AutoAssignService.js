
const { Task, User } = require('../models');
const { Op } = require('sequelize');

const AutoAssignService = {
  async autoAssignTasksToStaff() {
    console.log('[AutoAssignService]: Starting auto-assignment of tasks...');

    // Find all unassigned tasks
    const unassignedTasks = await Task.findAll({
      where: {
        assigneeId: null,
        status: { [Op.ne]: 'completed' }, // Only assign non-completed tasks
      },
    });

    if (unassignedTasks.length === 0) {
      console.log('[AutoAssignService]: No unassigned tasks found.');
      return;
    }

    // Find all active staff users
    const staffUsers = await User.findAll({
      where: {
        role: 'staff',
        isActive: true,
      },
      order: [['lastAssigned', 'ASC']], // Prioritize staff who were assigned tasks least recently
    });

    if (staffUsers.length === 0) {
      console.log('[AutoAssignService]: No active staff users found for assignment.');
      return;
    }

    let staffIndex = 0;
    for (const task of unassignedTasks) {
      const assignee = staffUsers[staffIndex];

      if (assignee) {
        task.assigneeId = assignee.id;
        await task.save();

        // Update lastAssigned timestamp for load balancing
        assignee.lastAssigned = new Date();
        await assignee.save();

        console.log(`[AutoAssignService]: Task '${task.title}' assigned to ${assignee.firstName} ${assignee.lastName}.`);

        staffIndex = (staffIndex + 1) % staffUsers.length;
      } else {
        console.warn(`[AutoAssignService]: No staff available to assign task '${task.title}'.`);
      }
    }

    console.log('[AutoAssignService]: Auto-assignment of tasks completed.');
  },
};

module.exports = AutoAssignService;
