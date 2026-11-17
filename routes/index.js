
import express from 'express';
import postRoutes from './postRoutes.js';
import authRoutes from './authRoutes.js';
import * as searchController from '../controllers/searchController.js';
import * as homeController from '../controllers/homeController.js';
import moderationRoutes from "./moderationRoutes.js";

const router = express.Router();

router.use('/', authRoutes);
router.use('/publicaciones', postRoutes);
router.use('/moderacion', moderationRoutes);

router.get('/search', searchController.buscar);
router.get('/', homeController.index);

export default router;
