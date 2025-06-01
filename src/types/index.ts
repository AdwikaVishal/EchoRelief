export interface User {
  id: string;
  name: string;
  role: 'admin' | 'responder' | 'volunteer' | 'civilian';
  location?: GeoLocation;
  medicalInfo?: string;
  contacts?: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface DisasterEvent {
  id: string;
  name: string;
  type: 'earthquake' | 'flood' | 'hurricane' | 'wildfire' | 'tsunami' | 'other';
  severity: 1 | 2 | 3 | 4 | 5;
  location: GeoLocation;
  radius: number; // affected radius in km
  startTime: number;
  endTime?: number;
  status: 'active' | 'contained' | 'resolved';
}

export interface SOSAlert {
  id: string;
  userId: string;
  location: GeoLocation;
  timestamp: number;
  status: 'new' | 'acknowledged' | 'responding' | 'resolved';
  message?: string;
  medicalInfo?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  responderId?: string;
  responseTime?: number;
}

export interface Resource {
  id: string;
  type: 'water' | 'food' | 'medical' | 'shelter' | 'clothing' | 'other';
  name: string;
  quantity: number;
  unit: string;
  location: GeoLocation;
  status: 'available' | 'in-transit' | 'deployed';
  assignedTo?: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  skills: string[];
  availability: boolean;
  location: GeoLocation;
  assignedAlerts?: string[];
}

export interface Donation {
  id: string;
  donorId?: string;
  amount: number;
  currency: string;
  timestamp: number;
  transactionHash?: string;
  allocatedTo?: string;
  status: 'pending' | 'confirmed' | 'allocated' | 'delivered';
}

export interface NotificationType {
  id: string;
  type: 'sos' | 'resource' | 'volunteer' | 'donation' | 'system';
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  relatedId?: string;
}