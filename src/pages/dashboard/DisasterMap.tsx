import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DisasterEvent, SOSAlert, Resource } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create custom icons for different types
const alertIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const resourceIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface DisasterMapProps {
  disasters: DisasterEvent[];
  alerts: SOSAlert[];
  resources: Resource[];
  activeDisasterId?: string;
}

const DisasterMap: React.FC<DisasterMapProps> = ({ 
  disasters, 
  alerts, 
  resources,
  activeDisasterId 
}) => {
  const [offlineMap, setOfflineMap] = useState(false);

  useEffect(() => {
    // Check if we're in simulated offline mode
    const isOffline = localStorage.getItem('relieflink_offline_mode') === 'true';
    setOfflineMap(isOffline);
  }, []);

  // Focus on active disaster if selected
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (activeDisasterId) {
        const disaster = disasters.find(d => d.id === activeDisasterId);
        if (disaster) {
          map.flyTo(
            [disaster.location.latitude, disaster.location.longitude],
            10,
            { duration: 1.5 }
          );
        }
      } else if (disasters.length > 0) {
        // Default view if no active disaster
        const activeDisasters = disasters.filter(d => d.status === 'active');
        if (activeDisasters.length > 0) {
          const firstActive = activeDisasters[0];
          map.flyTo(
            [firstActive.location.latitude, firstActive.location.longitude],
            9,
            { duration: 1.5 }
          );
        } else {
          map.flyTo([34.0522, -118.2437], 10); // Default to LA
        }
      }
    }, [map, activeDisasterId, disasters]);
    
    return null;
  };

  const getDisasterColor = (type: DisasterEvent['type']) => {
    switch (type) {
      case 'earthquake':
        return '#ef4444'; // red
      case 'flood':
        return '#3b82f6'; // blue
      case 'hurricane':
        return '#8b5cf6'; // purple
      case 'wildfire':
        return '#f97316'; // orange
      case 'tsunami':
        return '#0ea5e9'; // sky
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <MapContainer 
      center={[34.0522, -118.2437]} 
      zoom={10} 
      style={{ height: '100%', width: '100%' }}
    >
      <MapController />
      
      {/* Use different tile layers based on online/offline mode */}
      {!offlineMap ? (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      ) : (
        <TileLayer
          url="/offline-map-tiles/{z}/{x}/{y}.png"
          attribution='Offline Map (Simulated)'
          errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        />
      )}
      
      {/* Render Disaster Zones */}
      {disasters.map(disaster => (
        <Circle
          key={disaster.id}
          center={[disaster.location.latitude, disaster.location.longitude]}
          radius={disaster.radius * 1000} // convert km to meters
          pathOptions={{
            color: getDisasterColor(disaster.type),
            fillColor: getDisasterColor(disaster.type),
            fillOpacity: 0.2,
            weight: disaster.status === 'active' ? 3 : 1,
            dashArray: disaster.status === 'contained' ? '5, 5' : undefined,
            opacity: disaster.status === 'resolved' ? 0.5 : 0.8,
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{disaster.name}</p>
              <p>Type: {disaster.type}</p>
              <p>Severity: {disaster.severity}/5</p>
              <p>Status: {disaster.status}</p>
              <p>Started: {new Date(disaster.startTime).toLocaleString()}</p>
            </div>
          </Popup>
        </Circle>
      ))}
      
      {/* Render SOS Alerts */}
      {alerts.filter(a => a.status !== 'resolved').map(alert => (
        <Marker
          key={alert.id}
          position={[alert.location.latitude, alert.location.longitude]}
          icon={alertIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-red-600">SOS Alert</p>
              <p>{alert.message || 'Emergency assistance needed'}</p>
              <p>Priority: {alert.priority}</p>
              <p>Status: {alert.status}</p>
              <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Render Resources */}
      {resources.map(resource => (
        <Marker
          key={resource.id}
          position={[resource.location.latitude, resource.location.longitude]}
          icon={resourceIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-blue-600">{resource.name}</p>
              <p>Type: {resource.type}</p>
              <p>Quantity: {resource.quantity} {resource.unit}</p>
              <p>Status: {resource.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DisasterMap;