import { Router } from 'express';
import { getPublicMenu } from '../controllers/menuController.js';

const router = Router();

router.get('/', getPublicMenu);

export default router;

