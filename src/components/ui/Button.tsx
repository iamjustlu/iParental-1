import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => (
    <>
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.text.primary}
          size="small"
          style={styles.loader}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
      {rightIcon && !loading && rightIcon}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.gradients.button}
          style={[styles.gradient, styles[size]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyles, styles[variant]]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: theme.spacing[4],
  },
  md: {
    height: 48,
    paddingHorizontal: theme.spacing[6],
  },
  lg: {
    height: 56,
    paddingHorizontal: theme.spacing[8],
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Gradient
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: theme.borderRadius.md,
  },
  
  // Text styles
  text: {
    fontWeight: theme.typography.fontWeights.semibold,
    textAlign: 'center',
  },
  smText: {
    fontSize: theme.typography.fontSizes.sm,
  },
  mdText: {
    fontSize: theme.typography.fontSizes.base,
  },
  lgText: {
    fontSize: theme.typography.fontSizes.lg,
  },
  
  // Text variants
  primaryText: {
    color: theme.colors.text.primary,
  },
  secondaryText: {
    color: theme.colors.text.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
  
  // Loading
  loader: {
    marginRight: theme.spacing[2],
  },
});
