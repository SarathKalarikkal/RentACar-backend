import express from "express"
import { approveReservation, cancelReservation, createReservation, getAllReservations, getPendingReservations, getUserReservations, updateReservation } from "../../controllers/reservationController.js"
import { authUser } from "../../middlewares/authUser.js";
import { authDealerOrAdmin } from "../../middlewares/authDealerORAdmin.js";
import { authAdmin } from "../../middlewares/authAdmin.js";

const router = express.Router()

// User routes
router.post('/create', authUser, createReservation);
router.get('/user/reservations', authUser, getUserReservations);
router.put('/reservation/:id', authUser, updateReservation);
router.delete('/reservation/:id', authUser, cancelReservation);

// Dealer/Admin routes
router.put('/reservation/approve/:id', authDealerOrAdmin, approveReservation);
router.get('/reservations/pending', authDealerOrAdmin, getPendingReservations);
router.get('/reservations', authAdmin, getAllReservations);



export default router