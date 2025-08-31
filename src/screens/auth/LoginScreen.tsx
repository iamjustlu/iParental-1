import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials } from '@/types';
import { theme } from '@/theme';
import { biometricService } from '@/services/biometricService';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  
  const { login, loginWithBiometric } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const isAvailable = await biometricService.isBiometricAvailable();
    const isEnabled = await biometricService.isBiometricEnabled();
    setBiometricAvailable(isAvailable && isEnabled);
  };

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = {
        email: data.email.toLowerCase().trim(),
        password: data.password,
      };

      const success = await login(credentials);
      if (!success) {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await loginWithBiometric();
      if (!result.success) {
        Alert.alert('Biometric Login Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert('Forgot Password', 'Feature coming soon!');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background.primary, theme.colors.background.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={theme.colors.gradients.primary}
                style={styles.logo}
              >
                <Icon name="shield-checkmark" size={32} color={theme.colors.text.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Welcome to iParental</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your family's digital wellbeing
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  leftIcon="mail-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  leftIcon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  autoComplete="password"
                />
              )}
            />

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSubmit(handleLogin)}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            {biometricAvailable && (
              <View style={styles.biometricContainer}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  onPress={handleBiometricLogin}
                  style={styles.biometricButton}
                >
                  <Icon name="finger-print" size={24} color={theme.colors.primary} />
                  <Text style={styles.biometricText}>Use Biometric</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <TouchableOpacity>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  keyboardView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[8],
  },
  
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[10],
  },
  
  logoContainer: {
    marginBottom: theme.spacing[6],
  },
  
  logo: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: theme.typography.fontSizes['3xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  
  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  
  form: {
    marginBottom: theme.spacing[8],
  },
  
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing[6],
  },
  
  forgotPasswordText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  loginButton: {
    marginBottom: theme.spacing[6],
  },
  
  biometricContainer: {
    alignItems: 'center',
  },
  
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
    width: '100%',
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.primary,
  },
  
  dividerText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing[4],
  },
  
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.transparent.primary,
  },
  
  biometricText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing[2],
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  
  signUpText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});
