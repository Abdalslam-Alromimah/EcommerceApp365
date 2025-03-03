"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware); // Protect all cart routes
router.post('/add', cartController_1.addItemToCart); // POST /cart/add
router.get('/', cartController_1.viewCart); // GET /cart
exports.default = router;
