const { Notification, User } = require("../models");

const NotificationService = {
  /**
   * Creates a new notification.
   * @param {string} userId - The ID of the user who will receive the notification.
   * @param {string} type - The type of notification (e.g., "proposal_accepted", "task_assigned").
   * @param {string} message - The message content of the notification.
   * @param {string} [entityType] - Optional: The type of entity related to the notification (e.g., "Proposal", "Task").
   * @param {string} [entityId] - Optional: The ID of the entity related to the notification.
   * @param {string} [triggeredBy] - Optional: The ID of the user who triggered the notification.
   * @returns {Promise<Notification>} The created notification object.
   */
  createNotification: async ({ userId, type, message, entityType, entityId, triggeredBy }) => {
    try {
      const notification = await Notification.create({
        userId,
        type,
        message,
        entityType,
        entityId,
        triggeredBy,
      });
      // In a real-world scenario, you might also trigger real-time notifications here (e.g., WebSockets)
      console.log(`Notification created for user ${userId}: ${message}`);
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Could not create notification");
    }
  },

  /**
   * Marks a notification as read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @param {string} userId - The ID of the user who owns the notification.
   * @returns {Promise<boolean>} True if updated, false otherwise.
   */
  markNotificationAsRead: async (notificationId, userId) => {
    try {
      const [updated] = await Notification.update(
        { read: true },
        { where: { id: notificationId, userId } }
      );
      return updated > 0;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Could not mark notification as read");
    }
  },

  /**
   * Deletes a notification.
   * @param {string} notificationId - The ID of the notification to delete.
   * @param {string} userId - The ID of the user who owns the notification.
   * @returns {Promise<boolean>} True if deleted, false otherwise.
   */
  deleteNotification: async (notificationId, userId) => {
    try {
      const deleted = await Notification.destroy({
        where: { id: notificationId, userId },
      });
      return deleted > 0;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw new Error("Could not delete notification");
    }
  },

  /**
   * Get all notifications for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<Notification>>} An array of notification objects.
   */
  getUserNotifications: async (userId) => {
    try {
      const notifications = await Notification.findAll({
        where: { userId },
        include: [
          { model: User, as: "recipient", attributes: ["id", "firstName", "lastName", "email"] },
          { model: User, as: "notifier", attributes: ["id", "firstName", "lastName", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      return notifications;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw new Error("Could not fetch user notifications");
    }
  },

  // Add more specific notification triggering methods here as needed by other services
  // For example, for proposal acceptance:
  // async triggerProposalAcceptedNotification(proposalId, clientId, adminId) { ... }
};

module.exports = NotificationService;
