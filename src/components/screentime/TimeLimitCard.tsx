import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '@/components/ui/Button';
import { theme } from '@/theme';

interface TimeLimitCardProps {
  childName: string;
  dailyLimit: number; // minutes
  timeUsed: number; // minutes
  timeRemaining: number; // minutes
  isActive: boolean;
  onSetLimit: () => void;
  onPause: () => void;
  onResume: () => void;
  onAddBonusTime: () => void;
}

export const TimeLimitCard: React.FC<TimeLimitCardProps> = ({
  childName,
  dailyLimit,
  timeUsed,
  timeRemaining,
  isActive,
  onSetLimit,
  onPause,
  onResume,
  onAddBonusTime,
}) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = (): number => {
    if (dailyLimit === 0) return 0;
    return Math.min((timeUsed / dailyLimit) * 100, 100);
  };

  const getProgressColor = (): string => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return theme.colors.status.error;
    if (percentage >= 75) return theme.colors.status.warning;
    return theme.colors.status.success;
  };

  const handleEmergencyPause = () => {
    Alert.alert(
      'Emergency Pause',
      `This will immediately pause screen time for ${childName}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pause', style: 'destructive', onPress: onPause },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradients.card}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{childName}</Text>
            <View style={[styles.statusDot, { backgroundColor: isActive ? theme.colors.status.success : theme.colors.status.error }]} />
          </View>
          <TouchableOpacity onPress={onSetLimit} style={styles.settingsButton}>
            <Icon name="settings-outline" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Progress Circle */}
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <View style={[styles.progressBackground, { borderColor: `${getProgressColor()}20` }]}>
              <View style={[
                styles.progressFill,
                {
                  borderColor: getProgressColor(),
                  transform: [{ rotate: `${(getProgressPercentage() / 100) * 360}deg` }],
                }
              ]} />
            </View>
            <View style={styles.timeDisplay}>
              <Text style={styles.timeUsed}>{formatTime(timeUsed)}</Text>
              <Text style={styles.timeLimit}>of {formatTime(dailyLimit)}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, { color: getProgressColor() }]}>
              {formatTime(Math.max(0, timeRemaining))}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>
              {getProgressPercentage().toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          {isActive ? (
            <Button
              title="Pause"
              onPress={handleEmergencyPause}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
          ) : (
            <Button
              title="Resume"
              onPress={onResume}
              variant="secondary"
              size="sm"
              style={styles.actionButton}
            />
          )}
          
          <Button
            title="Add Time"
            onPress={onAddBonusTime}
            variant="ghost"
            size="sm"
            leftIcon={<Icon name="add-outline" size={16} color={theme.colors.primary} />}
            style={styles.actionButton}
          />
        </View>

        {/* Warning */}
        {timeRemaining <= 30 && timeRemaining > 0 && (
          <View style={styles.warningBanner}>
            <Icon name="warning-outline" size={16} color={theme.colors.status.warning} />
            <Text style={styles.warningText}>
              Less than {timeRemaining} minutes remaining
            </Text>
          </View>
        )}

        {timeRemaining <= 0 && (
          <View style={[styles.warningBanner, { backgroundColor: theme.colors.transparent.error }]}>
            <Icon name="time-outline" size={16} color={theme.colors.status.error} />
            <Text style={[styles.warningText, { color: theme.colors.status.error }]}>
              Daily limit reached
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },

  gradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    ...theme.shadows.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },

  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  childName: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing[2],
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  settingsButton: {
    padding: theme.spacing[1],
  },

  progressSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },

  progressCircle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: theme.colors.border.secondary,
  },

  progressFill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },

  timeDisplay: {
    position: 'absolute',
    alignItems: 'center',
  },

  timeUsed: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  timeLimit: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing[6],
  },

  statItem: {
    alignItems: 'center',
  },

  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },

  statValue: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },

  actionButton: {
    flex: 1,
  },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.warning,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing[4],
  },

  warningText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.warning,
    marginLeft: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },
});
