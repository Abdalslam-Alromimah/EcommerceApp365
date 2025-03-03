// src/models/userModel.ts
import pool from '../utils/dbConnection';

export interface User {
  uid: string; // Firebase UID as primary key
  email: string | null;
  displayName: string | null;
  createdAt: Date;
}

export const initUsersTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      uid VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      display_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

export const createUser = async (user: Omit<User, 'createdAt'>): Promise<User> => {
  const query = `
    INSERT INTO users (uid, email, display_name)
    VALUES ($1, $2, $3)
    ON CONFLICT (uid) DO UPDATE
    SET email = EXCLUDED.email, display_name = EXCLUDED.display_name
    RETURNING *
  `;
  const values = [user.uid, user.email, user.displayName];
  const result = await pool.query(query, values);
  return {
    uid: result.rows[0].uid,
    email: result.rows[0].email,
    displayName: result.rows[0].display_name,
    createdAt: result.rows[0].created_at,
  };
};

export const getUser = async (uid: string): Promise<User | null> => {
  const query = `
    SELECT uid, email, display_name as "displayName", created_at as "createdAt"
    FROM users
    WHERE uid = $1
  `;
  const result = await pool.query(query, [uid]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const listUsers = async (): Promise<User[]> => {
  const query = `
    SELECT uid, email, display_name as "displayName", created_at as "createdAt"
    FROM users
  `;
  const result = await pool.query(query);
  return result.rows;
};