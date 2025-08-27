import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Import all routes
import authRouter from '../routes/auth.route.js';
import productRouter from '../routes/product.route.js';
import cartRouter from '../routes/cart.route.js';
import orderRouter from '../routes/order.route.js';
import userRouter from '../routes/user.route.js';
import toolRouter from '../routes/tools.route.js';
import wishlistRouter from '../routes/wishlist.route.js';
import adminRouter from '../routes/admin.route.js';
import feedbackRouter from '../routes/feedback.route.js';
import ratingRouter from '../routes/rating.route.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Suppress mongoose deprecation warnings
mongoose.set('strictQuery', true);

// Global connection promise to avoid multiple connections
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferCommands: false,
      maxPoolSize: 10,
    });
    console.log("Database connected");
    return cachedConnection;
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    throw err;
  }
}

const app = express();

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

// Enable CORS
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000',
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL
    ],
    credentials: true,
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ 
            error: 'Database connection failed',
            message: error.message 
        });
    }
});

// Routes
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

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'Harvest Hub API is running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            products: '/api/product',
            tools: '/api/tool',
            cart: '/api/cart',
            orders: '/api/order',
            users: '/api/user',
            wishlist: '/api/wishlist',
            admin: '/api/admin',
            feedback: '/api/feedback',
            rating: '/api/rating'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

export default app;
