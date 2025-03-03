"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrdersByUser = exports.getOrder = exports.createOrder = exports.initOrdersTable = void 0;
// src/models/orderModel.ts
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
const initOrdersTable = async () => {
    const orderQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE
    )
  `;
    const orderItemsQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    )
  `;
    try {
        await dbConnection_1.default.query(orderQuery);
        await dbConnection_1.default.query(orderItemsQuery);
    }
    catch (error) {
        console.error('Error initializing orders tables:', error);
        throw error;
    }
};
exports.initOrdersTable = initOrdersTable;
/**
 * Creates an order with associated items from the cart.
 * @param userId The user's unique identifier
 * @param items The order items with product details
 * @returns The created order
 */
const createOrder = async (userId, items) => {
    const client = await dbConnection_1.default.connect();
    try {
        await client.query('BEGIN');
        // Calculate total (using provided prices from orderItems)
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Insert order
        const orderQuery = `
      INSERT INTO orders (user_id, total, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
    `;
        const orderResult = await client.query(orderQuery, [userId, total]);
        const orderId = orderResult.rows[0].id;
        // Insert order items
        const itemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        for (const item of items) {
            const itemResult = await client.query(itemQuery, [
                orderId,
                item.productId,
                item.quantity,
                item.price,
            ]);
            console.log('Order item inserted:', itemResult.rows[0]);
        }
        await client.query('COMMIT');
        return {
            id: orderResult.rows[0].id,
            userId: orderResult.rows[0].user_id,
            total: parseFloat(orderResult.rows[0].total),
            status: orderResult.rows[0].status,
            createdAt: orderResult.rows[0].created_at,
        };
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.createOrder = createOrder;
/**
 * Retrieves a specific order and its items by order ID.
 * @param orderId The ID of the order to retrieve
 * @returns The order and its items, or null if not found
 */
const getOrder = async (orderId) => {
    const orderQuery = `
    SELECT id, user_id as "userId", total, status, created_at as "createdAt"
    FROM orders
    WHERE id = $1
  `;
    const itemsQuery = `
    SELECT id, order_id as "orderId", product_id as "productId", quantity, price
    FROM order_items
    WHERE order_id = $1
  `;
    try {
        const orderResult = await dbConnection_1.default.query(orderQuery, [orderId]);
        if (orderResult.rows.length === 0)
            return null;
        const itemsResult = await dbConnection_1.default.query(itemsQuery, [orderId]);
        return {
            order: {
                id: orderResult.rows[0].id,
                userId: orderResult.rows[0].userId,
                total: parseFloat(orderResult.rows[0].total),
                status: orderResult.rows[0].status,
                createdAt: new Date(orderResult.rows[0].createdAt),
            },
            items: itemsResult.rows.map((row) => ({
                id: row.id,
                orderId: row.orderId,
                productId: row.productId,
                quantity: row.quantity,
                price: parseFloat(row.price),
            })),
        };
    }
    catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};
exports.getOrder = getOrder;
/**
 * Lists all orders for a specific user.
 * @param userId The user's unique identifier
 * @returns A list of orders for the user
 */
const listOrdersByUser = async (userId) => {
    const query = `
    SELECT id, user_id as "userId", total, status, created_at as "createdAt"
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
    try {
        const result = await dbConnection_1.default.query(query, [userId]);
        return result.rows.map((row) => ({
            id: row.id,
            userId: row.userId,
            total: parseFloat(row.total),
            status: row.status,
            createdAt: new Date(row.createdAt),
        }));
    }
    catch (error) {
        console.error('Error listing orders:', error);
        throw error;
    }
};
exports.listOrdersByUser = listOrdersByUser;
