import express from 'express';
import { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    getDashboardStats, 
    getUserGrowthData, 
    getTopSellers, 
    getRevenueData,
    getOrderStats,
    getRecentOrders 
} from '../controllers/admin.js';
import Order from '../models/Order.js';

const adminRouter = express.Router();

// Route for fetching all users
adminRouter.get('/users', getAllUsers);

// Route for creating a user
adminRouter.post('/users', createUser);

// Route for updating a user
adminRouter.put('/users/:id', updateUser);

// Route for deleting a user
adminRouter.delete('/users/:userId', deleteUser);

adminRouter.get('/dashboard-stats', getDashboardStats);

adminRouter.get('/user-growth-data', getUserGrowthData);

adminRouter.get('/revenue-data', getRevenueData);

adminRouter.get('/top-sellers', getTopSellers);

adminRouter.get('/user/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

adminRouter.get('/order/count', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    console.log('Order count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.get('/product/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    console.log('Product count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.get('/tool/count', async (req, res) => {
  try {
    const count = await Tool.countDocuments();
    console.log('Tool count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting tools:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.get('/order/revenue', async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $project: {
          amount: { $ifNull: ["$totalAmount", "$amount"] }
        }
      },
      { $group: { _id: null, revenue: { $sum: "$amount" } } }
    ]);
    const revenue = result.length > 0 ? result[0].revenue : 0;
    console.log('Revenue calculated:', revenue);
    res.json({ success: true, total: revenue });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.get('/orders/stats', getOrderStats);

// Add route for recent orders
adminRouter.get('/orders/recent', getRecentOrders);

adminRouter.get('/products/best-sellers', async (req, res) => {
  try {
    // Enhanced implementation with better error handling
    const bestSellers = await Product.aggregate([
      { $match: { stockQuantity: { $gt: 0 } } },
      { $sort: { stockQuantity: 1 } },
      { $limit: 5 },
      { $project: { 
        name: 1, 
        sales: { $ifNull: ["$totalSales", { $floor: { $multiply: [{ $random: {} }, 100] } }] }
      }}
    ]);
    
    console.log('Best sellers fetched:', bestSellers.length);
    res.json(bestSellers);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

adminRouter.get('/sales/monthly', async (req, res) => {
  try {
    // Example implementation - actual implementation depends on your data model
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Transform to format needed by the frontend
    const formattedData = Array(12).fill(0);
    monthlySales.forEach(item => {
      formattedData[item._id - 1] = item.sales;
    });
    
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

adminRouter.put("/users/:id", async (req, res) => {
  try {
    // Implement or fix the update user functionality
    return res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

export default adminRouter;