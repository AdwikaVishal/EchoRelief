import React, { useState } from 'react';
import { Package, TruckIcon, Search, Filter, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDisaster } from '../../contexts/DisasterContext';
import { Resource, Volunteer } from '../../types';
import ResourceCard from './ResourceCard';
import VolunteerCard from './VolunteerCard';

const ResourcesPage: React.FC = () => {
  const { resources, volunteers, alerts } = useDisaster();
  const [activeTab, setActiveTab] = useState<'resources' | 'volunteers'>('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter resources based on search and status
  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Filter volunteers based on search and availability
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = !searchQuery || 
      volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'available' && volunteer.availability) || 
      (filterStatus === 'unavailable' && !volunteer.availability);
    
    return matchesSearch && matchesStatus;
  });

  // Active SOS alerts that need resources
  const activeAlerts = alerts.filter(alert => 
    alert.status === 'new' || alert.status === 'acknowledged'
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package size={18} className="mr-2" />
            Resources
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === 'volunteers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={18} className="mr-2" />
            Volunteers
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {activeTab === 'resources' ? (
                  <>
                    <option value="all">All Resources</option>
                    <option value="available">Available</option>
                    <option value="in-transit">In Transit</option>
                    <option value="deployed">Deployed</option>
                  </>
                ) : (
                  <>
                    <option value="all">All Volunteers</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Resources/Volunteers Grid */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {activeTab === 'resources' ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Available Resources</h2>
            
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    activeAlerts={activeAlerts}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                </div>
                <p>No resources found</p>
                <p className="text-sm mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : filterStatus !== 'all' 
                      ? `No resources with status "${filterStatus}"` 
                      : 'Add resources to see them here'}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">Volunteer Teams</h2>
            
            {filteredVolunteers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVolunteers.map(volunteer => (
                  <VolunteerCard 
                    key={volunteer.id} 
                    volunteer={volunteer} 
                    activeAlerts={activeAlerts}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users size={24} className="text-gray-400" />
                  </div>
                </div>
                <p>No volunteers found</p>
                <p className="text-sm mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : filterStatus !== 'all' 
                      ? `No volunteers ${filterStatus === 'available' ? 'available' : 'unavailable'} at this time` 
                      : 'Add volunteers to see them here'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Transport Status */}
      {activeTab === 'resources' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex items-center mb-4">
            <TruckIcon size={20} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Transport Status</h2>
          </div>
          
          {resources.filter(r => r.status === 'in-transit').length > 0 ? (
            <div className="space-y-3">
              {resources
                .filter(r => r.status === 'in-transit')
                .map(resource => {
                  const alert = activeAlerts.find(a => a.id === resource.assignedTo);
                  
                  return (
                    <div key={resource.id} className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-gray-600">
                          {resource.quantity} {resource.unit} • 
                          {alert 
                            ? ` Assigned to alert #${alert.id.split('-')[1]}` 
                            : ' In transit'}
                        </div>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        In Transit
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No resources currently in transit</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResourcesPage;