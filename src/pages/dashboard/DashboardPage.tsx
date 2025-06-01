import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Users, Package, AlertCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useDisaster } from '../../contexts/DisasterContext';
import { useNotifications } from '../../contexts/NotificationContext';
import DisasterMap from './DisasterMap';
import StatCard from '../../components/common/StatCard';
import { simulateEmergencyChip } from '../../utils/geolocation';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { disasters, alerts, resources, volunteers, activeDisaster, setActiveDisaster } = useDisaster();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [isOfflineMode, setIsOfflineMode] = useState(simulateEmergencyChip.isOfflineModeEnabled());

  // Set up emergency chip SOS listener
  useEffect(() => {
    const stopListening = simulateEmergencyChip.listenForNearbySOS((alert) => {
      addNotification({
        type: 'sos',
        message: `${alert.message} at ${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`,
        priority: 'critical',
        relatedId: alert.id,
      });
    });
    
    return () => stopListening();
  }, [addNotification]);

  // Watch for offline mode changes
  useEffect(() => {
    const checkOfflineMode = () => {
      const isOffline = simulateEmergencyChip.isOfflineModeEnabled();
      setIsOfflineMode(isOffline);
    };
    
    // Check immediately and then every second
    checkOfflineMode();
    const interval = setInterval(checkOfflineMode, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts.filter(alert => alert.status === 'new' || alert.status === 'acknowledged');
  const activeResources = resources.filter(resource => resource.status !== 'deployed');
  const availableVolunteers = volunteers.filter(volunteer => volunteer.availability);

  const handleDisasterSelect = (disaster: typeof disasters[0]) => {
    setActiveDisaster(disaster);
  };

  return (
    <div className="space-y-6">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-600 text-white p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center">
            <AlertCircle size={24} className="mr-3" />
            <div>
              <h3 className="font-bold text-lg">Offline Mode Active</h3>
              <p className="text-sm text-red-100">
                You're currently in offline mode. Emergency SOS signals will be sent via the emergency chip using available radio frequencies.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Disasters"
          value={disasters.filter(d => d.status === 'active').length}
          icon={<MapPin size={24} />}
          color="red"
        />
        <StatCard 
          title="SOS Alerts"
          value={activeAlerts.length}
          icon={<AlertTriangle size={24} />}
          color="amber"
          change={{ value: 12, isPositive: false }}
        />
        <StatCard 
          title="Available Resources"
          value={activeResources.length}
          icon={<Package size={24} />}
          color="blue"
        />
        <StatCard 
          title="Volunteers"
          value={availableVolunteers.length}
          icon={<Users size={24} />}
          color="green"
          change={{ value: 5, isPositive: true }}
        />
      </div>
      
      {/* Map */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Disaster Map</h2>
        </div>
        <div className="h-[400px]">
          <DisasterMap 
            disasters={disasters}
            alerts={alerts}
            resources={resources}
            activeDisasterId={activeDisaster?.id}
          />
        </div>
      </div>
      
      {/* Active Disasters */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Active Disasters</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {disasters.filter(d => d.status === 'active').map(disaster => (
            <div key={disaster.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{disaster.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      disaster.severity >= 4 ? 'bg-red-600' : 
                      disaster.severity === 3 ? 'bg-amber-600' : 
                      'bg-yellow-600'
                    }`}></span>
                    <span className="text-sm text-gray-600">
                      Severity: {disaster.severity}/5 • 
                      Started: {new Date(disaster.startTime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDisasterSelect(disaster)}
                    className={`py-1 px-3 text-sm rounded ${
                      activeDisaster?.id === disaster.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {activeDisaster?.id === disaster.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={() => navigate('/alerts')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {disasters.filter(d => d.status === 'active').length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <p>No active disasters at this time.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent SOS Alerts */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent SOS Alerts</h2>
          <button 
            onClick={() => navigate('/alerts')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {alerts.slice(0, 3).map(alert => (
            <div key={alert.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  alert.priority === 'critical' ? 'bg-red-100 text-red-600' :
                  alert.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                  alert.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      alert.status === 'new' ? 'bg-red-100 text-red-800' :
                      alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                      alert.status === 'responding' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{alert.message || 'Emergency assistance needed'}</p>
                </div>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <p>No SOS alerts at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;