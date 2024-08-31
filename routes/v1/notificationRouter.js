import express from "express"
import { authDealer } from "../../middlewares/authDealer.js"
import { getDealerNotifications, markNotificationAsRead } from "../../controllers/notificationController.js";



const router = express.Router()

router.get('/', authDealer, getDealerNotifications);
router.put('/:notificationId/read', authDealer, markNotificationAsRead);

export default router