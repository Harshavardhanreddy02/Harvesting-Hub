import React, { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };

    const interval = setInterval(checkConnection, 30000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed bottom-4 right-4 p-2 rounded-lg ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center gap-2`}>
      {isOnline ? <FaWifi /> : <FaExclamationTriangle />}
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
};

export default NetworkStatus;
