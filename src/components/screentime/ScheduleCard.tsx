import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';

interface ScheduleRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: number[];
  isActive: boolean;
}

interface ScheduleCardProps {
  schedules: ScheduleRule[];
  onEditSchedule: (schedule: ScheduleRule) => void;
  onToggleSchedule: (scheduleId: string, isActive: boolean) => void;
  onAddSchedule: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedules,
  onEditSchedule,
  onToggleSchedule,
  onAddSchedule,
}) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysDisplay = (days: number[]): string => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.map(d => dayNames[d]).join(', ');
  };

  const renderScheduleItem = (schedule: ScheduleRule) => (
    <View key={schedule.id} style={styles.scheduleItem}>
      <TouchableOpacity
        style={styles.scheduleContent}
        onPress={() => onEditSchedule(schedule)}
      >
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleName}>{schedule.name}</Text>
          <Text style={styles.scheduleTime}>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </Text>
          <Text style={styles.scheduleDays}>
            {getDaysDisplay(schedule.days)}
          </Text>
        </View>
        
        <View style={styles.scheduleActions}>
          <Switch
            value={schedule.isActive}
            onValueChange={(value) => onToggleSchedule(schedule.id, value)}
            trackColor={{
              false: theme.colors.border.primary,
              true: theme.colors.primary,
            }}
            thumbColor={schedule.isActive ? theme.colors.text.primary : theme.colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="time-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Screen Time Schedule</Text>
        </View>
        <TouchableOpacity onPress={onAddSchedule} style={styles.addButton}>
          <Icon name="add-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Set allowed screen time periods and bedtime restrictions
      </Text>

      {schedules.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-outline" size={48} color={theme.colors.text.tertiary} />
          <Text style={styles.emptyText}>No schedules set</Text>
          <Text style={styles.emptySubtext}>
            Add a schedule to automatically restrict screen time
          </Text>
          <TouchableOpacity onPress={onAddSchedule} style={styles.emptyActionButton}>
            <Text style={styles.emptyActionText}>Add Schedule</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.schedulesList}>
          {schedules.map(renderScheduleItem)}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="moon-outline" size={20} color={theme.colors.secondary} />
          <Text style={styles.quickActionText}>Bedtime Mode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="book-outline" size={20} color={theme.colors.status.info} />
          <Text style={styles.quickActionText}>Homework Mode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <Icon name="restaurant-outline" size={20} color={theme.colors.status.warning} />
          <Text style={styles.quickActionText}>Meal Time</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },

  addButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent.primary,
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },

  schedulesList: {
    marginBottom: theme.spacing[4],
  },

  scheduleItem: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },

  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
  },

  scheduleInfo: {
    flex: 1,
  },

  scheduleName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  scheduleTime: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },

  scheduleDays: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },

  scheduleActions: {
    alignItems: 'center',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },

  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[3],
  },

  emptySubtext: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[4],
  },

  emptyActionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
  },

  emptyActionText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[2],
  },

  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.sm,
  },

  quickActionText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: 'center',
  },
});
