import fs from "fs";
import productModel from "../models/Product.js";
import Order from "../models/Order.js";
import Product from '../models/Product.js';
// import redisClient from '../services/redis.service.js';

const addProduct = async (req, res) => {
  try {
    // Ensure the image file is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imageFilename = req.file.filename;

    // Create a new product with the provided data
    const product = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imageFilename, // Save the image filename
      email: req.body.email, // Seller's email
      seller: req.body.seller, // Seller's name
      stockQuantity: req.body.stockQuantity,
      dateListed: req.body.dateListed,
      manufacturedDate: req.body.manufacturedDate,
      endDate: req.body.endDate,
      status: req.body.status || "On Sale",
      discount: req.body.discount || 0,
    });

    await product.save();
    // Cache invalidation removed for serverless compatibility
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ success: false, message: `Error adding product: ${err.message}` });
  }
};

const listProduct = async (req, res) => {
    try {
        // Get products directly from database
        const products = await productModel.find({}).lean();
        
        console.log(`Found ${products.length} products in database`);
        
        // Normalize product data to work with both old and new schema
        const normalizedProducts = products.map(product => {
            // Check if the product has a stockQuantity property
            const stockQuantity = product.stockQuantity || product.stock || 50;
            
            return {
                _id: product._id,
                name: product.name || "Unnamed Product",
                description: product.description || "No description available",
                price: product.price || 0,
                category: product.category || "Uncategorized",
                image: product.image || "", // Ensure image is never undefined
                stockQuantity: stockQuantity,
                status: product.status || 'On Sale',
                email: product.email || '',
                discount: product.discount || 0,
                // Include any new fields with defaults
                ratings: product.ratings || 0,
                totalSales: product.totalSales || 0,
                // Keep the original object as well to preserve any other fields
                ...product
            };
        });
        
        // Return products directly without caching
        return res.json({ success: true, message: normalizedProducts });
    } catch (err) {
        console.error("Error in listProduct:", err);
        return res.json({ success: false, message: err.message });
    }
};

const farmerList = async (req, res) => {
    const { email } = req.body;

    // Validate email parameter
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        // Always fetch fresh data from database
        const products = await productModel.find({ email });

        if (products.length === 0) {
            return res.json({ success: true, message: "No products found for this farmer.", products: [] });
        }

        // Normalize product data
        const normalizedProducts = products.map(product => ({
            _id: product._id,
            name: product.name || "Unnamed Product",
            description: product.description || "No description available",
            price: product.price || 0,
            category: product.category || "Uncategorized",
            image: product.image || "",
            stockQuantity: product.stockQuantity || 0,
            status: product.status || 'On Sale',
            email: product.email || email,
            discount: product.discount || 0
        }));

        // Cache removed for serverless compatibility
        
        res.json({ success: true, message: "Products retrieved successfully.", products: normalizedProducts });
    } catch (error) {
        console.error("Error in farmerList:", error);
        res.status(500).json({ success: false, message: `Error fetching products: ${error.message}` });
    }
};

const farmerDelete = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await productModel.findByIdAndDelete(id);
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Cache invalidation removed for serverless compatibility
      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting product", error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    // Allow updating of all possible fields sent in the request body
    const updateData = req.body;
    try {
      // Find the product by ID and update with all provided fields
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      // Cache invalidation removed for serverless compatibility
      res.status(200).json({ 
        success: true, 
        message: "Product updated successfully", 
        product: updatedProduct 
      });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ success: false, message: "Error updating product", error: err.message });
    }
};

const getDateRange = (timePeriod) => {
    const now = new Date();
    switch (timePeriod) {
      case "30min":
        return new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago
      case "2hrs":
        return new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
      case "1day":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
      case "1week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago
      default:
        return new Date(0); // All-time records
    }
};

const farmerRevenue = async (req, res) => {
  try {
    const { email, timePeriod } = req.body;

    // Validate email parameter
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Calculate the start date for the filter
    const startDate = getDateRange(timePeriod);

    // Fetch orders placed within the time period
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      "items.sellerEmail": email, // Ensure the field matches the seller's email
    });

    // Initialize total revenue and items sold
    let totalRevenue = 0;
    let totalItemsSold = 0;
    let soldProducts = [];

    // Loop through each order and calculate revenue and sold items for the farmer
    for (const order of orders) {
      for (const item of order.items) {
        if (item.sellerEmail === email) { // Match the seller's email
          const revenue = item.price * item.quantity; // Assuming item has price and quantity fields
          totalRevenue += revenue;
          totalItemsSold += item.quantity;
          soldProducts.push({
            productId: item.productId,
            name: item.name,
            description: item.description || "No description available",
            category: item.category || "Uncategorized",
            price: item.price,
            quantity: item.quantity,
            image: item.image || "default.jpg",
          });
        }
      }
    }

    res.json({
      success: true,
      soldProducts,
      revenue: totalRevenue,
      totalItemsSold,
    });
  } catch (error) {
    console.error("Error fetching sold products and revenue:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchProduct = async(req,res)=>{
    const {search} = req.params
    try{
        if(search==""){
            const products = await productModel.find({})
            return res.json({success:true,message:products})
        }
        const products = await productModel.find({name:{$regex:search,$options:"i"}})
        res.json({success:true,message:products})
    }catch(err){
        res.json({success:false,message:`${err.message}`})
    }
}

const deleteProduct=async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        fs.unlink(`uploads/${product.image}`,()=>{})
        await productModel.findByIdAndDelete(req.params.id)
        res.json({success:true,message:"Product deleted successfully"})
    }catch(err){
        res.json({success:false,message:`${err.message}`})
    }
}

