import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';
import { AppInfo, AppCategory } from '@/types';

interface AppListItemProps {
  app: AppInfo;
  onToggleBlock: (packageName: string, isBlocked: boolean) => void;
  onSetTimeLimit: (packageName: string) => void;
  onViewDetails: (packageName: string) => void;
}

export const AppListItem: React.FC<AppListItemProps> = ({
  app,
  onToggleBlock,
  onSetTimeLimit,
  onViewDetails,
}) => {
  const [isBlocked, setIsBlocked] = useState(app.isBlocked);

  const getCategoryIcon = (category: AppCategory): string => {
    switch (category) {
      case AppCategory.SOCIAL:
        return 'people-outline';
      case AppCategory.GAMES:
        return 'game-controller-outline';
      case AppCategory.EDUCATION:
        return 'book-outline';
      case AppCategory.ENTERTAINMENT:
        return 'play-outline';
      case AppCategory.PRODUCTIVITY:
        return 'briefcase-outline';
      case AppCategory.UTILITIES:
        return 'construct-outline';
      case AppCategory.HEALTH:
        return 'fitness-outline';
      case AppCategory.COMMUNICATION:
        return 'chatbubbles-outline';
      default:
        return 'apps-outline';
    }
  };

  const getCategoryColor = (category: AppCategory): string => {
    switch (category) {
      case AppCategory.SOCIAL:
        return theme.colors.secondary;
      case AppCategory.GAMES:
        return theme.colors.status.error;
      case AppCategory.EDUCATION:
        return theme.colors.status.success;
      case AppCategory.ENTERTAINMENT:
        return theme.colors.status.warning;
      case AppCategory.PRODUCTIVITY:
        return theme.colors.primary;
      case AppCategory.UTILITIES:
        return theme.colors.text.tertiary;
      case AppCategory.HEALTH:
        return theme.colors.status.success;
      case AppCategory.COMMUNICATION:
        return theme.colors.secondary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatLastUsed = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 7) return date.toLocaleDateString();
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const handleToggleBlock = (value: boolean) => {
    if (value && !isBlocked) {
      Alert.alert(
        'Block App',
        `Are you sure you want to block ${app.appName}? This will prevent access to the app.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => {
              setIsBlocked(true);
              onToggleBlock(app.packageName, true);
            },
          },
        ]
      );
    } else {
      setIsBlocked(value);
      onToggleBlock(app.packageName, value);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isBlocked && styles.blockedContainer,
      ]}
      onPress={() => onViewDetails(app.packageName)}
      activeOpacity={0.8}
    >
      {/* App Icon and Info */}
      <View style={styles.appInfo}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: `${getCategoryColor(app.category)}20` },
        ]}>
          <Icon
            name={getCategoryIcon(app.category)}
            size={24}
            color={getCategoryColor(app.category)}
          />
        </View>
        
        <View style={styles.appDetails}>
          <Text style={[
            styles.appName,
            isBlocked && styles.blockedText,
          ]}>
            {app.appName}
          </Text>
          <Text style={styles.categoryText}>
            {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
          </Text>
          {app.timeSpent > 0 && (
            <Text style={styles.usageText}>
              {formatTime(app.timeSpent)} today • Last used {formatLastUsed(app.lastUsed)}
            </Text>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Time Limit Button */}
        <TouchableOpacity
          style={styles.timeLimitButton}
          onPress={() => onSetTimeLimit(app.packageName)}
        >
          <Icon name="time-outline" size={16} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        {/* Block/Unblock Switch */}
        <Switch
          value={isBlocked}
          onValueChange={handleToggleBlock}
          trackColor={{
            false: theme.colors.border.primary,
            true: theme.colors.status.error,
          }}
          thumbColor={isBlocked ? theme.colors.text.primary : theme.colors.text.tertiary}
          style={styles.switch}
        />
      </View>

      {/* Blocked Overlay */}
      {isBlocked && (
        <View style={styles.blockedOverlay}>
          <Icon name="ban-outline" size={16} color={theme.colors.status.error} />
          <Text style={styles.blockedLabel}>Blocked</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.sm,
  },

  blockedContainer: {
    backgroundColor: theme.colors.background.tertiary,
    opacity: 0.7,
  },

  appInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  appDetails: {
    flex: 1,
  },

  appName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  blockedText: {
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },

  categoryText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },

  usageText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },

  timeLimitButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.tertiary,
  },

  switch: {
    transform: [{ scale: 0.9 }],
  },

  blockedOverlay: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.error,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },

  blockedLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.status.error,
    marginLeft: theme.spacing[1],
  },
});
