import { io } from 'socket.io-client';
import { SOSAlert, Resource, DisasterEvent } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.relieflink.org';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// SOS Alert Events
export const onNewSOSAlert = (callback: (alert: SOSAlert) => void) => {
  socket.on('sos:new', callback);
  return () => socket.off('sos:new', callback);
};

export const onSOSStatusUpdate = (callback: (alertId: string, status: SOSAlert['status']) => void) => {
  socket.on('sos:status_update', callback);
  return () => socket.off('sos:status_update', callback);
};

// Resource Events
export const onResourceUpdate = (callback: (resource: Resource) => void) => {
  socket.on('resource:update', callback);
  return () => socket.off('resource:update', callback);
};

// Disaster Events
export const onDisasterUpdate = (callback: (disaster: DisasterEvent) => void) => {
  socket.on('disaster:update', callback);
  return () => socket.off('disaster:update', callback);
};

// Emergency Chip Events
export const onEmergencyBeacon = (callback: (data: { 
  id: string;
  location: { latitude: number; longitude: number };
  message: string;
}) => void) => {
  socket.on('emergency:beacon', callback);
  return () => socket.off('emergency:beacon', callback);
};

// Connection Status Events
export const onConnectionStatus = (callback: (status: 'connected' | 'disconnected') => void) => {
  socket.on('connect', () => callback('connected'));
  socket.on('disconnect', () => callback('disconnected'));
};