import React, { useState } from 'react';
import { Package, TruckIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Resource, SOSAlert } from '../../types';
import { useDisaster } from '../../contexts/DisasterContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface ResourceCardProps {
  resource: Resource;
  activeAlerts: SOSAlert[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, activeAlerts }) => {
  const { allocateResource } = useDisaster();
  const { addNotification } = useNotifications();
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  
  const handleAllocate = () => {
    if (resource.status !== 'available' || !selectedAlertId) return;
    
    allocateResource(resource.id, selectedAlertId);
    
    // Add notification
    addNotification({
      type: 'resource',
      message: `${resource.name} allocated to alert #${selectedAlertId.split('-')[1]}`,
      priority: 'medium',
      relatedId: resource.id,
    });
    
    setIsAllocating(false);
    setSelectedAlertId('');
  };
  
  const getResourceIcon = () => {
    switch (resource.type) {
      case 'water': return '💧';
      case 'food': return '🍲';
      case 'medical': return '🩺';
      case 'shelter': return '🏠';
      case 'clothing': return '👕';
      default: return '📦';
    }
  };
  
  const getStatusColor = () => {
    switch (resource.status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'deployed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span role="img" aria-label={resource.type} className="text-lg">
                {getResourceIcon()}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{resource.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
            {resource.status === 'in-transit' ? 'In Transit' : resource.status}
          </span>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-sm">
              <strong>{resource.quantity}</strong> {resource.unit}
            </p>
          </div>
        </div>
        
        {isAllocating ? (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Allocate to alert:
            </label>
            <select
              value={selectedAlertId}
              onChange={(e) => setSelectedAlertId(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an alert</option>
              {activeAlerts.map(alert => (
                <option key={alert.id} value={alert.id}>
                  Alert #{alert.id.split('-')[1]} - {alert.priority}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAllocate}
                disabled={!selectedAlertId}
                className={`flex-1 py-2 text-sm rounded-md ${
                  !selectedAlertId
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Allocate
              </button>
              <button
                onClick={() => {
                  setIsAllocating(false);
                  setSelectedAlertId('');
                }}
                className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {resource.status === 'available' && (
              <button
                onClick={() => setIsAllocating(true)}
                className="w-full py-2 flex items-center justify-center bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
              >
                <TruckIcon size={16} className="mr-2" />
                Allocate Resource
              </button>
            )}
            
            {resource.status === 'in-transit' && resource.assignedTo && (
              <div className="text-sm text-gray-600">
                <span className="flex items-center">
                  <TruckIcon size={14} className="mr-1 text-blue-600" />
                  Assigned to alert #{resource.assignedTo.split('-')[1]}
                </span>
              </div>
            )}
            
            {resource.status === 'deployed' && (
              <div className="text-sm text-purple-600 flex items-center">
                <CheckCircle size={14} className="mr-1" />
                Deployed successfully
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResourceCard;