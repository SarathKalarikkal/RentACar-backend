import express from 'express'
import { addCar, deleteCar, deleteReservation, deleteUser, getAllCars, getAllDealers, getAllReservations, getAllUsers, updateCar } from '../../controllers/adminController.js'

const router = express.Router()

router.get('/allusers', getAllUsers)
router.delete('/user/:id', deleteUser)
router.get('/dealers', getAllDealers)
router.get('/allcars', getAllCars)
router.post('/car', addCar)
router.put('/car/:id', updateCar)
router.delete('/car/:id', deleteCar)
router.get('/reservations', getAllReservations)
router.delete('/reservation/:id', deleteReservation)



export default router