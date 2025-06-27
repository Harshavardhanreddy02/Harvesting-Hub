/**
 * Utility to check if the backend server is running
 */

export const checkServerStatus = async () => {
  try {
    // Simple endpoint that should respond quickly
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/health`, { 
      method: 'GET',
      cache: 'no-cache',
      timeout: 5000, // 5 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.error('Server check failed:', error);
    return false;
  }
};

export const getServerConnectionInfo = async () => {
  try {
    // Gather connection troubleshooting information
    const serverInfo = {
      serverUrl: import.meta.env.VITE_BACKEND_URL,
      isReachable: false,
      error: null,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/health`, { 
        method: 'GET',
        cache: 'no-cache',
        timeout: 5000,
      });
      
      serverInfo.isReachable = response.ok;
      serverInfo.statusCode = response.status;
      serverInfo.statusText = response.statusText;
      
      try {
        serverInfo.responseData = await response.text();
      } catch (e) {
        serverInfo.responseDataError = e.message;
      }
    } catch (error) {
      serverInfo.error = error.message;
    }
    
    return serverInfo;
  } catch (e) {
    return {
      error: e.message,
      timestamp: new Date().toISOString(),
    };
  }
};
