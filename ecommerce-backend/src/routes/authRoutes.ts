import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

router.post('/login', login);

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

export default router;