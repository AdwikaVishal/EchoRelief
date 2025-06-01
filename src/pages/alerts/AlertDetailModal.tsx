import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Clock, MapPin, User, HeartPulse, ChevronRight } from 'lucide-react';
import { SOSAlert } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AlertDetailModalProps {
  alert: SOSAlert | null;
  onClose: () => void;
  onStatusChange: (alertId: string, status: SOSAlert['status']) => void;
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onStatusChange,
}) => {
  const { currentUser } = useAuth();

  if (!alert) return null;

  const getStatusColor = (status: SOSAlert['status']) => {
    switch (status) {
      case 'new': return 'bg-red-600 text-white';
      case 'acknowledged': return 'bg-blue-600 text-white';
      case 'responding': return 'bg-amber-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getPriorityLabel = (priority: SOSAlert['priority']) => {
    switch (priority) {
      case 'critical': return 'Critical Priority';
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Unknown Priority';
    }
  };
  
  const getPriorityColor = (priority: SOSAlert['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-90vh overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-4 flex items-center justify-between ${getStatusColor(alert.status)}`}>
            <div className="flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              <h3 className="font-bold text-lg">SOS Alert Details</h3>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[500px] overflow-y-auto">
            {/* Alert Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(alert.status)}`}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </span>
              
              <span className="flex items-center text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                {new Date(alert.timestamp).toLocaleString()}
              </span>
              
              <span className={`px-3 py-1 text-sm rounded-full border ${getPriorityColor(alert.priority)}`}>
                {getPriorityLabel(alert.priority)}
              </span>
            </div>
            
            {/* Alert Message */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Message</h4>
              <p>{alert.message || 'Emergency assistance needed'}</p>
            </div>
            
            {/* Location */}
            <div className="mb-4">
              <div className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                <MapPin size={16} />
                <h4>Location</h4>
              </div>
              <p className="text-sm">
                Latitude: {alert.location.latitude.toFixed(6)}, 
                Longitude: {alert.location.longitude.toFixed(6)}
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View on map
                <ChevronRight size={16} />
              </button>
            </div>
            
            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                <User size={16} />
                <h4>User Information</h4>
              </div>
              <p className="text-sm">User ID: {alert.userId}</p>
            </div>
            
            {/* Medical Info */}
            {alert.medicalInfo && (
              <div className="mb-4">
                <div className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                  <HeartPulse size={16} />
                  <h4>Medical Information</h4>
                </div>
                <p className="text-sm">{alert.medicalInfo}</p>
              </div>
            )}
            
            {/* Response Info */}
            {alert.responderId && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-1">Response Information</h4>
                <p className="text-sm">Responder: {alert.responderId}</p>
                {alert.responseTime && (
                  <p className="text-sm">
                    Response time: {new Date(alert.responseTime).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 justify-end">
              {alert.status === 'new' && (
                <button
                  onClick={() => onStatusChange(alert.id, 'acknowledged')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Acknowledge
                </button>
              )}
              
              {alert.status === 'acknowledged' && (
                <button
                  onClick={() => onStatusChange(alert.id, 'responding')}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Respond to Alert
                </button>
              )}
              
              {(alert.status === 'acknowledged' || alert.status === 'responding') && (
                <button
                  onClick={() => onStatusChange(alert.id, 'resolved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Resolved
                </button>
              )}
              
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertDetailModal;