"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware); // Protect all order routes
router.post('/create', orderController_1.createOrderHandler); // POST /orders/create
router.get('/:id', orderController_1.getOrderHandler); // GET /orders/:id
router.get('/', orderController_1.listOrdersHandler); // GET /orders
exports.default = router;
