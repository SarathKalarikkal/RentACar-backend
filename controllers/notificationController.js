import { Dealer } from "../models/dealerModel.js";
import { Notification } from "../models/notificationModel.js";


export const createNotification = async (req, res, next) => {
    try {
        const { carId, userId, message } = req.body;

        // Find the dealer associated with the car
        const dealer = await Dealer.findOne({ cars: carId });

        if (!dealer) {
            return res.status(404).json({ success: false, message: "Dealer not found" });
        }

        // Create a new notification
        const notification = new Notification({
            dealer: dealer._id,
            user: userId,
            car: carId,
            message: message || "A new reservation has been made for your car."
        });

        await notification.save();

        res.status(201).json({ success: true, message: "Notification created successfully", data: notification });
    } catch (error) {
        console.error("Error creating notification:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


export const getDealerNotifications = async (req, res, next) => {
    try {
        const dealerId = req.user.id;  // Assuming dealer is authenticated and their ID is in req.user.id

        const notifications = await Notification.find({ dealer: dealerId }).populate('car user').sort({ createdAt: -1 });

        res.status(200).json({ success: true, message: "Notifications fetched successfully", data: notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        notification.status = 'read';
        await notification.save();

        res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
    } catch (error) {
        console.error("Error updating notification:", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};


