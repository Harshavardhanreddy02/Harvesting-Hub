import Order from "../models/Order.js";
import User from "../models/User.js";
import productModel from "../models/Product.js";
import Tool from "../models/Tool.js";
import Product from "../models/Product.js"; // Import the Product model

const placeOrder = async (req, res) => {
  try {
    const { userid, items, totalAmount, address, paymentMethod } = req.body;

    // Validate input
    if (!userid || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    // Validate each item in the order and check stock
    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({ success: false, message: "Each item must have a valid productId." });
      }

      // Check stock availability
      let product = await Product.findById(item.productId);
      if (!product) {
        product = await Tool.findById(item.productId);
      }
      
      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.productId} not found` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
        });
      }
    }

    // Fetch product or tool details to populate `sellerEmail` and validate `productId`
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        let product = await Product.findById(item.productId);
        if (!product) {
          product = await Tool.findById(item.productId);
          if (!product) {
            throw new Error(`Product or Tool with ID ${item.productId} not found`);
          }
        }
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          sellerEmail: product.email,
          description: product.description,
          category: product.category,
          image: product.image,
        };
      })
    );

    // Create the order
    const order = new Order({
      userid,
      items: populatedItems,
      totalAmount,
      address,
      paymentMethod,
    });

    // Update stock quantities
    for (const item of populatedItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        product = await Tool.findById(item.productId);
      }
      
      if (product) {
        // Ensure we're using the correct quantity from the populated items
        const orderedQuantity = item.quantity;
        if (product.stockQuantity >= orderedQuantity) {
          product.stockQuantity -= orderedQuantity;
          await product.save();
          console.log(`Updated stock for ${product.name}: -${orderedQuantity} (New stock: ${product.stockQuantity})`);
        } else {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${orderedQuantity}`);
        }
      }
    }

    await order.save();
    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const timeFrames = {
      last30Min: new Date(Date.now() - 30 * 60 * 1000),
      last2Hours: new Date(Date.now() - 2 * 60 * 60 * 1000),
      last1Day: new Date(Date.now() - 24 * 60 * 60 * 1000),
      last1Week: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    };

    // Fetch all orders using original approach
    const allOrders = await Order.find({}).sort('-createdAt');
    
    // Log sample order to debug
    if (allOrders.length > 0) {
      console.log("Sample order:", JSON.stringify(allOrders[0], null, 2));
    }
    
    const metrics = {};

    // Calculate metrics for each filter
    for (const [key, time] of Object.entries(timeFrames)) {
      const orders = await Order.find({ createdAt: { $gte: time } });
      const totalOrders = orders.length;
      const revenueCollected = orders.reduce((total, order) => {
        // Use totalAmount if available, otherwise fall back to amount
        const orderAmount = order.totalAmount || order.amount || 0;
        return total + orderAmount;
      }, 0);
      const itemsSold = orders.reduce((total, order) => {
        return total + order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      }, 0);

      metrics[key] = { totalOrders, revenueCollected, itemsSold, orders };
    }

    // Aggregated data for all orders
    const allRevenue = allOrders.reduce((total, order) => {
      // Use totalAmount if available, otherwise fall back to amount
      const orderAmount = order.totalAmount || order.amount || 0;
      return total + orderAmount;
    }, 0);
    const allItemsSold = allOrders.reduce((total, order) => {
      return total + order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }, 0);

    res.json({
      success: true,
      allOrders,
      allMetrics: {
        totalOrders: allOrders.length,
        revenueCollected: allRevenue,
        itemsSold: allItemsSold,
      },
      metrics,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { userid } = req.body;

    // Validate userid
    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch orders for the specific user
    const orders = await Order.find({ userid }).sort({ createdAt: -1 });

    // Calculate counts for filtering
    const now = Date.now();
    const countLast60Min = orders.filter(
      (order) => new Date(order.createdAt) >= new Date(now - 60 * 60 * 1000)
    ).length;
    const countLast2Days = orders.filter(
      (order) => new Date(order.createdAt) >= new Date(now - 2 * 24 * 60 * 60 * 1000)
    ).length;
    const countLast1Week = orders.filter(
      (order) => new Date(order.createdAt) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
    ).length;

    res.status(200).json({
      success: true,
      message: {
        totalOrders: orders.length,
        countLast60Min,
        countLast2Days,
        countLast1Week,
        orders,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
      console.log("ok hjob");
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Not  Verified" });
  }
};

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Add order count method for AdminDashboard
export const getOrderCount = async (req, res) => {
    try {
        const count = await Order.countDocuments();
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error("Error fetching order count:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch order count" });
    }
};

// Get total revenue for admin dashboard
export const getOrderRevenue = async (req, res) => {
    try {
        const result = await Order.aggregate([
            // Match orders that are either 'delivered' or 'completed' (to handle both status types)
            { $match: { status: { $in: ["delivered", "completed"] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        const total = result.length > 0 ? result[0].total : 0;
        return res.status(200).json({ success: true, total });
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        return res.status(500).json({ success: false, message: "Failed to calculate total revenue" });
    }
};

// Get order statistics for admin dashboard
export const getOrderStats = async (req, res) => {
    try {
        const total = await Order.countDocuments();
        // For pending, include both 'pending' and 'processing' orders
        const pending = await Order.countDocuments({ status: { $in: ["pending", "processing"] } });
        // For completed, include both 'delivered' and 'completed' orders
        const completed = await Order.countDocuments({ status: { $in: ["delivered", "completed"] } });
        const cancelled = await Order.countDocuments({ status: "cancelled" });
        
        return res.status(200).json({
            success: true,
            total,
            pending,
            completed,
            cancelled
        });
    } catch (error) {
        console.error("Error fetching order statistics:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch order statistics" });
    }
};

export { placeOrder, listOrders, updateStatus, verifyOrder };
