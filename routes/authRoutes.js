import express from 'express'
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import * as userController from "../controllers/userController.js";
import * as followController from '../controllers/followController.js'

const router = express.Router()

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

router.get('/registro', authController.getRegister)
router.post('/registro', authController.postRegister)

router.get('/logout', authController.logout)

router.get('/perfil/:id', userController.perfil)

router.post('/perfil/:id/seguir', authMiddleware, followController.seguir);
router.post('/perfil/:id/dejar-seguir', authMiddleware, followController.dejarDeSeguir);

export default router