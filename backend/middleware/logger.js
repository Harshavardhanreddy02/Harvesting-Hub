import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}


const accessLogStream = createStream('access.log', {
    interval: '1d', 
    path: logsDirectory,
    size: '10M', 
    compress: 'gzip' 
});

// Custom minimal logging format
const minimalFormat = ':method :url :status - :response-time ms';

// Create the logger middleware
const logger = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        // Full logging to file in production
        return morgan('combined', { stream: accessLogStream })(req, res, next);
    }
    // Minimal console logging in development
    return morgan(minimalFormat, {
        skip: (req) => req.url === '/favicon.ico' || req.url.startsWith('/static')
    })(req, res, next);
};

export { logger };