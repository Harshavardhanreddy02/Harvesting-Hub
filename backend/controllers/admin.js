import User from "../models/User.js";
import productModel from "../models/Product.js";
import Order from "../models/Order.js";
import bcryptjs from "bcryptjs";
import Tool from "../models/Tool.js"; // Import the Tool model

// Helper function for error responses
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ success: false, message });
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, message: users });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, error.message);
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    console.log("Create user request body:", req.body);
    
    // Ensure role is lowercase to match enum
    if (req.body.role) {
      req.body.role = req.body.role.toLowerCase();
    }
    
    const newUser = new User(req.body);
    await newUser.save();
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Error creating user:", error);
    
    if (error.name === 'ValidationError') {
      // Send detailed validation error message
      return res.status(400).json({
        success: false,
        message: error.message,
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Error creating user"
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Log all incoming request details
    console.log('Full request params:', req.params);
    console.log('Full request body:', req.body);
    console.log('Request headers:', req.headers);

    // Normalize role to lowercase
    if (updateData.role) {
      updateData.role = updateData.role.toLowerCase();
    }

    console.log(`Attempting to update user with ID: ${id}`);
    console.log(`Detailed update data:`, JSON.stringify(updateData, null, 2));

    // Check if the user exists before updating
    const existingUser = await User.findById(id);
    if (!existingUser) {
      console.warn(`User with ID ${id} does not exist in the database.`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      console.warn(`Failed to update user with ID ${id}.`);
      return res.status(500).json({ success: false, message: "Failed to update user" });
    }

    console.log(`Successfully updated user with ID: ${id}`);
    res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Comprehensive error updating user:", error);
    res.status(500).json({ 
      success: false, 
      message: `Error updating user: ${error.message}`,
      errorDetails: error.toString(),
      stack: error.stack
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, error.message);
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalTools = await Tool.countDocuments(); // Calculate total tools
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalTools, // Include total tools in the response
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.log(error.message)
  }
};

// Get user growth data
export const getUserGrowthData = async (req, res) => {
  try {
    const userGrowthData = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = userGrowthData.map((data) => data._id);
    const users = userGrowthData.map((data) => data.totalUsers);

    res.json({
      success: true,
      data: { labels, users },
    });
  } catch (error) {
    console.log(error.message)
  }
};

// Get revenue data
export const getRevenueData = async (req, res) => {
    const { period } = req.query;
    let startDate;
  
    switch (period) {
      case "1day":
        startDate = new Date(new Date().setDate(new Date().getDate() - 1));
        break;
      case "1week":
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        break;
      case "1month":
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
        break;
      case "6months":
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
        break;
      case "1year":
        startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
        break;
      case "all":
      default:
        startDate = new Date(0);
        break;
    }
  
    try {
      const orders = await Order.find({ createdAt: { $gte: startDate } });
      const revenueData = {};
  
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (!revenueData[date]) revenueData[date] = 0;
        revenueData[date] += order.amount;
      });
  
      const labels = Object.keys(revenueData);
      const revenue = Object.values(revenueData);
  
      res.json({
        success: true,
        data: { labels, revenue },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error fetching revenue data" });
    }
  };

// Get top sellers
export const getTopSellers = async (req, res) => {
  try {
    const sellers = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.email",
          name: { $first: "$items.name" },
          stock: { $sum: "$items.stockQuantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    res.json({ success: true, data: sellers });
  } catch (error) {
    console.log(error.message);
    
  }
};

// Add these new functions
export const getOrderStats = async (req, res) => {
    try {
        const pending = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } });
        const completed = await Order.countDocuments({ status: { $in: ['delivered', 'completed'] } });
        const cancelled = await Order.countDocuments({ status: 'cancelled' });
        const total = await Order.countDocuments();
        
        res.json({ 
            success: true, 
            stats: {
                total,
                pending,
                completed,
                cancelled
            }
        });
    } catch (error) {
        console.error('Error calculating order stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userid', 'user_name email')
            .lean();

        // Format orders to match the structure expected by the admin dashboard
        const formattedOrders = recentOrders.map(order => ({
            _id: order._id,
            userId: {
                name: order.userid?.user_name || "Guest User"
            },
            totalAmount: order.amount,
            status: order.status || 'pending',
            createdAt: order.createdAt
        }));

        res.json({
            success: true,
            orders: formattedOrders
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching recent orders'
        });
    }
};