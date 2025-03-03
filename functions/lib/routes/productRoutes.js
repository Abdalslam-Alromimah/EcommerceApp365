"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.post('/add', productController_1.addProductHandler); // POST /products/add
router.get('/', productController_1.listProductsHandler); // GET /products
exports.default = router;
