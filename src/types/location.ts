export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export interface GeofenceZone {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number; // meters
  type: GeofenceType;
  isActive: boolean;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  createdAt: Date;
  childIds: string[];
}

export enum GeofenceType {
  HOME = 'home',
  SCHOOL = 'school',
  FRIEND = 'friend',
  SAFE_ZONE = 'safe_zone',
  RESTRICTED = 'restricted',
  CUSTOM = 'custom'
}

export interface LocationHistory {
  id: string;
  childId: string;
  location: LocationData;
  address?: string;
  geofenceZone?: string;
  batteryLevel?: number;
}

export interface GeofenceEvent {
  id: string;
  childId: string;
  geofenceId: string;
  eventType: 'entry' | 'exit';
  timestamp: Date;
  location: LocationData;
  notificationSent: boolean;
}

export interface SafetyAlert {
  id: string;
  childId: string;
  type: AlertType;
  message: string;
  location?: LocationData;
  timestamp: Date;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export enum AlertType {
  GEOFENCE_ENTRY = 'geofence_entry',
  GEOFENCE_EXIT = 'geofence_exit',
  LOW_BATTERY = 'low_battery',
  DEVICE_OFFLINE = 'device_offline',
  PANIC_BUTTON = 'panic_button',
  SPEED_ALERT = 'speed_alert',
  LATE_ARRIVAL = 'late_arrival'
}
