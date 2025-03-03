// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

import { createUser, getUser } from '../models/userModel';

// Define the expected request body shape
interface LoginRequestBody {
  idToken: string;
}

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({ error: 'ID token is required' });
      return;
    }

    console.log('Token received:', typeof idToken, `${idToken.substring(0, 10)}...`);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email || null;
    const displayName = decodedToken.name || null;

    // Check if user exists; create or update if not
    let user = await getUser(uid);
    if (!user) {
      try {
        user = await createUser({ uid, email, displayName });
      } catch (createError: any) {
        if (createError.code === '23505' && createError.constraint === 'users_email_key') {
          res.status(409).json({ 
            error: 'Email already in use', 
            details: `The email ${email} is already associated with another user.` 
          });
          return;
        }
        throw createError; // Re-throw other errors
      }
    } else if (user.email !== email || user.displayName !== displayName) {
      try {
        user = await createUser({ uid, email, displayName }); // Updates via ON CONFLICT
      } catch (updateError: any) {
        if (updateError.code === '23505' && updateError.constraint === 'users_email_key') {
          res.status(409).json({ 
            error: 'Email already in use', 
            details: `The email ${email} cannot be updated as it’s associated with another user.` 
          });
          return;
        }
        throw updateError; // Re-throw other errors
      }
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        uid,
        email,
        displayName,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/id-token-revoked') {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    if (error.code === 'auth/argument-error') {
      res.status(400).json({ 
        error: 'Invalid token format', 
        details: 'The token provided could not be decoded as a valid Firebase ID token.'
      });
      return;
    }
    next(error); // Pass unexpected errors to Express error handler
  }
};