import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getDashboardMetrics,
  getMenuItems,
  getSales,
  getSalesSummary,
  login,
  recordSale,
  updateMenuItem,
} from '../controllers/adminController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.post('/login', login);

router.route('/menu').get(getMenuItems).post(createMenuItem);
router.route('/menu/:id').patch(updateMenuItem).delete(deleteMenuItem);

router.route('/sales').get(getSales).post(recordSale);
router.get('/sales/summary', getSalesSummary);
router.get('/dashboard/summary', getDashboardMetrics);

router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

