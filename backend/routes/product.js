import express from 'express'
import { 
    addProduct, 
    deleteProduct, 
    listProduct,
    searchProduct, 
    fastSellingItems, 
    newlyAddedProducts, 
    farmerList,
    updateProduct,
    farmerDelete,
    farmerRevenue,
    getTopSellingProducts,
    getProductCount,
    getBestSellers,
    repairProductData,
    getProductById
} from '../controllers/product.js'
import multer from 'multer'
import { verifyToken } from '../middleware/auth.js';
import Product from '../models/Product.js';
import { optionalAuth } from '../utils/authUtils.js';

const productRouter = express.Router()

const storage = multer.diskStorage({
  destination: "uploads", // Ensure this directory exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Route for adding a product
productRouter.post("/add", upload.single("image"), addProduct)

// Make listing public but with optional auth
productRouter.get("/list", listProduct);

// Add a repair endpoint that can be called on demand
productRouter.get("/repair-data", async (req, res) => {
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
});

// Make farmerlist work with or without token
productRouter.post("/farmerlist", farmerList)
productRouter.post("/farmerrevenue", farmerRevenue)
productRouter.put("/farmerupdate/:id", updateProduct)
productRouter.delete("/farmerdelete/:id", farmerDelete)
productRouter.get("/topselling", fastSellingItems)
productRouter.get("/recentadded", newlyAddedProducts)
productRouter.get("/search/:search", searchProduct)
productRouter.post("/delete/:id", deleteProduct)
productRouter.get('/top-selling-products', getTopSellingProducts)
productRouter.put('/product/update/:id', updateProduct)
productRouter.put('/update/:id', updateProduct)

// Update the best-sellers endpoint
productRouter.get("/best-sellers", async (req, res) => {
  try {
    const bestSellers = await getBestSellers(req, res);
    // The response is already handled in getBestSellers
  } catch (error) {
    console.error('Error in best-sellers route:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add the product count endpoint
productRouter.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    console.log('Product count:', count);
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fetch a single product by ID
productRouter.get('/:id', getProductById);

// Add these debug/repair endpoints below the existing routes and before export

// Debug endpoint to check database connection and product schema
productRouter.get("/debug", async (req, res) => {
  try {
    // Check if we can connect to database and query products
    const count = await Product.countDocuments();
    const sample = await Product.findOne().lean();
    const modelInfo = Product.schema.paths;
    
    // Get collection stats
    const stats = await Product.collection.stats();
    
    // Return diagnostic info
    res.json({
      success: true,
      databaseConnected: true,
      productCount: count,
      sampleProduct: sample,
      modelFields: Object.keys(modelInfo),
      collectionStats: stats
    });
  } catch (error) {
    console.error("Product debug error:", error);
    res.status(500).json({
      success: false,
      databaseConnected: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Add database repair endpoint
productRouter.get("/repair-database", async (req, res) => {
  try {
    // Import the repair function
    const repairDatabase = (await import('../utils/repairDatabase.js')).default;
    await repairDatabase();
    res.json({ success: true, message: "Database repair initiated" });
  } catch (error) {
    console.error("Database repair error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Raw product find - skips schema validation
productRouter.get("/raw-list", async (req, res) => {
  try {
    // Use the native MongoDB driver to query products
    const products = await Product.collection.find({}).toArray();
    res.json({ success: true, count: products.length, message: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a no-auth version of farmerlist
productRouter.post("/public-farmerlist", async (req, res) => {
  try {
    // Log all headers for debugging
    console.log("public-farmerlist received headers:", JSON.stringify(req.headers, null, 2));
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Find products by farmer's email directly from MongoDB collection for reliability
    const products = await Product.collection.find({ email }).toArray();
    console.log(`Found ${products.length} products for ${email} in public endpoint`);

    // Normalize products
    const normalizedProducts = products.map(product => ({
      _id: product._id,
      name: product.name || "Unnamed Product",
      description: product.description || "No description available",
      price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
      category: product.category || "Uncategorized",
      image: product.image || "default.jpg",
      stockQuantity: typeof product.stockQuantity === 'string' ? parseInt(product.stockQuantity) : 
                     (product.stockQuantity || product.stock || 50),
      status: product.status || 'On Sale',
      email: product.email || email,
      discount: product.discount || 0,
      ...product
    }));

    return res.json({ 
      success: true, 
      message: "Products retrieved successfully.", 
      products: normalizedProducts 
    });
  } catch (error) {
    console.error("Error in public-farmerlist:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default productRouter
