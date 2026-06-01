import express from 'express'
import * as postController from '../controllers/postController.js'
import * as commentController from '../controllers/commentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
const router = express.Router()

router.get('/', postController.index)
router.get('/crear', authMiddleware, postController.getCrear)
router.post('/crear', authMiddleware, postController.postCrear)
router.get('/:id', postController.show) 
router.get('/:id/editar', postController.getEditar)
router.post('/:id/editar', postController.postEditar)
router.post('/:id/eliminar', postController.eliminar)
router.post('/:idPost/fotos/:idPhoto/comentarios', commentController.agregar)
router.post('/:idPost/fotos/:idPhoto/comentarios/cerrar', commentController.cerrar)

export default router