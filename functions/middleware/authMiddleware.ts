import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; // Set user on request object
    next();
  } catch (error: any) { // Use 'any' or a specific error type (e.g., Error)
    res.status(401).json({ error: `Unauthorized: ${error.message || 'Invalid token'}` });
    return;
  }
};