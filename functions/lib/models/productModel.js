"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.listProducts = exports.initProductsTable = void 0;
// Use a single pool instance - either import or create locally, not both
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
// Remove this duplicate pool declaration
// const pool = new Pool({...});
const initProductsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INTEGER NOT NULL
    )
  `;
    await dbConnection_1.default.query(query);
};
exports.initProductsTable = initProductsTable;
const listProducts = async () => {
    const query = 'SELECT * FROM products';
    const result = await dbConnection_1.default.query(query);
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        stock: row.stock,
    }));
};
exports.listProducts = listProducts;
const addProduct = async (product) => {
    const query = `
    INSERT INTO products (name, description, price, stock)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const values = [product.name, product.description, product.price, product.stock];
    const result = await dbConnection_1.default.query(query, values);
    return result.rows[0];
};
exports.addProduct = addProduct;
