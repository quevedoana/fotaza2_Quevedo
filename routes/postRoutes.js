import express from 'express'
import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import * as ratingController from '../controllers/ratingController.js'

const router = express.Router()

router.get('/', postController.index)
router.get('/crear', authMiddleware, postController.getCrear)
router.post('/crear', authMiddleware, postController.postCrear)
router.get('/:id', postController.show) 
router.get('/:id/editar',authMiddleware, postController.getEditar)
router.post('/:id/editar', authMiddleware, postController.postEditar)
router.post('/:id/eliminar', authMiddleware, postController.eliminar)
router.post('/:idPost/fotos/:idPhoto/comentarios', commentController.agregar)
router.post('/:idPost/fotos/:idPhoto/comentarios/cerrar', commentController.cerrar)
router.post('/:idPost/fotos/:idPhoto/comentarios/abrir', commentController.abrir)
router.post('/:idPost/fotos/:idPhoto/rating', authMiddleware,ratingController.valorar)
export default router