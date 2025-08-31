import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://cccrhuatubtgwnfyhafl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjY3JodWF0dWJ0Z3duZnloYWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTI3NzEsImV4cCI6MjA3MjA2ODc3MX0.NAQtylJW6j3corpkQieoeP_QEj2n7OH1x2OM1gR6OUk';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone_number?: string;
          created_at: string;
          updated_at: string;
          subscription_tier: 'free' | 'premium';
          biometric_enabled: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone_number?: string;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'premium';
          biometric_enabled?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone_number?: string;
          updated_at?: string;
          subscription_tier?: 'free' | 'premium';
          biometric_enabled?: boolean;
        };
      };
      child_profiles: {
        Row: {
          id: string;
          parent_id: string;
          name: string;
          date_of_birth: string;
          profile_image?: string;
          pin?: string;
          device_token?: string;
          age_group: 'preschool' | 'child' | 'teen' | 'custom';
          nextdns_config_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          name: string;
          date_of_birth: string;
          profile_image?: string;
          pin?: string;
          device_token?: string;
          age_group: 'preschool' | 'child' | 'teen' | 'custom';
          nextdns_config_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          name?: string;
          date_of_birth?: string;
          profile_image?: string;
          pin?: string;
          device_token?: string;
          age_group?: 'preschool' | 'child' | 'teen' | 'custom';
          nextdns_config_id?: string;
          updated_at?: string;
        };
      };
      child_settings: {
        Row: {
          id: string;
          child_id: string;
          screen_time_limit: number;
          allowed_apps: string[];
          blocked_apps: string[];
          blocked_websites: string[];
          allowed_websites: string[];
          bedtime: string;
          wake_time: string;
          content_filter_level: 'strict' | 'moderate' | 'relaxed' | 'custom';
          homework_mode: boolean;
          location_tracking_enabled: boolean;
          task_rewards_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          screen_time_limit?: number;
          allowed_apps?: string[];
          blocked_apps?: string[];
          blocked_websites?: string[];
          allowed_websites?: string[];
          bedtime?: string;
          wake_time?: string;
          content_filter_level?: 'strict' | 'moderate' | 'relaxed' | 'custom';
          homework_mode?: boolean;
          location_tracking_enabled?: boolean;
          task_rewards_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          child_id?: string;
          screen_time_limit?: number;
          allowed_apps?: string[];
          blocked_apps?: string[];
          blocked_websites?: string[];
          allowed_websites?: string[];
          bedtime?: string;
          wake_time?: string;
          content_filter_level?: 'strict' | 'moderate' | 'relaxed' | 'custom';
          homework_mode?: boolean;
          location_tracking_enabled?: boolean;
          task_rewards_enabled?: boolean;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          child_id: string;
          title: string;
          description?: string;
          category: 'chores' | 'homework' | 'exercise' | 'reading' | 'music_practice' | 'personal_care' | 'family_time' | 'other';
          due_date: string;
          is_completed: boolean;
          completed_at?: string;
          is_recurring: boolean;
          recurrence_pattern?: any;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          points_reward: number;
          time_reward?: number;
          verification_required: boolean;
          verification_photo?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          title: string;
          description?: string;
          category: 'chores' | 'homework' | 'exercise' | 'reading' | 'music_practice' | 'personal_care' | 'family_time' | 'other';
          due_date: string;
          is_completed?: boolean;
          completed_at?: string;
          is_recurring?: boolean;
          recurrence_pattern?: any;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          points_reward?: number;
          time_reward?: number;
          verification_required?: boolean;
          verification_photo?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          child_id?: string;
          title?: string;
          description?: string;
          category?: 'chores' | 'homework' | 'exercise' | 'reading' | 'music_practice' | 'personal_care' | 'family_time' | 'other';
          due_date?: string;
          is_completed?: boolean;
          completed_at?: string;
          is_recurring?: boolean;
          recurrence_pattern?: any;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          points_reward?: number;
          time_reward?: number;
          verification_required?: boolean;
          verification_photo?: string;
          updated_at?: string;
        };
      };
      location_history: {
        Row: {
          id: string;
          child_id: string;
          latitude: number;
          longitude: number;
          address?: string;
          accuracy: number;
          battery_level?: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          latitude: number;
          longitude: number;
          address?: string;
          accuracy: number;
          battery_level?: number;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          child_id?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          accuracy?: number;
          battery_level?: number;
          timestamp?: string;
        };
      };
      geofence_zones: {
        Row: {
          id: string;
          name: string;
          center_latitude: number;
          center_longitude: number;
          radius: number;
          type: 'home' | 'school' | 'friend' | 'safe_zone' | 'restricted' | 'custom';
          is_active: boolean;
          notify_on_entry: boolean;
          notify_on_exit: boolean;
          child_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          center_latitude: number;
          center_longitude: number;
          radius: number;
          type: 'home' | 'school' | 'friend' | 'safe_zone' | 'restricted' | 'custom';
          is_active?: boolean;
          notify_on_entry?: boolean;
          notify_on_exit?: boolean;
          child_ids: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          center_latitude?: number;
          center_longitude?: number;
          radius?: number;
          type?: 'home' | 'school' | 'friend' | 'safe_zone' | 'restricted' | 'custom';
          is_active?: boolean;
          notify_on_entry?: boolean;
          notify_on_exit?: boolean;
          child_ids?: string[];
          updated_at?: string;
        };
      };
      screen_time_logs: {
        Row: {
          id: string;
          child_id: string;
          date: string;
          total_screen_time: number;
          app_usage: any;
          pickup_count: number;
          notification_count: number;
          most_used_app: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          date: string;
          total_screen_time: number;
          app_usage: any;
          pickup_count: number;
          notification_count: number;
          most_used_app: string;
          created_at?: string;
        };
        Update: {
          child_id?: string;
          date?: string;
          total_screen_time?: number;
          app_usage?: any;
          pickup_count?: number;
          notification_count?: number;
          most_used_app?: string;
        };
      };
    };
  };
}
