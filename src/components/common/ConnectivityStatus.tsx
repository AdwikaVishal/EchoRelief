import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { simulateEmergencyChip } from '../../utils/geolocation';

const ConnectivityStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState(simulateEmergencyChip.isOfflineModeEnabled());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineMode = () => {
    if (isOfflineMode) {
      simulateEmergencyChip.disableOfflineMode();
      setIsOfflineMode(false);
    } else {
      simulateEmergencyChip.enableOfflineMode();
      setIsOfflineMode(true);
    }
  };

  return (
    <div className={`rounded-lg p-2 flex items-center justify-between ${isOnline && !isOfflineMode ? 'bg-blue-700' : 'bg-red-700'}`}>
      <div className="flex items-center">
        {isOnline && !isOfflineMode ? (
          <Wifi size={16} className="mr-2 text-blue-200" />
        ) : (
          <WifiOff size={16} className="mr-2 text-red-200" />
        )}
        <span className="text-sm">
          {isOfflineMode ? 'Offline Mode' : (isOnline ? 'Online' : 'Offline')}
        </span>
      </div>
      <button 
        onClick={toggleOfflineMode}
        className={`text-xs px-2 py-1 rounded ${isOfflineMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'}`}
      >
        {isOfflineMode ? 'Go Online' : 'Go Offline'}
      </button>
    </div>
  );
};

export default ConnectivityStatus;