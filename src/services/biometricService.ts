import ReactNativeBiometrics from 'react-native-biometrics';
import { BiometricAuthResult } from '@/types';

class BiometricService {
  private rnBiometrics: ReactNativeBiometrics;
  private readonly BIOMETRIC_KEY = 'iparental_biometric_key';

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  async isBiometricAvailable(): Promise<boolean> {
    try {
      const { available } = await this.rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Check biometric availability error:', error);
      return false;
    }
  }

  async getBiometricType(): Promise<string | null> {
    try {
      const { biometryType } = await this.rnBiometrics.isSensorAvailable();
      return biometryType || null;
    } catch (error) {
      console.error('Get biometric type error:', error);
      return null;
    }
  }

  async enableBiometric(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device',
        };
      }

      // Check if keys already exist
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      
      if (!keysExist) {
        // Create biometric keys
        const { publicKey } = await this.rnBiometrics.createKeys();
        if (!publicKey) {
          return {
            success: false,
            error: 'Failed to create biometric keys',
          };
        }
      }

      // Test biometric authentication
      const authResult = await this.authenticate();
      return authResult;
    } catch (error: any) {
      console.error('Enable biometric error:', error);
      return {
        success: false,
        error: error.message || 'Failed to enable biometric authentication',
      };
    }
  }

  async disableBiometric(): Promise<void> {
    try {
      await this.rnBiometrics.deleteKeys();
    } catch (error) {
      console.error('Disable biometric error:', error);
    }
  }

  async authenticate(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      }

      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      if (!keysExist) {
        return {
          success: false,
          error: 'Biometric authentication is not set up',
        };
      }

      const biometricType = await this.getBiometricType();
      let promptMessage = 'Authenticate with your biometric';
      
      if (biometricType === 'Face ID' || biometricType === 'FaceID') {
        promptMessage = 'Authenticate with Face ID';
      } else if (biometricType === 'TouchID' || biometricType === 'Fingerprint') {
        promptMessage = 'Authenticate with your fingerprint';
      }

      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage,
        payload: this.BIOMETRIC_KEY,
      });

      if (success && signature) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Biometric authentication failed',
        };
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('UserCancel')) {
        return {
          success: false,
          error: 'Authentication was cancelled',
        };
      } else if (error.message?.includes('UserFallback')) {
        return {
          success: false,
          error: 'User chose to use password instead',
        };
      } else if (error.message?.includes('SystemCancel')) {
        return {
          success: false,
          error: 'Authentication was cancelled by the system',
        };
      } else if (error.message?.includes('AuthenticationFailed')) {
        return {
          success: false,
          error: 'Authentication failed - please try again',
        };
      } else if (error.message?.includes('BiometryNotAvailable')) {
        return {
          success: false,
          error: 'Biometric authentication is not available',
        };
      } else if (error.message?.includes('BiometryNotEnrolled')) {
        return {
          success: false,
          error: 'No biometric credentials are enrolled',
        };
      } else if (error.message?.includes('BiometryLockout')) {
        return {
          success: false,
          error: 'Biometric authentication is locked out',
        };
      }

      return {
        success: false,
        error: error.message || 'Biometric authentication failed',
      };
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      return keysExist;
    } catch (error) {
      console.error('Check biometric enabled error:', error);
      return false;
    }
  }
}

export const biometricService = new BiometricService();
