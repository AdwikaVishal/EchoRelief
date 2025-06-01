import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DisasterEvent, SOSAlert, Resource, Volunteer, Donation } from '../types';
import { mockDisasters, mockAlerts, mockResources, mockVolunteers, mockDonations } from '../data/mockData';

interface DisasterContextType {
  disasters: DisasterEvent[];
  alerts: SOSAlert[];
  resources: Resource[];
  volunteers: Volunteer[];
  donations: Donation[];
  activeDisaster: DisasterEvent | null;
  setActiveDisaster: (disaster: DisasterEvent | null) => void;
  createSOSAlert: (alert: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>) => Promise<SOSAlert>;
  updateAlertStatus: (id: string, status: SOSAlert['status'], responderId?: string) => void;
  allocateResource: (resourceId: string, alertId: string) => void;
  assignVolunteer: (volunteerId: string, alertId: string) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp' | 'status'>) => Promise<Donation>;
}

const DisasterContext = createContext<DisasterContextType | null>(null);

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};

interface DisasterProviderProps {
  children: ReactNode;
}

export const DisasterProvider: React.FC<DisasterProviderProps> = ({ children }) => {
  const [disasters, setDisasters] = useState<DisasterEvent[]>(mockDisasters);
  const [alerts, setAlerts] = useState<SOSAlert[]>(mockAlerts);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [activeDisaster, setActiveDisaster] = useState<DisasterEvent | null>(null);

  // Load active disaster from local storage
  useEffect(() => {
    const storedDisaster = localStorage.getItem('relieflink_active_disaster');
    if (storedDisaster) {
      setActiveDisaster(JSON.parse(storedDisaster));
    } else if (disasters.length > 0) {
      // Default to the most recent active disaster
      const active = disasters.find(d => d.status === 'active');
      if (active) {
        setActiveDisaster(active);
        localStorage.setItem('relieflink_active_disaster', JSON.stringify(active));
      }
    }
  }, [disasters]);

  // Save active disaster to local storage when it changes
  useEffect(() => {
    if (activeDisaster) {
      localStorage.setItem('relieflink_active_disaster', JSON.stringify(activeDisaster));
    } else {
      localStorage.removeItem('relieflink_active_disaster');
    }
  }, [activeDisaster]);

  // Create a new SOS alert
  const createSOSAlert = async (alertData: Omit<SOSAlert, 'id' | 'timestamp' | 'status'>): Promise<SOSAlert> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newAlert: SOSAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      status: 'new',
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    return newAlert;
  };

  // Update an alert status
  const updateAlertStatus = (id: string, status: SOSAlert['status'], responderId?: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { 
              ...alert, 
              status, 
              responderId, 
              responseTime: status === 'responding' ? Date.now() : alert.responseTime 
            } 
          : alert
      )
    );
  };

  // Allocate a resource to an alert
  const allocateResource = (resourceId: string, alertId: string) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, status: 'in-transit', assignedTo: alertId } 
          : resource
      )
    );
  };

  // Assign a volunteer to an alert
  const assignVolunteer = (volunteerId: string, alertId: string) => {
    setVolunteers(prev => 
      prev.map(volunteer => 
        volunteer.id === volunteerId 
          ? { 
              ...volunteer, 
              assignedAlerts: volunteer.assignedAlerts 
                ? [...volunteer.assignedAlerts, alertId] 
                : [alertId] 
            } 
          : volunteer
      )
    );
  };

  // Add a new donation
  const addDonation = async (donationData: Omit<Donation, 'id' | 'timestamp' | 'status'>): Promise<Donation> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newDonation: Donation = {
      ...donationData,
      id: `donation-${Date.now()}`,
      timestamp: Date.now(),
      status: 'pending',
      transactionHash: `0x${Math.random().toString(16).substring(2, 34)}`,
    };
    
    setDonations(prev => [newDonation, ...prev]);
    
    // Simulate blockchain confirmation after delay
    setTimeout(() => {
      setDonations(prev => 
        prev.map(donation => 
          donation.id === newDonation.id 
            ? { ...donation, status: 'confirmed' } 
            : donation
        )
      );
    }, 3000);
    
    return newDonation;
  };

  const value = {
    disasters,
    alerts,
    resources,
    volunteers,
    donations,
    activeDisaster,
    setActiveDisaster,
    createSOSAlert,
    updateAlertStatus,
    allocateResource,
    assignVolunteer,
    addDonation,
  };

  return <DisasterContext.Provider value={value}>{children}</DisasterContext.Provider>;
};