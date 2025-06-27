import express from 'express';
import { verifyToken as authMiddleware } from '../middleware/auth.js';
import { listOrders, placeOrder,updateStatus,userOrders, verifyOrder, getOrderCount, getOrderRevenue, getOrderStats } from '../controllers/order.js';
import Order from '../models/Order.js';

const orderRouter = express.Router();

orderRouter.get("/list",listOrders);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/status",updateStatus);
orderRouter.post("/verify",verifyOrder);

// Get user order statistics
orderRouter.get("/user-stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userid;
    const totalOrders = await Order.countDocuments({ userId });
    const pendingOrders = await Order.countDocuments({ userId, status: 'pending' });
    const completedOrders = await Order.countDocuments({ userId, status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ userId, status: 'cancelled' });

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats' });
  }
});

// Add new endpoints for the admin dashboard
orderRouter.get("/count", getOrderCount);
orderRouter.get("/revenue", getOrderRevenue);
orderRouter.get("/stats", getOrderStats);

export default orderRouter;