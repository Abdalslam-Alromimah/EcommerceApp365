"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartTotalHandler = exports.updateCartItem = exports.removeItemFromCart = exports.viewCart = exports.addItemToCart = void 0;
const cartModel_1 = require("../models/cartModel");
const addItemToCart = async (req, res, next) => {
    var _a;
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Product ID and positive quantity are required' });
            return;
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        await (0, cartModel_1.addToCart)(userId, productId, quantity);
        const cart = await (0, cartModel_1.getCart)(userId);
        res.status(201).json({ success: true, cartItem: cart.find(item => item.productId === productId) });
    }
    catch (error) {
        next(error);
    }
};
exports.addItemToCart = addItemToCart;
const viewCart = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        const cart = await (0, cartModel_1.getCart)(userId);
        res.status(200).json({ success: true, cart });
    }
    catch (error) {
        next(error);
    }
};
exports.viewCart = viewCart;
const removeItemFromCart = async (req, res, next) => {
    try {
        const cartId = parseInt(req.query.id, 10);
        if (!cartId) {
            res.status(400).json({ error: 'Cart ID is required' });
            return;
        }
        await (0, cartModel_1.removeFromCart)(cartId);
        res.status(200).json({ success: true, message: 'Item removed from cart' });
    }
    catch (error) {
        next(error);
    }
};
exports.removeItemFromCart = removeItemFromCart;
const updateCartItem = async (req, res, next) => {
    try {
        const { id, quantity } = req.body;
        if (!id || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Cart ID and positive quantity are required' });
            return;
        }
        await (0, cartModel_1.updateCartQuantity)(id, quantity);
        res.status(200).json({ success: true, message: 'Cart item updated' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItem = updateCartItem;
const getCartTotalHandler = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: No user ID provided' });
            return;
        }
        const total = await (0, cartModel_1.getCartTotal)(userId);
        res.status(200).json({ success: true, total: total.toFixed(2) });
    }
    catch (error) {
        next(error);
    }
};
exports.getCartTotalHandler = getCartTotalHandler;
