import express from 'express'
import postRoutes from './postRoutes.js'

const router = express.Router()

router.use('/publicaciones', postRoutes)

export default router