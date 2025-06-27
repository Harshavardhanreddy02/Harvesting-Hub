import express from 'express';
import { 
    createRating, 
    getAverageRating, 
    getRatingsByProduct, 
    updateRating, 
    deleteRating 
} from '../controllers/rating.js';
import { verifyToken, authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Create a new rating
router.post('/', authenticateUser, createRating);

// Get average rating for a product
router.get('/average', getAverageRating);

// Get ratings for a specific product
router.get('/:productId', getRatingsByProduct);

// Update a rating
router.put('/:ratingId', authenticateUser, updateRating);

// Delete a rating
router.delete('/:ratingId', authenticateUser, deleteRating);

const ratingRouter = express.Router();

// Use both middleware
ratingRouter.post('/add', verifyToken, authenticateUser, createRating);

export default router;
export { ratingRouter };
