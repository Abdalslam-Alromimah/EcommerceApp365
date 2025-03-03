// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { createUser, getUser, listUsers, User } from '../models/userModel';

declare module 'express' {
  interface Request {
    user?: { uid: string };
  }
}

export const createUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { uid, email, displayName } = req.body;
    if (!uid) {
      res.status(400).json({ error: 'UID is required' });
      return;
    }
    const newUser = await createUser({ uid, email, displayName });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    next(error);
  }
};

export const getUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }
    const user = await getUser(uid);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const listUsersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await listUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};