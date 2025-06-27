import { useState, useEffect } from 'react';
import { checkServerStatus, getServerConnectionInfo } from '../utils/serverCheck';

const ServerStatus = () => {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      const isOnline = await checkServerStatus();
      setIsServerOnline(isOnline);
      
      if (!isOnline) {
        const details = await getServerConnectionInfo();
        setConnectionDetails(details);
      }
    };

    // Check immediately
    checkServer();
    
    // Set up periodic checks only if server is offline
    let interval;
    if (!isServerOnline) {
      interval = setInterval(checkServer, 60000); // Check every 60 seconds instead of 10
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isServerOnline]);

  if (isServerOnline) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        zIndex: 9999,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        maxWidth: showDetails ? '600px' : '400px',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="server-status-message">
        <strong>API Server Unavailable</strong>
        <p>The backend server is not responding. Features requiring server communication will not work.</p>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            marginTop: '10px',
            marginRight: '10px'
          }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: 'white',
            border: 'none',
            color: '#f44336',
            padding: '5px 10px',
            borderRadius: '3px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Refresh Page
        </button>
      </div>
      
      {showDetails && connectionDetails && (
        <div 
          className="connection-details"
          style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <h4>Connection Details:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(connectionDetails, null, 2)}
          </pre>
          <div className="troubleshooting-tips">
            <h4>Troubleshooting Tips:</h4>
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li>Make sure the backend server is running on <code>{import.meta.env.VITE_BACKEND_URL}</code></li>
              <li>Check terminal for server error messages</li>
              <li>Ensure MongoDB is running if the application uses it</li>
              <li>Check for firewall or network connectivity issues</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerStatus;
