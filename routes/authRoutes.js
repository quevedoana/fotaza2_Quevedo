import express from 'express'
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import * as userController from "../controllers/userController.js";

const router = express.Router()

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

router.get('/registro', authController.getRegister)
router.post('/registro', authController.postRegister)

router.get('/logout', authController.logout)

router.get('/perfil/:id', userController.perfil)

export default router