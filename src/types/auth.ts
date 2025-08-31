export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: SubscriptionTier;
  biometricEnabled: boolean;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  dateOfBirth: Date;
  profileImage?: string;
  pin?: string;
  deviceToken?: string;
  ageGroup: AgeGroup;
  settings: ChildSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildSettings {
  screenTimeLimit: number; // minutes per day
  allowedApps: string[];
  blockedApps: string[];
  blockedWebsites: string[];
  allowedWebsites: string[];
  bedtime: string; // HH:MM format
  wakeTime: string; // HH:MM format
  contentFilterLevel: ContentFilterLevel;
  homeworkMode: boolean;
  locationTrackingEnabled: boolean;
  taskRewardsEnabled: boolean;
}

export enum AgeGroup {
  PRESCHOOL = 'preschool', // 3-5
  CHILD = 'child', // 6-12
  TEEN = 'teen', // 13-17
  CUSTOM = 'custom'
}

export enum ContentFilterLevel {
  STRICT = 'strict',
  MODERATE = 'moderate',
  RELAXED = 'relaxed',
  CUSTOM = 'custom'
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium'
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  childProfiles: ChildProfile[];
  activeChildProfile: ChildProfile | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  phoneNumber?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}
