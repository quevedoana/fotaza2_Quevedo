import express from 'express'
import * as postController from '../controllers/postController.js'
console.log(postController)
const router = express.Router()

router.get('/', postController.index)
router.get('/crear', postController.getCrear)
router.post('/crear', postController.postCrear)
router.get('/:id', postController.show) 
router.get('/:id/editar', postController.getEditar)
router.post('/:id/editar', postController.postEditar)
router.post('/:id/eliminar', postController.eliminar)

export default router