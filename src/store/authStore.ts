import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthState,
  User,
  ChildProfile,
  LoginCredentials,
  RegisterCredentials,
  BiometricAuthResult,
} from '@/types';
import { authService } from '@/services/authService';
import { biometricService } from '@/services/biometricService';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithBiometric: () => Promise<BiometricAuthResult>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  createChildProfile: (profile: Omit<ChildProfile, 'id' | 'parentId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateChildProfile: (id: string, updates: Partial<ChildProfile>) => Promise<boolean>;
  deleteChildProfile: (id: string) => Promise<boolean>;
  setActiveChildProfile: (profile: ChildProfile | null) => void;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      childProfiles: [],
      activeChildProfile: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          if (response.success && response.data) {
            const { user, childProfiles } = response.data;
            set({
              user,
              childProfiles,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      loginWithBiometric: async () => {
        set({ isLoading: true });
        try {
          const biometricResult = await biometricService.authenticate();
          if (biometricResult.success) {
            // Retrieve stored credentials and login
            const storedCredentials = await authService.getStoredCredentials();
            if (storedCredentials) {
              const loginSuccess = await get().login(storedCredentials);
              set({ isLoading: false });
              return { success: loginSuccess };
            }
          }
          set({ isLoading: false });
          return biometricResult;
        } catch (error) {
          console.error('Biometric login error:', error);
          set({ isLoading: false });
          return { success: false, error: 'Biometric authentication failed' };
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(credentials);
          if (response.success && response.data) {
            const { user } = response.data;
            set({
              user,
              childProfiles: [],
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            user: null,
            childProfiles: [],
            activeChildProfile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      createChildProfile: async (profileData) => {
        const { user } = get();
        if (!user) return false;

        try {
          const response = await authService.createChildProfile({
            ...profileData,
            parentId: user.id,
          });
          
          if (response.success && response.data) {
            const currentProfiles = get().childProfiles;
            set({
              childProfiles: [...currentProfiles, response.data],
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Create child profile error:', error);
          return false;
        }
      },

      updateChildProfile: async (id, updates) => {
        try {
          const response = await authService.updateChildProfile(id, updates);
          if (response.success && response.data) {
            const currentProfiles = get().childProfiles;
            const updatedProfiles = currentProfiles.map(profile =>
              profile.id === id ? { ...profile, ...updates } : profile
            );
            set({ childProfiles: updatedProfiles });
            
            // Update active profile if it's the one being updated
            const activeProfile = get().activeChildProfile;
            if (activeProfile && activeProfile.id === id) {
              set({ activeChildProfile: { ...activeProfile, ...updates } });
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error('Update child profile error:', error);
          return false;
        }
      },

      deleteChildProfile: async (id) => {
        try {
          const response = await authService.deleteChildProfile(id);
          if (response.success) {
            const currentProfiles = get().childProfiles;
            const updatedProfiles = currentProfiles.filter(profile => profile.id !== id);
            set({ childProfiles: updatedProfiles });
            
            // Clear active profile if it's the one being deleted
            const activeProfile = get().activeChildProfile;
            if (activeProfile && activeProfile.id === id) {
              set({ activeChildProfile: null });
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error('Delete child profile error:', error);
          return false;
        }
      },

      setActiveChildProfile: (profile) => {
        set({ activeChildProfile: profile });
      },

      enableBiometric: async () => {
        try {
          const isAvailable = await biometricService.isBiometricAvailable();
          if (!isAvailable) return false;

          const result = await biometricService.enableBiometric();
          if (result.success) {
            const user = get().user;
            if (user) {
              set({
                user: { ...user, biometricEnabled: true },
              });
            }
            return true;
          }
          return false;
        } catch (error) {
          console.error('Enable biometric error:', error);
          return false;
        }
      },

      disableBiometric: async () => {
        try {
          await biometricService.disableBiometric();
          const user = get().user;
          if (user) {
            set({
              user: { ...user, biometricEnabled: false },
            });
          }
          return true;
        } catch (error) {
          console.error('Disable biometric error:', error);
          return false;
        }
      },

      refreshUserData: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await authService.getUserData(user.id);
          if (response.success && response.data) {
            const { user: updatedUser, childProfiles } = response.data;
            set({
              user: updatedUser,
              childProfiles,
            });
          }
        } catch (error) {
          console.error('Refresh user data error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        childProfiles: state.childProfiles,
        activeChildProfile: state.activeChildProfile,
      }),
    }
  )
);
