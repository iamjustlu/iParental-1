export * from './auth';
export * from './app';
export * from './location';
export * from './tasks';

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChildSetup: { childId?: string };
  TaskDetail: { taskId: string };
  AppDetail: { packageName: string };
  LocationDetail: { childId: string };
  Settings: undefined;
  Profile: undefined;
  Subscription: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  ScreenTime: undefined;
  Location: undefined;
  Tasks: undefined;
  Apps: undefined;
  Filter: undefined;
  Reports: undefined;
};

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterOptions {
  childId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  status?: string;
}

// Chart and analytics types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface DashboardStats {
  totalScreenTime: number;
  totalChildren: number;
  activeAlerts: number;
  completedTasks: number;
  weeklyScreenTime: TimeSeriesData[];
  topApps: ChartDataPoint[];
  taskCompletion: ChartDataPoint[];
}

// Notification types
export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: Date;
  isRead: boolean;
  childId?: string;
}

export enum NotificationType {
  SCREEN_TIME_LIMIT = 'screen_time_limit',
  GEOFENCE_ALERT = 'geofence_alert',
  TASK_REMINDER = 'task_reminder',
  TASK_COMPLETED = 'task_completed',
  APP_BLOCKED = 'app_blocked',
  BYPASS_REQUEST = 'bypass_request',
  LOW_BATTERY = 'low_battery',
  DEVICE_OFFLINE = 'device_offline',
  WEEKLY_REPORT = 'weekly_report'
}
