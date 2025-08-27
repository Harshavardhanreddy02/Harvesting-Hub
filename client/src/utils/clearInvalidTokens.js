// Utility to immediately clear invalid tokens on app startup
import { clearAuthTokens } from './axiosConfig';
import { validateToken } from './tokenManager';

// Function to clear invalid tokens immediately
export const clearInvalidTokensOnStartup = () => {
  console.log('Checking for invalid tokens on app startup...');
  
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  
  let clearedTokens = false;
  
  // Check localStorage token
  if (localToken && !validateToken(localToken)) {
    console.warn('Invalid token found in localStorage, clearing...');
    clearedTokens = true;
  }
  
  // Check sessionStorage token
  if (sessionToken && !validateToken(sessionToken)) {
    console.warn('Invalid token found in sessionStorage, clearing...');
    clearedTokens = true;
  }
  
  // Clear all tokens if any invalid ones were found
  if (clearedTokens) {
    clearAuthTokens();
    console.log('Invalid tokens cleared successfully');
    return true;
  }
  
  console.log('No invalid tokens found');
  return false;
};

// Auto-execute on module load
clearInvalidTokensOnStartup();
