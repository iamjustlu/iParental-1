import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  type?: 'text' | 'password' | 'email' | 'phone';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  type = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const showPasswordToggle = isPassword && !rightIcon;

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const getAutoCapitalize = () => {
    switch (type) {
      case 'email':
        return 'none';
      case 'password':
        return 'none';
      default:
        return 'sentences';
    }
  };

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
  ];

  const inputStyles = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
    inputStyle,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          {...props}
          style={inputStyles}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={getKeyboardType()}
          autoCapitalize={getAutoCapitalize()}
          placeholderTextColor={theme.colors.text.tertiary}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={isFocused ? theme.colors.primary : theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    height: 48,
    paddingHorizontal: theme.spacing[4],
  },
  
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  
  inputContainerError: {
    borderColor: theme.colors.status.error,
  },
  
  input: {
    flex: 1,
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    padding: 0, // Remove default padding
  },
  
  inputWithLeftIcon: {
    marginLeft: theme.spacing[2],
  },
  
  inputWithRightIcon: {
    marginRight: theme.spacing[2],
  },
  
  leftIcon: {
    marginRight: theme.spacing[2],
  },
  
  rightIcon: {
    padding: theme.spacing[1],
    marginLeft: theme.spacing[2],
  },
  
  error: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.error,
    marginTop: theme.spacing[1],
  },
});
