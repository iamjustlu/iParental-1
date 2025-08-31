export interface AppInfo {
  packageName: string;
  appName: string;
  icon?: string;
  category: AppCategory;
  isSystemApp: boolean;
  isBlocked: boolean;
  timeSpent: number; // minutes
  lastUsed: Date;
  version: string;
  installDate: Date;
}

export enum AppCategory {
  SOCIAL = 'social',
  GAMES = 'games',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  PRODUCTIVITY = 'productivity',
  UTILITIES = 'utilities',
  HEALTH = 'health',
  COMMUNICATION = 'communication',
  SYSTEM = 'system',
  OTHER = 'other'
}

export interface AppUsage {
  appName: string;
  packageName: string;
  timeSpent: number; // minutes
  openCount: number;
  lastUsed: Date;
  category: AppCategory;
}

export interface ScreenTimeData {
  childId: string;
  date: string;
  totalScreenTime: number; // minutes
  appUsage: AppUsage[];
  pickupCount: number;
  notificationCount: number;
  mostUsedApp: string;
}

export interface AppControlRule {
  id: string;
  childId: string;
  packageName: string;
  isBlocked: boolean;
  timeLimit?: number; // minutes per day
  allowedTimes?: TimeRange[];
  weekdaysOnly?: boolean;
  createdAt: Date;
}

export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}
