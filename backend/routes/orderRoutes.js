import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrdersByTable,
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/table/:tableNumber', getOrdersByTable);
router.get('/:id', getOrderById);

export default router;

