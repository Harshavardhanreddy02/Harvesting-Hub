import axios from 'axios';

// Create a custom axios instance with a base URL
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['token'] = token;
    }
    
    // Add logging for debugging purposes
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request to: ${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API error (${error.response.status}):`, error.response.data);
      
      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response.status === 401) {
        console.error('Authentication failed. Redirecting to login...');
        // You could dispatch a logout action or redirect to login here
      } else if (error.response.status === 404) {
        console.error('API endpoint not found:', error.config.url);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from API:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
