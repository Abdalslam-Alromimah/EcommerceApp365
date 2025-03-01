import { Router } from 'express';
import { createOrderHandler, getOrderHandler, listOrdersHandler } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware); // Protect all order routes
router.post('/create', createOrderHandler); // POST /orders/create
router.get('/:id', getOrderHandler);        // GET /orders/:id
router.get('/', listOrdersHandler);         // GET /orders

export default router;