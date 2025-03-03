import { Request, Response, NextFunction } from 'express';
import { addToCart, getCart, CartItem, removeFromCart, updateCartQuantity, getCartTotal as getCartTotalModel } from '../models/cartModel';

// Extend Request to include user from authMiddleware
declare module 'express' {
  interface Request {
    user?: {
      uid: string;
    };
  }
}

export const addItemToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ error: 'Product ID and positive quantity are required' });
      return;
    }

    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }

    await addToCart(userId, productId, quantity);
    const cart = await getCart(userId);
    res.status(201).json({ success: true, cartItem: cart.find(item => item.productId === productId) });
  } catch (error) {
    next(error);
  }
};

export const viewCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }

    const cart = await getCart(userId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cartId = parseInt(req.query.id as string, 10);
    if (!cartId) {
      res.status(400).json({ error: 'Cart ID is required' });
      return;
    }
    await removeFromCart(cartId);
    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, quantity } = req.body;
    if (!id || !quantity || quantity <= 0) {
      res.status(400).json({ error: 'Cart ID and positive quantity are required' });
      return;
    }
    await updateCartQuantity(id, quantity);
    res.status(200).json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    next(error);
  }
};

export const getCartTotalHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: No user ID provided' });
      return;
    }

    const total = await getCartTotalModel(userId);
    res.status(200).json({ success: true, total: total.toFixed(2) });
  } catch (error) {
    next(error);
  }
};