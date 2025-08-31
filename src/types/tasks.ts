export interface Task {
  id: string;
  childId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  dueDate: Date;
  isCompleted: boolean;
  completedAt?: Date;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  priority: TaskPriority;
  pointsReward: number;
  timeReward?: number; // extra screen time in minutes
  verificationRequired: boolean;
  verificationPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskCategory {
  CHORES = 'chores',
  HOMEWORK = 'homework',
  EXERCISE = 'exercise',
  READING = 'reading',
  MUSIC_PRACTICE = 'music_practice',
  PERSONAL_CARE = 'personal_care',
  FAMILY_TIME = 'family_time',
  OTHER = 'other'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  endDate?: Date;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  childId: string;
  completedAt: Date;
  verificationPhoto?: string;
  parentApproved: boolean;
  pointsAwarded: number;
  timeAwarded?: number;
  notes?: string;
}

export interface PointsTransaction {
  id: string;
  childId: string;
  type: 'earned' | 'spent' | 'bonus' | 'penalty';
  amount: number;
  description: string;
  relatedTaskId?: string;
  relatedRewardId?: string;
  timestamp: Date;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  pointsCost: number;
  timeCost?: number; // screen time cost in minutes
  isActive: boolean;
  category: RewardCategory;
  icon?: string;
  createdAt: Date;
}

export enum RewardCategory {
  SCREEN_TIME = 'screen_time',
  TREATS = 'treats',
  ACTIVITIES = 'activities',
  PRIVILEGES = 'privileges',
  TOYS = 'toys',
  MONEY = 'money',
  OTHER = 'other'
}

export interface ChildPoints {
  childId: string;
  totalPoints: number;
  availablePoints: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  nextLevelPoints: number;
  lastUpdated: Date;
}
