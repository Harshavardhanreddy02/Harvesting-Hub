import { clearAuthTokens } from './axiosConfig';

// Token validation utility
export const validateToken = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT token structure');
      return false;
    }
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('JWT token has expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Clear invalid tokens on app startup
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  
  console.log('Initializing authentication...');
  
  // Check localStorage token
  if (token && !validateToken(token)) {
    console.warn('Invalid token found in localStorage, clearing...');
    clearAuthTokens();
    return false;
  }
  
  // Check sessionStorage token
  if (sessionToken && !validateToken(sessionToken)) {
    console.warn('Invalid token found in sessionStorage, clearing...');
    clearAuthTokens();
    return false;
  }
  
  // If we have a valid token, return it
  const validToken = token || sessionToken;
  if (validToken) {
    console.log('Valid authentication token found');
    return validToken;
  }
  
  console.log('No valid authentication token found');
  return false;
};

// Force clear all authentication data
export const forceLogout = (reason = 'manual') => {
  console.log(`Forcing logout due to: ${reason}`);
  clearAuthTokens();
  
  // Dispatch logout event
  window.dispatchEvent(new CustomEvent('auth-logout', { 
    detail: { reason } 
  }));
  
  // Redirect to login
  setTimeout(() => {
    window.location.href = '/login';
  }, 500);
};

// Initialize auth on module load to clear any existing invalid tokens
initializeAuth();
