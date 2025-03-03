"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartTotal = exports.updateCartQuantity = exports.removeFromCart = exports.getCart = exports.addToCart = exports.initCartTable = void 0;
// Use a single pool instance - either import or create locally, not both
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
// Remove this duplicate pool declaration
// const pool = new Pool({...}); 
const initCartTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    )
  `;
    await dbConnection_1.default.query(query);
};
exports.initCartTable = initCartTable;
const addToCart = async (userId, productId, quantity) => {
    const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id) DO UPDATE
    SET quantity = cart.quantity + EXCLUDED.quantity
  `;
    await dbConnection_1.default.query(query, [userId, productId, quantity]);
};
exports.addToCart = addToCart;
const getCart = async (userId) => {
    const query = `
    SELECT id, user_id as "userId", product_id as "productId", quantity
    FROM cart
    WHERE user_id = $1
  `;
    const result = await dbConnection_1.default.query(query, [userId]);
    return result.rows;
};
exports.getCart = getCart;
const removeFromCart = async (cartId) => {
    const query = 'DELETE FROM cart WHERE id = $1';
    await dbConnection_1.default.query(query, [cartId]);
};
exports.removeFromCart = removeFromCart;
const updateCartQuantity = async (cartId, quantity) => {
    const query = 'UPDATE cart SET quantity = $1 WHERE id = $2';
    await dbConnection_1.default.query(query, [quantity, cartId]);
};
exports.updateCartQuantity = updateCartQuantity;
const getCartTotal = async (userId) => {
    const cartQuery = `
    SELECT product_id, quantity
    FROM cart
    WHERE user_id = $1
  `;
    const cartResult = await dbConnection_1.default.query(cartQuery, [userId]);
    let total = 0;
    for (const item of cartResult.rows) {
        const productQuery = 'SELECT price FROM products WHERE id = $1';
        const productResult = await dbConnection_1.default.query(productQuery, [item.product_id]);
        total += productResult.rows[0].price * item.quantity;
    }
    return total;
};
exports.getCartTotal = getCartTotal;
