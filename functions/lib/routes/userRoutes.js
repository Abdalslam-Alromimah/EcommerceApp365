"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const dbConnection_1 = __importDefault(require("../utils/dbConnection"));
const router = (0, express_1.Router)();
router.post('/register', userController_1.createUserHandler); // Public endpoint to create user
router.get('/me', authMiddleware_1.authMiddleware, userController_1.getUserHandler); // Protected: Get current user
router.get('/', userController_1.listUsersHandler); // Public: Get all users
// Define the handler function with explicit RequestHandler type
const getUserByDisplayName = async (req, res, next) => {
    try {
        const displayName = req.params.displayName;
        const query = `
      SELECT uid, email, display_name as "displayName", created_at as "createdAt"
      FROM users
      WHERE display_name = $1
    `;
        const result = await dbConnection_1.default.query(query, [displayName]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user: result.rows[0] });
    }
    catch (error) {
        console.error('Error fetching user by displayName:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Endpoint to get user by displayName
router.get('/:displayName', getUserByDisplayName);
exports.default = router;
