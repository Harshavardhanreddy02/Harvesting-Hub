import axios from 'axios';

// Create an axios instance with interceptors for debugging
const debugAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
debugAPI.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
debugAPI.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default debugAPI;

// Usage examples:
// import debugAPI from '../utils/debugAPI';
// 
// // Instead of axios.get:
// debugAPI.get('/api/product/list')
//   .then(response => console.log(response))
//   .catch(error => console.error(error));
//
// // Instead of axios.post:
// debugAPI.post('/api/user/update-profile', data)
//   .then(response => console.log(response))
//   .catch(error => console.error(error));
