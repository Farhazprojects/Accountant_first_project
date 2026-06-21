const { Notification, User } = require("../models");

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id }, // Assuming req.user.id is available from auth middleware
      include: [
        { model: User, as: "recipient", attributes: ["id", "firstName", "lastName", "email"] },
        { model: User, as: "notifier", attributes: ["id", "firstName", "lastName", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Notification.update(
      { read: true },
      { where: { id, userId: req.user.id } } // Ensure user can only mark their own notifications as read
    );
    if (updated) {
      res.status(200).json({ message: "Notification marked as read" });
    } else {
      res.status(404).json({ message: "Notification not found or not authorized" });
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.destroy({
      where: { id, userId: req.user.id }, // Ensure user can only delete their own notifications
    });
    if (deleted) {
      res.status(200).json({ message: "Notification deleted successfully" });
    } else {
      res.status(404).json({ message: "Notification not found or not authorized" });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Future: Add functionality to create notifications from other services
// This would likely be called internally by other controllers/services, not directly via a route
// Example: exports.createNotification = async (userId, type, message, entityType, entityId, triggeredBy) => { ... };
