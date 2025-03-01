import { Request, Response, NextFunction } from 'express';
import { addProduct as addProductModel, listProducts as listProductsModel, Product } from '../models/productModel';

// Rename local functions to avoid conflicts
export const addProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || !price || stock === undefined || stock < 0) {
      res.status(400).json({ error: 'Name, price, and non-negative stock are required' });
      return; // Explicitly return void
    }
    const newProduct = await addProductModel({ name, description, price: Number(price), stock });
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    next(error);
  }
};
export const listProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await listProductsModel();
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};