import express from "express";
import { toggleWishlist, fetchWishlistItems, clearWishlist } from "../controllers/wishlist.js";
import { verifyToken as authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Toggle an item in wishlist (add/remove)
router.post("/toggle", authMiddleware, toggleWishlist);

// Get all wishlist items
router.get("/items", authMiddleware, fetchWishlistItems);

// Clear wishlist
router.delete("/clear", authMiddleware, clearWishlist);

export default router;
