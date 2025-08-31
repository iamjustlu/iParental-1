import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain from 'react-native-keychain';
import {
  ApiResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  ChildProfile,
} from '@/types';
import { supabase } from './supabaseClient';
import { nextdnsService } from './nextdnsService';

class AuthService {
  private readonly CREDENTIALS_KEY = 'stored_credentials';

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; childProfiles: ChildProfile[] }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        // Get user profile and child profiles
        const [userResult, childProfilesResult] = await Promise.all([
          supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single(),
          supabase
            .from('child_profiles')
            .select('*')
            .eq('parent_id', data.user.id)
        ]);

        if (userResult.error) {
          return {
            success: false,
            error: userResult.error.message,
          };
        }

        const user: User = {
          id: userResult.data.id,
          email: userResult.data.email,
          name: userResult.data.name,
          phoneNumber: userResult.data.phone_number,
          createdAt: new Date(userResult.data.created_at),
          updatedAt: new Date(userResult.data.updated_at),
          subscription: userResult.data.subscription_tier as any,
          biometricEnabled: userResult.data.biometric_enabled,
        };

        const childProfiles: ChildProfile[] = (childProfilesResult.data || []).map(profile => ({
          id: profile.id,
          parentId: profile.parent_id,
          name: profile.name,
          dateOfBirth: new Date(profile.date_of_birth),
          profileImage: profile.profile_image,
          pin: profile.pin,
          deviceToken: profile.device_token,
          ageGroup: profile.age_group as any,
          settings: {
            screenTimeLimit: 480,
            allowedApps: [],
            blockedApps: [],
            blockedWebsites: [],
            allowedWebsites: [],
            bedtime: '21:00',
            wakeTime: '07:00',
            contentFilterLevel: 'moderate' as any,
            homeworkMode: false,
            locationTrackingEnabled: true,
            taskRewardsEnabled: true,
          },
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
        }));

        // Store credentials securely for biometric login
        await this.storeCredentials(credentials);

        return {
          success: true,
          data: { user, childProfiles },
        };
      }

      return {
        success: false,
        error: 'Login failed',
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: credentials.email,
            name: credentials.name,
            phone_number: credentials.phoneNumber,
            subscription_tier: 'free',
            biometric_enabled: false,
          });

        if (profileError) {
          return {
            success: false,
            error: profileError.message,
          };
        }

        const user: User = {
          id: data.user.id,
          email: credentials.email,
          name: credentials.name,
          phoneNumber: credentials.phoneNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
          subscription: 'free' as any,
          biometricEnabled: false,
        };

        // Store credentials securely
        await this.storeCredentials({
          email: credentials.email,
          password: credentials.password,
        });

        return {
          success: true,
          data: { user },
        };
      }

      return {
        success: false,
        error: 'Registration failed',
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call success
      await AsyncStorage.removeItem('auth_token');
      await this.clearStoredCredentials();
    }
  }

  async getUserData(userId: string): Promise<ApiResponse<{ user: User; childProfiles: ChildProfile[] }>> {
    try {
      const response = await apiClient.get(`/auth/user/${userId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      
      return {
        success: false,
        error: response.data.message || 'Failed to fetch user data',
      };
    } catch (error: any) {
      console.error('Get user data error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  async createChildProfile(profileData: Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ChildProfile>> {
    try {
      // Create NextDNS configuration for the child
      const nextdnsResult = await nextdnsService.createConfiguration(
        profileData.name,
        profileData.ageGroup as any
      );

      let nextdnsConfigId: string | undefined;
      if (nextdnsResult.success && nextdnsResult.data) {
        nextdnsConfigId = nextdnsResult.data.configId;
      }

      // Create child profile in Supabase
      const { data, error } = await supabase
        .from('child_profiles')
        .insert({
          parent_id: profileData.parentId,
          name: profileData.name,
          date_of_birth: profileData.dateOfBirth.toISOString(),
          profile_image: profileData.profileImage,
          pin: profileData.pin,
          device_token: profileData.deviceToken,
          age_group: profileData.ageGroup,
          nextdns_config_id: nextdnsConfigId,
        })
        .select()
        .single();

      if (error) {
        // If child profile creation fails, cleanup NextDNS config
        if (nextdnsConfigId) {
          await nextdnsService.deleteConfiguration(nextdnsConfigId);
        }
        return {
          success: false,
          error: error.message,
        };
      }

      // Create default settings for the child
      await supabase
        .from('child_settings')
        .insert({
          child_id: data.id,
          screen_time_limit: 480, // 8 hours default
          allowed_apps: [],
          blocked_apps: [],
          blocked_websites: [],
          allowed_websites: [],
          bedtime: '21:00',
          wake_time: '07:00',
          content_filter_level: 'moderate',
          homework_mode: false,
          location_tracking_enabled: true,
          task_rewards_enabled: true,
        });

      const childProfile: ChildProfile = {
        id: data.id,
        parentId: data.parent_id,
        name: data.name,
        dateOfBirth: new Date(data.date_of_birth),
        profileImage: data.profile_image,
        pin: data.pin,
        deviceToken: data.device_token,
        ageGroup: data.age_group as any,
        settings: {
          screenTimeLimit: 480,
          allowedApps: [],
          blockedApps: [],
          blockedWebsites: [],
          allowedWebsites: [],
          bedtime: '21:00',
          wakeTime: '07:00',
          contentFilterLevel: 'moderate' as any,
          homeworkMode: false,
          locationTrackingEnabled: true,
          taskRewardsEnabled: true,
        },
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      return {
        success: true,
        data: childProfile,
      };
    } catch (error: any) {
      console.error('Create child profile error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  async updateChildProfile(id: string, updates: Partial<ChildProfile>): Promise<ApiResponse<ChildProfile>> {
    try {
      const response = await apiClient.put(`/auth/child-profiles/${id}`, updates);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      
      return {
        success: false,
        error: response.data.message || 'Failed to update child profile',
      };
    } catch (error: any) {
      console.error('Update child profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  async deleteChildProfile(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/auth/child-profiles/${id}`);
      
      if (response.data.success) {
        return { success: true };
      }
      
      return {
        success: false,
        error: response.data.message || 'Failed to delete child profile',
      };
    } catch (error: any) {
      console.error('Delete child profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  async verifyChildPin(childId: string, pin: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiClient.post('/auth/verify-child-pin', {
        childId,
        pin,
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Verify child PIN error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Network error',
      };
    }
  }

  // Private methods for credential storage
  private async storeCredentials(credentials: LoginCredentials): Promise<void> {
    try {
      await Keychain.setInternetCredentials(
        this.CREDENTIALS_KEY,
        credentials.email,
        credentials.password
      );
    } catch (error) {
      console.error('Store credentials error:', error);
    }
  }

  async getStoredCredentials(): Promise<LoginCredentials | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(this.CREDENTIALS_KEY);
      if (credentials && credentials.username && credentials.password) {
        return {
          email: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Get stored credentials error:', error);
      return null;
    }
  }

  private async clearStoredCredentials(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(this.CREDENTIALS_KEY);
    } catch (error) {
      console.error('Clear credentials error:', error);
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Get auth token error:', error);
      return null;
    }
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;

      const response = await apiClient.get('/auth/verify-token');
      return response.data.success;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
