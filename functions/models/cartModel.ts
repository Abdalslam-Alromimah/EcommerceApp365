import { Pool } from 'pg';

// Use a single pool instance - either import or create locally, not both
import pool from '../utils/dbConnection';

export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
}

// Remove this duplicate pool declaration
// const pool = new Pool({...}); 

export const initCartTable = async (): Promise<void> => {
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
  await pool.query(query);
};

export const addToCart = async (userId: string, productId: number, quantity: number): Promise<void> => {
  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id) DO UPDATE
    SET quantity = cart.quantity + EXCLUDED.quantity
  `;
  await pool.query(query, [userId, productId, quantity]);
};

export const getCart = async (userId: string): Promise<CartItem[]> => {
  const query = `
    SELECT id, user_id as "userId", product_id as "productId", quantity
    FROM cart
    WHERE user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const removeFromCart = async (cartId: number): Promise<void> => {
  const query = 'DELETE FROM cart WHERE id = $1';
  await pool.query(query, [cartId]);
};

export const updateCartQuantity = async (cartId: number, quantity: number): Promise<void> => {
  const query = 'UPDATE cart SET quantity = $1 WHERE id = $2';
  await pool.query(query, [quantity, cartId]);
};

export const getCartTotal = async (userId: string): Promise<number> => {
  const cartQuery = `
    SELECT product_id, quantity
    FROM cart
    WHERE user_id = $1
  `;
  const cartResult = await pool.query(cartQuery, [userId]);
  let total = 0;
  for (const item of cartResult.rows) {
    const productQuery = 'SELECT price FROM products WHERE id = $1';
    const productResult = await pool.query(productQuery, [item.product_id]);
    total += productResult.rows[0].price * item.quantity;
  }
  return total;
};