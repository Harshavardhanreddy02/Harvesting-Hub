import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getUserById, getAllUsers, deleteUser, updateUser, getUserProfileByToken, updateUserProfileByToken } from '../controllers/user.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);
router.route('/get-profile').get(protect, getUserProfileByToken);
router.route('/update-profile').post(protect, updateUserProfileByToken);

// Add a middleware to capture raw body for debugging
router.use('/update-profile', (req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  
  req.on('end', () => {
    req.rawBody = data;
    console.log('Received update profile request FULL:', {
      body: req.body,
      user: req.user,
      headers: req.headers,
      rawBody: data.length > 500 ? data.substring(0, 500) + '...' : data
    });
    next();
  });
});

export default router;