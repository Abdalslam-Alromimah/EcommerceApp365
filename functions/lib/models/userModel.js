"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.getUser = exports.createUser = exports.initUsersTable = void 0;
// src/models/userModel.ts
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
const initUsersTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      uid VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      display_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await dbConnection_1.default.query(query);
};
exports.initUsersTable = initUsersTable;
const createUser = async (user) => {
    const query = `
    INSERT INTO users (uid, email, display_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid) DO UPDATE
    SET email = EXCLUDED.email, display_name = EXCLUDED.display_name
    RETURNING *
  `;
    const values = [user.uid, user.email, user.displayName];
    const result = await dbConnection_1.default.query(query, values);
    return {
        uid: result.rows[0].uid,
        email: result.rows[0].email,
        displayName: result.rows[0].display_name,
        createdAt: result.rows[0].created_at,
    };
};
exports.createUser = createUser;
const getUser = async (uid) => {
    const query = `
    SELECT uid, email, display_name as "displayName", created_at as "createdAt"
    FROM users
    WHERE uid = $1
  `;
    const result = await dbConnection_1.default.query(query, [uid]);
    return result.rows.length > 0 ? result.rows[0] : null;
};
exports.getUser = getUser;
const listUsers = async () => {
    const query = `
    SELECT uid, email, display_name as "displayName", created_at as "createdAt"
    FROM users
  `;
    const result = await dbConnection_1.default.query(query);
    return result.rows;
};
exports.listUsers = listUsers;
