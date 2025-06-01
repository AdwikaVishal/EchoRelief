import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, MapPin, AlertTriangle, Shield, LifeBuoy, LogOut, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getCurrentLocation } from '../../utils/geolocation';
import NotificationPanel from '../notifications/NotificationPanel';
import SOSButton from '../emergency/SOSButton';
import ConnectivityStatus from '../common/ConnectivityStatus';

const AppLayout: React.FC = () => {
  const { currentUser, logout, updateUserLocation } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user's location periodically
  useEffect(() => {
    const updateLocation = async () => {
      try {
        const location = await getCurrentLocation();
        updateUserLocation(location);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    };

    // Update immediately and then every 5 minutes
    updateLocation();
    const interval = setInterval(updateLocation, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [updateUserLocation]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <Shield size={24} className="text-white" />
            <h1 className="text-xl font-bold">ReliefLink</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-grow py-4">
            <nav className="px-2 space-y-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive('/dashboard') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <MapPin size={20} className="mr-3" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => navigate('/alerts')}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive('/alerts') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <AlertTriangle size={20} className="mr-3" />
                <span>SOS Alerts</span>
              </button>
              
              <button
                onClick={() => navigate('/resources')}
                className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive('/resources') ? 'bg-blue-700' : 'hover:bg-blue-700'
                }`}
              >
                <LifeBuoy size={20} className="mr-3" />
                <span>Resources</span>
              </button>
            </nav>
          </div>

          <div className="p-4 border-t border-blue-700">
            <ConnectivityStatus />
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-sm text-blue-300 capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 mt-4 text-left text-white rounded-lg hover:bg-blue-700"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`text-gray-600 lg:hidden ${isSidebarOpen ? 'hidden' : ''}`}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 lg:ml-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/dashboard' && 'Disaster Dashboard'}
                {location.pathname === '/alerts' && 'SOS Alerts'}
                {location.pathname === '/resources' && 'Resource Management'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-1 text-gray-600 hover:text-gray-900"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>

        {/* Emergency SOS Button */}
        <SOSButton />
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;