import { User, DisasterEvent, SOSAlert, Resource, Volunteer, Donation, NotificationType } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin@relieflink.org',
    name: 'Admin User',
    role: 'admin',
    location: { latitude: 34.0522, longitude: -118.2437 },
  },
  {
    id: 'responder@relieflink.org',
    name: 'Emergency Responder',
    role: 'responder',
    location: { latitude: 34.0611, longitude: -118.2368 },
  },
  {
    id: 'volunteer@relieflink.org',
    name: 'Relief Volunteer',
    role: 'volunteer',
    location: { latitude: 34.0689, longitude: -118.4452 },
  },
  {
    id: 'civilian@relieflink.org',
    name: 'John Citizen',
    role: 'civilian',
    location: { latitude: 34.0522, longitude: -118.2437 },
    medicalInfo: 'Asthma, Allergic to penicillin',
    contacts: [
      { id: 'c1', name: 'Jane Citizen', relation: 'spouse', phone: '555-123-4567' },
      { id: 'c2', name: 'Dr. Smith', relation: 'doctor', phone: '555-987-6543' },
    ],
  },
];

// Mock Disasters
export const mockDisasters: DisasterEvent[] = [
  {
    id: 'disaster-1',
    name: 'Los Angeles Earthquake',
    type: 'earthquake',
    severity: 4,
    location: { latitude: 34.0522, longitude: -118.2437 },
    radius: 25,
    startTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    status: 'active',
  },
  {
    id: 'disaster-2',
    name: 'Santa Monica Wildfire',
    type: 'wildfire',
    severity: 3,
    location: { latitude: 34.0195, longitude: -118.4912 },
    radius: 15,
    startTime: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    status: 'contained',
  },
  {
    id: 'disaster-3',
    name: 'San Fernando Valley Flash Flood',
    type: 'flood',
    severity: 2,
    location: { latitude: 34.1825, longitude: -118.4397 },
    radius: 10,
    startTime: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    endTime: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    status: 'resolved',
  },
];

// Mock SOS Alerts
export const mockAlerts: SOSAlert[] = [
  {
    id: 'sos-1',
    userId: 'civilian@relieflink.org',
    location: { latitude: 34.0522, longitude: -118.2437 },
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    status: 'new',
    message: 'Trapped in building after earthquake. Need immediate assistance.',
    medicalInfo: 'Asthma, running low on medication',
    priority: 'critical',
  },
  {
    id: 'sos-2',
    userId: 'civilian-2',
    location: { latitude: 34.0511, longitude: -118.2426 },
    timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    status: 'acknowledged',
    message: 'Family of 4 needs evacuation from flooded area',
    priority: 'high',
    responderId: 'responder@relieflink.org',
  },
  {
    id: 'sos-3',
    userId: 'civilian-3',
    location: { latitude: 34.0489, longitude: -118.2467 },
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    status: 'responding',
    message: 'Minor injuries, need medical assistance',
    priority: 'medium',
    responderId: 'responder-2',
    responseTime: Date.now() - 1000 * 60 * 50, // 50 minutes ago
  },
  {
    id: 'sos-4',
    userId: 'civilian-4',
    location: { latitude: 34.0543, longitude: -118.2513 },
    timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    status: 'resolved',
    message: 'Need water and basic supplies',
    priority: 'low',
    responderId: 'volunteer@relieflink.org',
    responseTime: Date.now() - 1000 * 60 * 80, // 1 hour 20 minutes ago
  },
];

// Mock Resources
export const mockResources: Resource[] = [
  {
    id: 'resource-1',
    type: 'water',
    name: 'Bottled Water',
    quantity: 1000,
    unit: 'bottles',
    location: { latitude: 34.0689, longitude: -118.4452 },
    status: 'available',
  },
  {
    id: 'resource-2',
    type: 'food',
    name: 'MRE Packs',
    quantity: 500,
    unit: 'packs',
    location: { latitude: 34.0689, longitude: -118.4452 },
    status: 'available',
  },
  {
    id: 'resource-3',
    type: 'medical',
    name: 'First Aid Kits',
    quantity: 200,
    unit: 'kits',
    location: { latitude: 34.0195, longitude: -118.4912 },
    status: 'in-transit',
    assignedTo: 'sos-1',
  },
  {
    id: 'resource-4',
    type: 'shelter',
    name: 'Emergency Tents',
    quantity: 50,
    unit: 'tents',
    location: { latitude: 34.0611, longitude: -118.2368 },
    status: 'deployed',
    assignedTo: 'shelter-zone-1',
  },
];

// Mock Volunteers
export const mockVolunteers: Volunteer[] = [
  {
    id: 'volunteer-1',
    userId: 'volunteer@relieflink.org',
    skills: ['first-aid', 'search-rescue', 'logistics'],
    availability: true,
    location: { latitude: 34.0689, longitude: -118.4452 },
  },
  {
    id: 'volunteer-2',
    userId: 'volunteer-2',
    skills: ['medical', 'driving', 'languages'],
    availability: true,
    location: { latitude: 34.0515, longitude: -118.2707 },
    assignedAlerts: ['sos-2'],
  },
  {
    id: 'volunteer-3',
    userId: 'volunteer-3',
    skills: ['construction', 'heavy-lifting', 'cooking'],
    availability: false,
    location: { latitude: 34.1825, longitude: -118.4397 },
    assignedAlerts: ['sos-4'],
  },
];

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: 'donation-1',
    donorId: 'donor-1',
    amount: 500,
    currency: 'USD',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'confirmed',
  },
  {
    id: 'donation-2',
    donorId: 'donor-2',
    amount: 1000,
    currency: 'USD',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'allocated',
    allocatedTo: 'disaster-1',
  },
  {
    id: 'donation-3',
    amount: 250,
    currency: 'USD',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'pending',
  },
  {
    id: 'donation-4',
    donorId: 'donor-3',
    amount: 5000,
    currency: 'USD',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    transactionHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    status: 'delivered',
    allocatedTo: 'medical-supplies',
  },
];

// Mock Notifications
export const mockNotifications: NotificationType[] = [
  {
    id: 'notification-1',
    type: 'sos',
    message: 'New critical SOS alert received',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    read: false,
    priority: 'critical',
    relatedId: 'sos-1',
  },
  {
    id: 'notification-2',
    type: 'resource',
    message: 'Medical supplies dispatched to downtown shelter',
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    read: false,
    priority: 'medium',
    relatedId: 'resource-3',
  },
  {
    id: 'notification-3',
    type: 'volunteer',
    message: 'New volunteer joined the rescue team',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: true,
    priority: 'low',
    relatedId: 'volunteer-1',
  },
  {
    id: 'notification-4',
    type: 'donation',
    message: 'New donation of $500 received',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    read: true,
    priority: 'medium',
    relatedId: 'donation-1',
  },
  {
    id: 'notification-5',
    type: 'system',
    message: 'System update: New disaster zones mapped',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
    read: true,
    priority: 'high',
  },
];