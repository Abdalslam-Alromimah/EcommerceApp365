"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.dbConfig = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_db',
    password: process.env.DB_PASSWORD || 'sql', // Add a default password
    port: parseInt(process.env.DB_PORT || '5432', 10),
};
const pool = new pg_1.Pool(exports.dbConfig);
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connected successfully');
        client.release();
    }
    catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};
exports.testConnection = testConnection;
exports.default = pool;
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
