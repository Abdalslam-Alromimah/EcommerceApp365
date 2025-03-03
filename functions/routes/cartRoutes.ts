import { Router } from 'express';
import { addItemToCart, viewCart } from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware); // Protect all cart routes
router.post('/add', addItemToCart); // POST /cart/add
router.get('/', viewCart);          // GET /cart

export default router;