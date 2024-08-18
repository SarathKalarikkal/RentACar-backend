import express from "express"
import { createCar, deleteCar, getACar, getCarsList, updateCar } from "../../controllers/carController.js"
import { authUser } from "../../middlewares/authUser.js"
import { authDealer } from "../../middlewares/authDealer.js"
import { authDealerOrAdmin } from "../../middlewares/authDealerORAdmin.js"
import  { uploadCarImages } from "../../config/cloudinary.js"


const router = express.Router()

router.post('/create', authDealer, uploadCarImages.array('images', 5),createCar);
router.get('/list', authUser, getCarsList); 
router.get('/:id', getACar);
router.put('/update/:id', authDealer, updateCar);
router.delete('/delete/:id', authDealerOrAdmin, deleteCar);


export default router