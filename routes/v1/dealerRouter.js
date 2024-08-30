import express from "express"
import { createDealer, dealerLogin, dealerProfile, checkDealer, dealerUpdate, dealerLogout, getAllDealers, getDealerInventory} from "../../controllers/dealerController.js"
import { authDealer } from "../../middlewares/authDealer.js"
import { upload } from "../../middlewares/uploadMiddileware.js";


const router = express.Router()

router.post('/create',upload.single('image'), createDealer);
router.post('/login', dealerLogin);
router.get('/logout', authDealer, dealerLogout);
router.get('/list', getAllDealers);
router.get('/profile/:id', authDealer, dealerProfile);
router.get('/check-dealer', authDealer, checkDealer);
router.put('/update/:id', authDealer, dealerUpdate);

router.get('/inventory',authDealer, getDealerInventory);

export default router