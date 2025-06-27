import User from "../models/User.js";
import redisClient from "../services/redis.service.js";

const addToCart = async (req, res) => {
    try {
        const { userid, itemId } = req.body;
        
        // Try to get user data from cache first
        let userData = await redisClient.getUser(userid);
        
        if (!userData) {
            userData = await User.findOne({ _id: userid });
            if (!userData) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            // Cache user data
            await redisClient.setUser(userid, userData);
        }

        let cartData = userData.cartData || {};
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        // Update user in database
        await User.findByIdAndUpdate(userid, { cartData });
        
        // Update cache
        userData.cartData = cartData;
        await redisClient.setUser(userid, userData);
        
        res.json({ success: true, message: "Added to cart" });
    } catch (err) {
        console.error("Error in addToCart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userid, itemId } = req.body;
        
        // Try to get user data from cache first
        let userData = await redisClient.getUser(userid);
        
        if (!userData) {
            userData = await User.findOne({ _id: userid });
            if (!userData) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            // Cache user data
            await redisClient.setUser(userid, userData);
        }

        let cartData = userData.cartData || {};
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        // Update user in database
        await User.findByIdAndUpdate(userid, { cartData });
        
        // Update cache
        userData.cartData = cartData;
        await redisClient.setUser(userid, userData);
        
        res.json({ success: true, message: "Removed from cart" });
    } catch (err) {
        console.error("Error in removeFromCart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const { userid } = req.body;
        
        // Try to get user data from cache first
        let userData = await redisClient.getUser(userid);
        
        if (!userData) {
            userData = await User.findOne({ _id: userid });
            if (!userData) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            // Cache user data
            await redisClient.setUser(userid, userData);
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (err) {
        console.error("Error in getCart:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export { addToCart, removeFromCart, getCart };