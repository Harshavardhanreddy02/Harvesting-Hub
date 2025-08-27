import morgan from 'morgan';

// Custom minimal logging format
const minimalFormat = ':method :url :status - :response-time ms';

// Create the logger middleware - serverless compatible
const logger = (req, res, next) => {
    // Use console logging only (no file system access in serverless)
    return morgan(minimalFormat, {
        skip: (req) => req.url === '/favicon.ico' || req.url.startsWith('/static')
    })(req, res, next);
};

export { logger };