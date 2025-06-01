import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, Filter, Search } from 'lucide-react';
import { useDisaster } from '../../contexts/DisasterContext';
import { useAuth } from '../../contexts/AuthContext';
import { SOSAlert } from '../../types';
import AlertDetailModal from './AlertDetailModal';

const AlertsPage: React.FC = () => {
  const { alerts, updateAlertStatus } = useDisaster();
  const { currentUser } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (alertId: string, newStatus: SOSAlert['status']) => {
    updateAlertStatus(alertId, newStatus, currentUser?.id);
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert({...selectedAlert, status: newStatus});
    }
  };

  // Filter alerts based on status and search query
  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSearch = !searchQuery || 
      (alert.message && alert.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Sort alerts by priority and timestamp
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // First by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by timestamp (newest first)
    return b.timestamp - a.timestamp;
  });

  const getStatusColor = (status: SOSAlert['status']) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'responding': return 'bg-amber-100 text-amber-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: SOSAlert['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="responding">Responding</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">SOS Alerts</h2>
          </div>
          
          {sortedAlerts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                      alert.priority === 'critical' ? 'bg-red-100 text-red-600' :
                      alert.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                      alert.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(alert.priority)}`} title={`Priority: ${alert.priority}`} />
                      </div>
                      
                      <p className="text-sm">{alert.message || 'Emergency assistance needed'}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alert.status === 'new' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(alert.id, 'acknowledged');
                            }}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                          >
                            Acknowledge
                          </button>
                        )}
                        
                        {alert.status === 'acknowledged' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(alert.id, 'responding');
                            }}
                            className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200"
                          >
                            Respond
                          </button>
                        )}
                        
                        {(alert.status === 'acknowledged' || alert.status === 'responding') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(alert.id, 'resolved');
                            }}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-2 text-blue-600">
                      <CheckCircle2 size={16} className={alert.status === 'resolved' ? 'text-green-500' : 'text-gray-300'} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-gray-400" />
                </div>
              </div>
              <p>No alerts found</p>
              <p className="text-sm mt-1">
                {searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : filterStatus !== 'all' 
                    ? `No alerts with status "${filterStatus}"` 
                    : 'All alerts have been handled'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Alert Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default AlertsPage;