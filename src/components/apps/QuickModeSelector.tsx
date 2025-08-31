import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';

interface Mode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

interface QuickModeSelectorProps {
  onModeSelect: (modeId: string) => void;
}

export const QuickModeSelector: React.FC<QuickModeSelectorProps> = ({
  onModeSelect,
}) => {
  const modes: Mode[] = [
    {
      id: 'homework',
      name: 'Homework Mode',
      description: 'Block distracting apps',
      icon: 'book-outline',
      color: theme.colors.status.info,
      isActive: false,
    },
    {
      id: 'bedtime',
      name: 'Bedtime Mode',
      description: 'Block all apps',
      icon: 'moon-outline',
      color: theme.colors.primary,
      isActive: false,
    },
    {
      id: 'mealtime',
      name: 'Meal Time',
      description: 'Temporary block',
      icon: 'restaurant-outline',
      color: theme.colors.status.warning,
      isActive: false,
    },
    {
      id: 'emergency',
      name: 'Emergency Lock',
      description: 'Block everything now',
      icon: 'warning-outline',
      color: theme.colors.status.error,
      isActive: false,
    },
  ];

  const handleModeSelect = (mode: Mode) => {
    if (mode.id === 'emergency') {
      Alert.alert(
        'Emergency Lock',
        'This will immediately block all apps on all devices. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Lock All',
            style: 'destructive',
            onPress: () => onModeSelect(mode.id),
          },
        ]
      );
    } else {
      onModeSelect(mode.id);
    }
  };

  const renderModeButton = (mode: Mode) => (
    <TouchableOpacity
      key={mode.id}
      style={[
        styles.modeButton,
        mode.isActive && [styles.activeModeButton, { borderColor: mode.color }],
      ]}
      onPress={() => handleModeSelect(mode)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${mode.color}20` }]}>
        <Icon name={mode.icon} size={24} color={mode.color} />
      </View>
      
      <View style={styles.modeInfo}>
        <Text style={[
          styles.modeName,
          mode.isActive && { color: mode.color },
        ]}>
          {mode.name}
        </Text>
        <Text style={styles.modeDescription}>
          {mode.description}
        </Text>
      </View>

      {mode.isActive && (
        <View style={styles.activeIndicator}>
          <View style={[styles.activeDot, { backgroundColor: mode.color }]} />
          <Text style={[styles.activeText, { color: mode.color }]}>
            Active
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="flash-outline" size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Quick Modes</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Instantly apply app restrictions for different situations
      </Text>

      <View style={styles.modesGrid}>
        {modes.map(renderModeButton)}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.customModeButton}>
          <Icon name="add-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.customModeText}>Create Custom Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },

  modesGrid: {
    gap: theme.spacing[3],
  },

  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
  },

  activeModeButton: {
    backgroundColor: theme.colors.background.secondary,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  modeInfo: {
    flex: 1,
  },

  modeName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  modeDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing[2],
  },

  activeText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },

  footer: {
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
    alignItems: 'center',
  },

  customModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.primary,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
  },

  customModeText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.primary,
    marginLeft: theme.spacing[2],
  },
});
