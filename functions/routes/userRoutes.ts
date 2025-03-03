// src/routes/userRoutes.ts
import { Router, RequestHandler } from 'express';
import { createUserHandler, getUserHandler, listUsersHandler } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import pool from '../utils/dbConnection';

const router = Router();

router.post('/register', createUserHandler); // Public endpoint to create user
router.get('/me', authMiddleware, getUserHandler); // Protected: Get current user
router.get('/', listUsersHandler); // Public: Get all users

// Define the handler function with explicit RequestHandler type
const getUserByDisplayName: RequestHandler = async (req, res, next) => {
  try {
    const displayName = req.params.displayName;
    const query = `
      SELECT uid, email, display_name as "displayName", created_at as "createdAt"
      FROM users
      WHERE display_name = $1
    `;
    const result = await pool.query(query, [displayName]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user by displayName:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Endpoint to get user by displayName
router.get('/:displayName', getUserByDisplayName);

export default router;