import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { verifyToken as authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// User count
router.get('/user/count', authMiddleware, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order count
router.get('/order/count', authMiddleware, async (req, res) => {
  try {
    // Since we don't have OrderModel, return fallback data
    res.json({ count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product count
router.get('/product/count', authMiddleware, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tool count
router.get('/tool/count', authMiddleware, async (req, res) => {
  try {
    // Since we don't have Tool, return fallback data
    res.json({ count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Revenue
router.get('/order/revenue', authMiddleware, async (req, res) => {
  try {
    // Return fallback data for revenue
    res.json({ revenue: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order statistics
router.get('/orders/stats', authMiddleware, async (req, res) => {
  try {
    // Return fallback data for order stats
    res.json({ pendingOrders: 0, deliveredOrders: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Best sellers
router.get('/products/best-sellers', authMiddleware, async (req, res) => {
  try {
    // Return top 5 products (or empty array if none exist)
    const bestSellers = await Product.find().limit(5);
    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Monthly sales
router.get('/sales/monthly', authMiddleware, async (req, res) => {
  try {
    // Return array of zeros for monthly sales
    const monthlySales = Array(12).fill(0);
    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Average rating
router.get('/rating/average', authMiddleware, async (req, res) => {
  try {
    // Return fallback rating
    res.json({ average: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Make sure all these routes are available
router.get('/user/count', (req, res) => {
  res.json({ count: 0 });
});

router.get('/order/count', (req, res) => {
  res.json({ count: 0 });
});

router.get('/product/count', (req, res) => {
  res.json({ count: 0 });
});

router.get('/tool/count', (req, res) => {
  res.json({ count: 0 });
});

router.get('/order/revenue', (req, res) => {
  res.json({ revenue: 0 });
});

router.get('/rating/average', (req, res) => {
  res.json({ average: 0 });
});

router.get('/orders/stats', (req, res) => {
  res.json({ pendingOrders: 0, deliveredOrders: 0 });
});

router.get('/products/best-sellers', (req, res) => {
  res.json([]);
});

router.get('/sales/monthly', (req, res) => {
  res.json(Array(12).fill(0));
});

export default router;
