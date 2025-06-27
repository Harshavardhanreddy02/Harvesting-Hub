// Modify to disable verbose logging

export const debugMiddleware = (req, res, next) => {
  // Skip logging entirely - comment this out if you need to debug later
  return next();
  
  /*
  // Original logging functionality is commented out
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[API] Request body:`, req.body);
  }
  
  if (req.headers.token) {
    console.log(`[API] Token provided: ${req.headers.token.substring(0, 15)}...`);
  }
  
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`[API] Response for ${req.method} ${req.originalUrl}:`, 
      typeof data === 'string' ? data.substring(0, 100) + '...' : 'Non-string response');
    
    return originalSend.apply(res, arguments);
  };
  */
};
