"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/login', authController_1.login);
// Development-only debug endpoint
if (process.env.NODE_ENV !== 'production') {
    router.post('/debug-login', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Debug login successful (no token verification)',
            user: {
                uid: 'test-user-123',
                email: 'test@example.com',
                displayName: 'Test User',
            },
        });
    });
}
exports.default = router;
