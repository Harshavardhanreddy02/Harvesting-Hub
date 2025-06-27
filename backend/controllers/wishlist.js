// routes/wishlist.js
import express from "express"
const router = express.Router();
import Wishlist from '../models/Wishlist.js'
import User from "../models/User.js";
import Product from "../models/Product.js";

const addToWishlist = async (req, res) => {
    const { userid, productId } = req.body;
  
    try {
      const newWishlistItem = new Wishlist({ userid, productId });
      await newWishlistItem.save();
      res.json({success:true, message: 'Product added to wishlist!' });
    } catch (error) {
      res.json({success:false, message: 'Error adding product to wishlist', error });
    }
  };
  
  // Remove product from wishlist
  const removeFromWishlist = async (req, res) => {
    const { userid, productId } = req.body;
  
    try {
      await Wishlist.findOneAndDelete({ userid, productId });
      res.json({ success:true,message: 'Product removed from wishlist!' });
    } catch (error) {
      res.json({ success:false,message: 'Error removing product from wishlist', error });
    }
  };
  
  // Get user's wishlist items
export const fetchWishlistItems = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Authentication error" });
    }
    
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // Find the user with populated wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.wishlist || user.wishlist.length === 0) {
      return res.json({ success: true, items: [] });
    }

    // Fetch the product details for each wishlist item
    const wishlistItems = await Product.find({ 
      _id: { $in: user.wishlist }
    });
    
    // Filter items based on user role
    const filteredItems = wishlistItems.filter(item => {
      if (userRole === 'Farmer') {
        return item.type === 'tool';
      } else {
        return item.type === 'product';
      }
    });

    console.log(`Found ${filteredItems.length} items for ${userRole} user`);
    
    return res.json({ success: true, items: filteredItems });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Toggle item in wishlist (add if not present, remove if present)
export const toggleWishlist = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!req.user || !req.user._id) {
      console.error("User not found in request:", req.user);
      return res.status(401).json({ success: false, message: "Authentication error" });
    }
    
    const userId = req.user._id;
    console.log(`Toggle wishlist request - userId: ${userId}, itemId: ${itemId}`);

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    // Find the user without validation
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize wishlist array if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if item is already in wishlist
    const itemIndex = user.wishlist.indexOf(itemId);
    
    if (itemIndex > -1) {
      // Item exists, remove it
      user.wishlist.splice(itemIndex, 1);
      await User.findByIdAndUpdate(userId, { wishlist: user.wishlist }, { runValidators: false });
      return res.json({ success: true, message: "Item removed from wishlist", inWishlist: false });
    } else {
      // Item doesn't exist, add it
      user.wishlist.push(itemId);
      await User.findByIdAndUpdate(userId, { wishlist: user.wishlist }, { runValidators: false });
      return res.json({ success: true, message: "Item added to wishlist", inWishlist: true });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Authentication error" });
    }
    
    const userId = req.user._id;
    
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId, 
      { $set: { wishlist: [] } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    return res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

  export { addToWishlist, removeFromWishlist, fetchWishlistItems as getWishlistItems }