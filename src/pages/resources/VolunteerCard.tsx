import React, { useState } from 'react';
import { User, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Volunteer, SOSAlert } from '../../types';
import { useDisaster } from '../../contexts/DisasterContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface VolunteerCardProps {
  volunteer: Volunteer;
  activeAlerts: SOSAlert[];
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer, activeAlerts }) => {
  const { assignVolunteer } = useDisaster();
  const { addNotification } = useNotifications();
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');

  const handleAssign = () => {
    if (!volunteer.availability || !selectedAlertId) return;
    
    assignVolunteer(volunteer.id, selectedAlertId);
    
    // Add notification
    addNotification({
      type: 'volunteer',
      message: `Volunteer ${volunteer.id} assigned to alert #${selectedAlertId.split('-')[1]}`,
      priority: 'medium',
      relatedId: volunteer.id,
    });
    
    setIsAssigning(false);
    setSelectedAlertId('');
  };

  // Filter alerts that this volunteer isn't already assigned to
  const availableAlerts = activeAlerts.filter(alert => 
    !volunteer.assignedAlerts || !volunteer.assignedAlerts.includes(alert.id)
  );

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
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Volunteer #{volunteer.id.split('-')[1]}</h3>
              <p className="text-sm text-gray-600">ID: {volunteer.userId}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            volunteer.availability 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {volunteer.availability ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin size={14} className="mr-1" />
            <span>
              {volunteer.location.latitude.toFixed(4)}, {volunteer.location.longitude.toFixed(4)}
            </span>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-1">Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {volunteer.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {volunteer.assignedAlerts && volunteer.assignedAlerts.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1">
                Assigned to:
              </h4>
              <div className="space-y-1">
                {volunteer.assignedAlerts.map(alertId => (
                  <div key={alertId} className="text-xs bg-amber-50 text-amber-700 rounded px-2 py-1 flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    Alert #{alertId.split('-')[1]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {isAssigning ? (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Assign to alert:
            </label>
            <select
              value={selectedAlertId}
              onChange={(e) => setSelectedAlertId(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an alert</option>
              {availableAlerts.map(alert => (
                <option key={alert.id} value={alert.id}>
                  Alert #{alert.id.split('-')[1]} - {alert.priority}
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleAssign}
                disabled={!selectedAlertId}
                className={`flex-1 py-2 text-sm rounded-md ${
                  !selectedAlertId
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setIsAssigning(false);
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
            {volunteer.availability && availableAlerts.length > 0 && (
              <button
                onClick={() => setIsAssigning(true)}
                className="w-full py-2 flex items-center justify-center bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
              >
                Assign to Alert
              </button>
            )}
            
            {volunteer.availability && availableAlerts.length === 0 && (
              <button
                disabled
                className="w-full py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
              >
                No available alerts
              </button>
            )}
            
            {!volunteer.availability && (
              <button
                disabled
                className="w-full py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
              >
                Volunteer unavailable
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VolunteerCard;