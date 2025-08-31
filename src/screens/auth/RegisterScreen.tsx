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
import { RegisterCredentials } from '@/types';
import { theme } from '@/theme';

interface RegisterForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const RegisterScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const handleRegister = async (data: RegisterForm) => {
    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const credentials: RegisterCredentials = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        phoneNumber: data.phoneNumber.trim() || undefined,
      };

      const success = await register(credentials);
      if (!success) {
        Alert.alert('Registration Failed', 'An account with this email already exists or there was an error.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'Feature coming soon!');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Feature coming soon!');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join iParental and start protecting your family's digital life
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  leftIcon="person-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  autoComplete="name"
                />
              )}
            />

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
              name="phoneNumber"
              rules={{
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone Number (Optional)"
                  placeholder="Enter your phone number"
                  type="phone"
                  leftIcon="call-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phoneNumber?.message}
                  autoComplete="tel"
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
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: 'Password must contain uppercase, lowercase, number and special character',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Create a strong password"
                  type="password"
                  leftIcon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  autoComplete="new-password"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  leftIcon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
              )}
            />

            <TouchableOpacity
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={styles.termsContainer}
            >
              <View style={styles.checkbox}>
                {acceptTerms && (
                  <Icon name="checkmark" size={16} color={theme.colors.primary} />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.linkText} onPress={handleTermsPress}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText} onPress={handlePrivacyPress}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            <Button
              title="Create Account"
              onPress={handleSubmit(handleRegister)}
              loading={isLoading}
              fullWidth
              style={styles.registerButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <TouchableOpacity>
                <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: theme.spacing[8],
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
  
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[6],
  },
  
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
    marginTop: 2,
  },
  
  termsText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
  },
  
  linkText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.medium,
  },
  
  registerButton: {
    marginBottom: theme.spacing[6],
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  
  signInText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeights.semibold,
  },
});
