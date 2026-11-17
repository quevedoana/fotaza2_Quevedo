import express from "express";
import * as postController from "../controllers/postController.js";
import * as commentController from "../controllers/commentController.js";
import * as ratingController from "../controllers/ratingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

router.post("/:idPost/denunciar", authMiddleware, reportController.crear);
router.get("/", postController.index);

router.get("/crear", authMiddleware, postController.getCrear);
router.post("/crear", authMiddleware, postController.postCrear);

router.get("/:id", postController.show);

router.get("/:id/editar", authMiddleware, postController.getEditar);
router.post("/:id/editar", authMiddleware, postController.postEditar);
router.post("/:id/eliminar", authMiddleware, postController.eliminar);

// Comentarios
router.post(
  "/:idPost/fotos/:idPhoto/comentarios",
  authMiddleware,
  commentController.agregar,
);

router.post(
  "/:idPost/fotos/:idPhoto/comentarios/cerrar",
  authMiddleware,
  commentController.cerrar,
);

router.post(
  "/:idPost/fotos/:idPhoto/comentarios/abrir",
  authMiddleware,
  commentController.abrir,
);

// Valoraciones
router.post(
  "/:idPost/fotos/:idPhoto/rating",
  authMiddleware,
  ratingController.valorar,
);

export default router;
