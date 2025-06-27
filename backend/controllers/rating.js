import Rating from '../models/Rating.js';  // Changed from import Rating
import Product from '../models/Product.js';

// Get average rating for admin dashboard
export const getAverageRating = async (req, res) => {
    try {
        // Calculate average rating across all products
        const ratingStats = await Rating.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        // If no ratings exist
        if (ratingStats.length === 0) {
            return res.status(200).json({ success: true, average: 0, count: 0 });
        }

        const { averageRating, totalRatings } = ratingStats[0];
        
        return res.status(200).json({
            success: true, 
            average: averageRating || 0, 
            count: totalRatings || 0
        });
    } catch (error) {
        console.error("Error calculating average rating:", error);
        return res.status(500).json({ success: false, message: "Failed to calculate average rating" });
    }
};

// Create a new rating
export const createRating = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // Assuming authenticated user

        // Check if user has already rated this product
        const existingRating = await Rating.findOne({ userId, productId });
        if (existingRating) {
            return res.status(400).json({ success: false, message: 'You have already rated this product' });
        }

        // Create new rating
        const newRating = new Rating({
            userId,
            productId,
            rating,
            comment
        });

        await newRating.save();

        // Update product's average rating
        const productRatings = await Rating.find({ productId });
        const averageRating = productRatings.reduce((acc, curr) => acc + curr.rating, 0) / productRatings.length;

        // Optional: Update product with new average rating
        // await Product.findByIdAndUpdate(productId, { 'ratings.averageRating': averageRating });

        return res.status(201).json({ success: true, rating: newRating, averageRating });
    } catch (error) {
        console.error('Error creating rating:', error);
        return res.status(500).json({ success: false, message: 'Failed to create rating' });
    }
};

// Get ratings for a specific product
export const getRatingsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const ratings = await Rating.find({ productId }).populate('userId', 'name');
        
        return res.status(200).json({ success: true, ratings });
    } catch (error) {
        console.error('Error fetching product ratings:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
    }
};

// Update a rating
export const updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id; // Assuming authenticated user

        const existingRating = await Rating.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({ success: false, message: 'Rating not found' });
        }

        // Ensure only the rating owner can update
        if (existingRating.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this rating' });
        }

        existingRating.rating = rating;
        existingRating.comment = comment;
        await existingRating.save();

        // Recalculate average rating for the product
        const productRatings = await Rating.find({ productId: existingRating.productId });
        const averageRating = productRatings.reduce((acc, curr) => acc + curr.rating, 0) / productRatings.length;

        return res.status(200).json({ success: true, rating: existingRating, averageRating });
    } catch (error) {
        console.error('Error updating rating:', error);
        return res.status(500).json({ success: false, message: 'Failed to update rating' });
    }
};

// Delete a rating
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const userId = req.user.id; // Assuming authenticated user

        const existingRating = await Rating.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({ success: false, message: 'Rating not found' });
        }

        // Ensure only the rating owner can delete
        if (existingRating.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this rating' });
        }

        const productId = existingRating.productId;
        await existingRating.deleteOne();

        // Recalculate average rating for the product
        const productRatings = await Rating.find({ productId });
        const averageRating = productRatings.length 
            ? productRatings.reduce((acc, curr) => acc + curr.rating, 0) / productRatings.length 
            : 0;

        return res.status(200).json({ success: true, message: 'Rating deleted', averageRating });
    } catch (error) {
        console.error('Error deleting rating:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete rating' });
    }
};