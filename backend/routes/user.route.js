import express from 'express';
import { getUserProfile, updateProfile, getUserCount } from '../controllers/user.js';
import { verifyToken as authMiddleware, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Update the get-user-profile route to use authMiddleware
router.get('/get-user-profile', authMiddleware, getUserProfile);
router.post('/update-profile', authMiddleware, updateProfile);

// Add a simple health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Add GET profile endpoint
router.get("/profile", authMiddleware, getUserProfile);

// Keep existing routes but add the missing ones
router.post("/get-user-profile", authMiddleware, getUserProfile);
router.get("/profile", authMiddleware, getUserProfile); // Add this as an alternative

// Add the count endpoint
router.get("/count", getUserCount);

// Add a middleware to capture raw body for debugging
router.use(['/update-profile', '/profile/update'], (req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  
  req.on('end', () => {
    req.rawBody = data;
    console.log(`Raw request body for ${req.path}:`, data.length > 500 ? data.substring(0, 500) + '...' : data);
    next();
  });
});

// Ensure both endpoints work for profile updates and use the imported verifyToken middleware
router.post('/update-profile', verifyToken, updateProfile);
router.post('/profile/update', verifyToken, updateProfile);

export default router;