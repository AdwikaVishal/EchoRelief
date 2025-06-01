import { GeoLocation } from '../types';

export const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        // Fall back to a default location if user denies permission
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            latitude: 34.0522, // Los Angeles
            longitude: -118.2437,
            accuracy: 1000,
            timestamp: Date.now(),
          });
        } else {
          reject(error);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Haversine formula to calculate distance between two points on Earth
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

export const isLocationWithinDisasterZone = (
  location: GeoLocation,
  disasterLocation: GeoLocation,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    disasterLocation.latitude,
    disasterLocation.longitude
  );
  
  return distance <= radiusKm;
};

// Simulate emergency chip functionality
export const simulateEmergencyChip = {
  // Simulate sending SOS via emergency chip (works without internet)
  sendSOS: async (message: string, location: GeoLocation): Promise<boolean> => {
    // Simulate delay and success
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Emergency SOS sent via low-power chip:', message, location);
    return true;
  },
  
  // Simulate receiving nearby SOS signals via mesh network
  listenForNearbySOS: (callback: (alert: { id: string, location: GeoLocation, message: string }) => void) => {
    // Simulate occasional SOS messages from nearby
    const interval = setInterval(() => {
      // Only simulate messages occasionally (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        const nearbyLocation = {
          latitude: 34.0522 + (Math.random() - 0.5) * 0.01,
          longitude: -118.2437 + (Math.random() - 0.5) * 0.01,
          timestamp: Date.now(),
        };
        
        callback({
          id: `nearby-sos-${Date.now()}`,
          location: nearbyLocation,
          message: 'Nearby SOS detected via mesh network',
        });
      }
    }, 30000);
    
    // Return function to stop listening
    return () => clearInterval(interval);
  },
  
  // Simulate offline mode
  enableOfflineMode: () => {
    console.log('Emergency chip switched to offline mode');
    localStorage.setItem('relieflink_offline_mode', 'true');
    return true;
  },
  
  disableOfflineMode: () => {
    console.log('Emergency chip switched to online mode');
    localStorage.removeItem('relieflink_offline_mode');
    return true;
  },
  
  isOfflineModeEnabled: (): boolean => {
    return localStorage.getItem('relieflink_offline_mode') === 'true';
  }
};