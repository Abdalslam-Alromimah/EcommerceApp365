"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsHandler = exports.addProductHandler = void 0;
const productModel_1 = require("../models/productModel");
// Rename local functions to avoid conflicts
const addProductHandler = async (req, res, next) => {
    try {
        const { name, description, price, stock } = req.body;
        if (!name || !price || stock === undefined || stock < 0) {
            res.status(400).json({ error: 'Name, price, and non-negative stock are required' });
            return; // Explicitly return void
        }
        const newProduct = await (0, productModel_1.addProduct)({ name, description, price: Number(price), stock });
        res.status(201).json({ success: true, product: newProduct });
    }
    catch (error) {
        next(error);
    }
};
exports.addProductHandler = addProductHandler;
const listProductsHandler = async (req, res, next) => {
    try {
        const products = await (0, productModel_1.listProducts)();
        res.status(200).json({ success: true, products });
    }
    catch (error) {
        next(error);
    }
};
exports.listProductsHandler = listProductsHandler;