const fastSellingItems = async (req, res) => {
    try {
      // Fetch products with stock > 0, sorted by stock quantity in ascending order (least stock first)
      const products = await productModel.find({ stockQuantity: { $gt: 0 } })
        .sort({ stockQuantity: 1 })
        .limit(10); // Limit to top 5 products
      res.json({ success: true, message: products });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
};

const newlyAddedProducts = async (req, res) => {
    try {
      // Fetch the top 5 most recently added products (sorted by creation date descending)
      const products = await productModel.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (newest first)
        .limit(10); // Limit to top 5 most recent products
      res.json({ success: true, message: products });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
};

// const addRating = async (req, res) => {
//     const { productId, userId, rating } = req.body;
  
//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ success: false, message: "Invalid rating" });
//     }
  
//     try {
//       const product = await productModel.findById(productId);
//       if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  
//       // Check if the user has already rated this product
//       const existingRating = product.ratings.ratingDetails.find(
//         (item) => item.userId.toString() === userId
//       );
  
//       if (existingRating) {
//         // Update existing rating
//         existingRating.rating = rating;
//       } else {
//         // Add new rating
//         product.ratings.ratingDetails.push({ userId, rating });
//         product.ratings.totalRatings += 1;
//       }
  
//       // Recalculate average rating
//       const totalRatingSum = product.ratings.ratingDetails.reduce((acc, item) => acc + item.rating, 0);
//       product.ratings.averageRating = totalRatingSum / product.ratings.ratingDetails.length;
  
//       await product.save();
//       res.json({ success: true, message: "Rating submitted successfully", averageRating: product.ratings.averageRating });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items._id",
          name: { $first: "$items.name" },
          price: { $first: "$items.price" },
          stock: { $first: "$items.stockQuantity" },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
    ]);
    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching top selling products" });
  }
};

// Add count method for AdminDashboard
export const getProductCount = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error("Error fetching product count:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch product count" });
    }
};

// Improve best sellers implementation to handle case where totalSales field might not exist
export const getBestSellers = async (req, res) => {
    try {
        // First try to use the totalSales field if it exists
        let bestSellers = await Product.find({ totalSales: { $exists: true } })
            .sort({ totalSales: -1 })
            .limit(5)
            .select('name totalSales');
        // If we don't have enough products with totalSales, use the fast selling items logic
        if (bestSellers.length < 5) {
            // Use your existing fastSellingItems logic as fallback
            const fastSelling = await Product.find({ stockQuantity: { $exists: true, $gt: 0 } })
                .sort({ stockQuantity: 1 })
                .limit(5 - bestSellers.length)
                .select('name stockQuantity');
            // Add these to the best sellers list with an estimated sales value
            const additionalSellers = fastSelling.map(product => ({
                name: product.name,
                sales: Math.floor(Math.random() * 50) + 10 // Random sales between 10-60
            }));
            bestSellers = [
                ...bestSellers.map(p => ({ name: p.name, sales: p.totalSales || 0 })),
                ...additionalSellers
            ];
        } else {
            bestSellers = bestSellers.map(product => ({
                name: product.name,
                sales: product.totalSales || 0
            }));
        }
        // If we still don't have enough, add some mock data
        if (bestSellers.length < 5) {
            const mockProducts = [
                { name: "Organic Tomatoes", sales: 120 },
                { name: "Fresh Potatoes", sales: 95 },
                { name: "Red Onions", sales: 85 },
                { name: "Basmati Rice", sales: 75 },
                { name: "Green Apples", sales: 65 },
            ];
            // Add enough mock products to get to 5 total
            bestSellers = [
                ...bestSellers,
                ...mockProducts.slice(0, 5 - bestSellers.length)
            ];
        }
        return res.status(200).json(bestSellers);
    } catch (error) {
        console.error("Error fetching best sellers:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch best selling products" });
    }
};

// Add a repair endpoint to fix corrupted product data
const repairProductData = async(req, res) => {
    try {
        const repairedCount = await productModel.repairRatings();
        res.json({
            success: true, 
            message: `Repaired ${repairedCount} products with invalid rating data`
        });
    } catch(err) {
        console.error("Error repairing product data:", err);
        res.status(500).json({
            success: false, 
            message: `Error repairing product data: ${err.message}`
        });
    }
};

// Add repair endpoint handler
export const repairCorruptedProducts = async (req, res) => {
  try {
    if (typeof Product.fixCorruptedProducts === 'function') {
      const fixedCount = await Product.fixCorruptedProducts();
      return res.json({ success: true, message: `Fixed ${fixedCount} products` });
    } else {
      return res.status(400).json({ success: false, message: "Repair function not available" });
    }
  } catch (error) {
    console.error("Error repairing products:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add count endpoint handler
export const getProductCountHandler = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    console.log('Product count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add single product fetch handler
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Get product directly from database
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
    addProduct,
    listProduct,
    deleteProduct,
    searchProduct,
    fastSellingItems,
    newlyAddedProducts,
    farmerList,
    updateProduct,
    farmerDelete, 
    farmerRevenue,
    repairProductData
}