import { Router } from 'express';
import { addProductHandler, listProductsHandler } from '../controllers/productController';

const router = Router();

router.post('/add', addProductHandler); // POST /products/add
router.get('/', listProductsHandler);   // GET /products

export default router;