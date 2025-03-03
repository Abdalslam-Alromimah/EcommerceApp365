import { Pool } from 'pg';

// Use a single pool instance - either import or create locally, not both
import pool from '../utils/dbConnection';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

// Remove this duplicate pool declaration
// const pool = new Pool({...});

export const initProductsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INTEGER NOT NULL
    )
  `;
  await pool.query(query);
};

export const listProducts = async (): Promise<Product[]> => {
  const query = 'SELECT * FROM products';
  const result = await pool.query(query);
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    stock: row.stock,
  }));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const query = `
    INSERT INTO products (name, description, price, stock)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [product.name, product.description, product.price, product.stock];
  const result = await pool.query(query, values);
  return result.rows[0];
};