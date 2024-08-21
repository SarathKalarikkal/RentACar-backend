import express from "express"
import { checkUser, getAllUsers, userCreate, userLogin, userLogout, userProfile } from "../../controllers/userController.js"
import { authUser } from "../../middlewares/authUser.js"
import { upload } from "../../middlewares/uploadMiddileware.js";


const router = express.Router()

router.post('/create',upload.single('image'), userCreate);
router.post('/login', userLogin);
router.post('/logout', authUser, userLogout); 

router.get('/profile/:id', authUser, userProfile);
router.get('/check-user', authUser, checkUser);
router.get('/', authUser, getAllUsers);

export default router