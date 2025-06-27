import jwt from "jsonwebtoken"
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            console.error('No authorization header found', {
                headers: req.headers,
                path: req.path
            });
            return res.status(401).json({ 
                success: false, 
                message: 'No authorization token provided' 
            });
        }

        // Extract token from 'Bearer TOKEN' format
        const tokenParts = authHeader.split(' ');
        const token = tokenParts.length > 1 ? tokenParts[1] : authHeader;
        
        if (!token) {
            console.error('Invalid token format', {
                authHeader,
                tokenParts,
                path: req.path
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token format' 
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, 'yourSecretKey', {
                algorithms: ['HS256'] // Explicitly set the algorithm
            });
        } catch (verifyError) {
            console.error('JWT Verification Error', {
                error: verifyError.message,
                token: token.substring(0, 10) + '...', // Partial token for debugging
                path: req.path
            });
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token signature' 
            });
        }

        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            console.error('User not found for token', {
                decodedId: decoded.id,
                path: req.path
            });
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Unexpected token verification error:', {
            error: error.message,
            stack: error.stack,
            path: req.path
        });
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error during authentication' 
        });
    }
};

export const authenticateUser = async (req, res, next) => {
    // ...existing code...
};

// No default export