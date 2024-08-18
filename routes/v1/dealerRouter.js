import express from "express"
import { createDealer, dealerLogin, dealerProfile, checkDealer, dealerUpdate, dealerLogout, getAllDealers} from "../../controllers/dealerController.js"
import { authDealer } from "../../middlewares/authDealer.js"
import { uploadDealerProfilePic } from "../../config/cloudinary.js";

const router = express.Router()

router.post('/create',uploadDealerProfilePic.single('profilePic'),createDealer);
router.post('/login', dealerLogin);
router.get('/logout', authDealer, dealerLogout);
router.get('/list', getAllDealers);
router.get('/profile/:id', authDealer, dealerProfile);
router.get('/check-dealer', authDealer, checkDealer);
router.put('/update/:id', authDealer, dealerUpdate);

export default router