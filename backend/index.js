import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { logger } from './middleware/logger.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { errorHandler } from './middleware/errorHandler.js';
import fs from 'fs';
import { debugMiddleware } from './middleware/debug.js';
// import setupSwagger from './api-documentation/swagger.js';
// import redisClient from './services/redis.service.js';
// Import all routes
import authRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';
import userRouter from './routes/user.route.js';
import toolRouter from './routes/tools.route.js';
import wishlistRouter from './routes/wishlist.route.js';
import adminRouter from './routes/admin.route.js';
import feedbackRouter from './routes/feedback.route.js';
import ratingRouter from './routes/rating.route.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Suppress mongoose deprecation warnings
mongoose.set('strictQuery', true);

// Connect to MongoDB with reduced logging
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
})
.then(() => console.log("Database connected"))
.catch((err) => {
    console.error("❌ Database connection error:", err.message);
    console.log("Please check your MongoDB Atlas configuration:");
    console.log("1. Make sure your IP is whitelisted in MongoDB Atlas");
    console.log("2. Check if your network allows MongoDB connections");
    console.log("3. Verify your MongoDB Atlas credentials");
});

const app = express();

// Serve static files - with correct absolute paths
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static('uploads'));

// Setup static file serving for uploads directory
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory at:', uploadsPath);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(uploadsPath));

// Add cookie parser middleware
app.use(cookieParser());

// Add session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'harvesting-hub-secure-key-' + Math.random().toString(36).substring(2, 15),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Add body-parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add Helmet middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            fontSrc: ["'self'", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Add logging middleware
app.use(logger);

// Use debug middleware
app.use(debugMiddleware);

// Enable CORS
app.use(cors({
  origin: [
    'https://harvesting-hub-22sx.vercel.app',
    'https://harvesting-hub-22sx-hp51ztag4-harshas-projects-c521c6dd.vercel.app',
    process.env.CLIENT_URL
  ], 
  credentials: true
}));
// Setup Swagger documentation
// setupSwagger(app);

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Harvest Hub Backend API",
        status: "running",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            products: "/api/product", 
            tools: "/api/tool",
            cart: "/api/cart",
            orders: "/api/order",
            users: "/api/user",
            wishlist: "/api/wishlist",
            admin: "/api/admin",
            feedback: "/api/feedback",
            rating: "/api/rating"
        }
    });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/tool", toolRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/admin", adminRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/rating", ratingRouter);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// For serverless deployment, export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, async () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 Server URL: http://localhost:${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(` Port ${PORT} is already in use. Please try:`);
            console.error(`   1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
            console.error(`   2. Or use a different port: PORT=3001 npm run dev`);
            process.exit(1);
        } else {
            console.error('❌ Server error:', err);
        }
    });
}

// Export the app for serverless deployment
export default app;