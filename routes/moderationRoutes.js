
import express from "express";
import * as reportController from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { moderatorMiddleware } from "../middleware/moderatorMiddleware.js";

const router = express.Router();

router.use(authMiddleware, moderatorMiddleware);

router.get("/", reportController.index);

router.post("/:idReport/aceptar", reportController.aceptar);
router.post("/:idReport/rechazar", reportController.rechazar);

export default router;
