/**
 * Utility to debug API calls
 */
export function debugApiCall(url, method, data) {
  console.group(`API Call: ${method} ${url}`);
  console.log('Data:', data);
  
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then(response => {
      console.log('Status:', response.status);
      return response.text().then(text => {
        let parsed;
        try {
          parsed = JSON.parse(text);
          console.log('Response:', parsed);
        } catch (e) {
          console.log('Raw response:', text);
        }
        console.groupEnd();
        return response.ok ? 
          Promise.resolve(parsed || text) : 
          Promise.reject(new Error(parsed?.message || `HTTP error! status: ${response.status}`));
      });
    })
    .catch(error => {
      console.error('Error:', error);
      console.groupEnd();
      throw error;
    });
}
