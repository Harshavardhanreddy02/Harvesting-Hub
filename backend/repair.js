import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function repairData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://harshavardhanreddyv22:harsha8485@cluster0.0gmulll.mongodb.net/harvesthub?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');

        // Find all products with invalid ratings
        const products = await Product.find({});
        let repaired = 0;
        
        console.log(`Checking ${products.length} products for data issues...`);
        
        for (const product of products) {
            let needsUpdate = false;
            
            // Check if ratings is a number or other invalid format
            if (typeof product.ratings !== 'object' || product.ratings === null) {
                console.log(`Fixing product ${product._id}: Invalid ratings type`);
                product.ratings = {
                    averageRating: 0,
                    totalRatings: 0,
                    ratingDetails: []
                };
                needsUpdate = true;
            }
            // Check if ratings exists but ratingDetails is missing
            else if (!product.ratings.ratingDetails) {
                console.log(`Fixing product ${product._id}: Missing ratingDetails`);
                product.ratings.ratingDetails = [];
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await product.save();
                repaired++;
            }
        }
        
        console.log(`Repair complete. Fixed ${repaired} products.`);
    } catch (error) {
        console.error('Error repairing data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the repair function
repairData();
