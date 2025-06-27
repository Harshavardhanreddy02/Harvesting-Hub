/**
 * ApiLogger - A utility for debugging API calls
 */
class ApiLogger {
  static logRequest(url, method, data) {
    console.group(`🌐 API Request: ${method} ${url}`);
    console.log('📤 Data:', data);
    console.groupEnd();
  }

  static logResponse(url, status, data) {
    console.group(`🌐 API Response: ${url}`);
    console.log('📥 Status:', status);
    console.log('📥 Data:', data);
    console.groupEnd();
  }

  static logError(url, error) {
    console.group(`❌ API Error: ${url}`);
    console.error('Error:', error);
    console.groupEnd();
  }

  static wrapFetch(url, options = {}) {
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : null;
    
    this.logRequest(url, method, data);
    
    return fetch(url, options)
      .then(response => 
        response.text().then(text => {
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = text;
          }
          
          this.logResponse(url, response.status, data);
          
          if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
          }
          
          return data;
        })
      )
      .catch(error => {
        this.logError(url, error);
        throw error;
      });
  }
}

export default ApiLogger;
