import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScreenTimeChart } from '@/components/screentime/ScreenTimeChart';
import { TimeLimitCard } from '@/components/screentime/TimeLimitCard';
import { ScheduleCard } from '@/components/screentime/ScheduleCard';
import { useAuthStore } from '@/store/authStore';
import { screenTimeService } from '@/services/screenTimeService';
import { theme } from '@/theme';
import { ScreenTimeData, AppUsage } from '@/types';

interface ChildScreenTime {
  childId: string;
  childName: string;
  dailyLimit: number;
  timeUsed: number;
  timeRemaining: number;
  isActive: boolean;
}

export const ScreenTimeScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [childrenScreenTime, setChildrenScreenTime] = useState<ChildScreenTime[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [appBreakdown, setAppBreakdown] = useState<AppUsage[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  const { childProfiles, activeChildProfile } = useAuthStore();

  useEffect(() => {
    loadScreenTimeData();
  }, [childProfiles, activeChildProfile]);

  const loadScreenTimeData = async () => {
    try {
      // Mock data - in real app, this would be API calls
      const mockChildrenData: ChildScreenTime[] = childProfiles.map(child => ({
        childId: child.id,
        childName: child.name,
        dailyLimit: child.settings.screenTimeLimit || 480, // 8 hours default
        timeUsed: Math.floor(Math.random() * 400) + 100, // Random usage
        timeRemaining: Math.max(0, (child.settings.screenTimeLimit || 480) - Math.floor(Math.random() * 400) - 100),
        isActive: Math.random() > 0.3, // 70% chance of being active
      }));

      const mockWeeklyData = [
        { screenTime: 380 }, // Monday
        { screenTime: 420 }, // Tuesday
        { screenTime: 290 }, // Wednesday
        { screenTime: 450 }, // Thursday
        { screenTime: 340 }, // Friday
        { screenTime: 520 }, // Saturday
        { screenTime: 480 }, // Sunday
      ];

      const mockAppBreakdown: AppUsage[] = [
        {
          appName: 'YouTube',
          packageName: 'com.google.android.youtube',
          timeSpent: 120,
          openCount: 15,
          lastUsed: new Date(),
          category: 'entertainment' as any,
        },
        {
          appName: 'Instagram',
          packageName: 'com.instagram.android',
          timeSpent: 85,
          openCount: 25,
          lastUsed: new Date(),
          category: 'social' as any,
        },
        {
          appName: 'Games',
          packageName: 'com.games.various',
          timeSpent: 95,
          openCount: 8,
          lastUsed: new Date(),
          category: 'games' as any,
        },
        {
          appName: 'Education',
          packageName: 'com.education.apps',
          timeSpent: 60,
          openCount: 5,
          lastUsed: new Date(),
          category: 'education' as any,
        },
      ];

      setChildrenScreenTime(mockChildrenData);
      setWeeklyData(mockWeeklyData);
      setAppBreakdown(mockAppBreakdown);
    } catch (error) {
      console.error('Error loading screen time data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadScreenTimeData();
    setIsRefreshing(false);
  };

  const handleSetLimit = (childId: string) => {
    Alert.alert('Set Limit', 'Screen time limit configuration coming soon!');
  };

  const handlePause = async (childId: string) => {
    try {
      const result = await screenTimeService.pauseScreenTime(childId);
      if (result.success) {
        Alert.alert('Success', 'Screen time paused successfully');
        loadScreenTimeData();
      } else {
        Alert.alert('Error', result.error || 'Failed to pause screen time');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleResume = async (childId: string) => {
    try {
      const result = await screenTimeService.resumeScreenTime(childId);
      if (result.success) {
        Alert.alert('Success', 'Screen time resumed successfully');
        loadScreenTimeData();
      } else {
        Alert.alert('Error', result.error || 'Failed to resume screen time');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddBonusTime = (childId: string) => {
    Alert.alert(
      'Add Bonus Time',
      'How much extra time would you like to add?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '15 min', onPress: () => addBonusTime(childId, 15) },
        { text: '30 min', onPress: () => addBonusTime(childId, 30) },
        { text: '1 hour', onPress: () => addBonusTime(childId, 60) },
      ]
    );
  };

  const addBonusTime = async (childId: string, minutes: number) => {
    try {
      const result = await screenTimeService.addBonusTime(childId, minutes, 'Parent granted bonus time');
      if (result.success) {
        Alert.alert('Success', `Added ${minutes} minutes of bonus time`);
        loadScreenTimeData();
      } else {
        Alert.alert('Error', result.error || 'Failed to add bonus time');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleEditSchedule = (schedule: any) => {
    Alert.alert('Edit Schedule', 'Schedule editing coming soon!');
  };

  const handleToggleSchedule = (scheduleId: string, isActive: boolean) => {
    Alert.alert('Schedule Updated', `Schedule ${isActive ? 'enabled' : 'disabled'}`);
  };

  const handleAddSchedule = () => {
    Alert.alert('Add Schedule', 'Schedule creation coming soon!');
  };

  const mockSchedules = [
    {
      id: '1',
      name: 'School Hours',
      startTime: '08:00',
      endTime: '15:00',
      days: [1, 2, 3, 4, 5],
      isActive: true,
    },
    {
      id: '2',
      name: 'Bedtime',
      startTime: '21:00',
      endTime: '07:00',
      days: [0, 1, 2, 3, 4, 5, 6],
      isActive: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Screen Time</Text>
        <View style={styles.periodSelector}>
          {(['day', 'week', 'month'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Time Limit Cards */}
        {childrenScreenTime.map(child => (
          <TimeLimitCard
            key={child.childId}
            childName={child.childName}
            dailyLimit={child.dailyLimit}
            timeUsed={child.timeUsed}
            timeRemaining={child.timeRemaining}
            isActive={child.isActive}
            onSetLimit={() => handleSetLimit(child.childId)}
            onPause={() => handlePause(child.childId)}
            onResume={() => handleResume(child.childId)}
            onAddBonusTime={() => handleAddBonusTime(child.childId)}
          />
        ))}

        {/* Charts */}
        <ScreenTimeChart
          type="weekly"
          data={weeklyData}
          title="Weekly Screen Time"
        />

        <ScreenTimeChart
          type="app-breakdown"
          data={appBreakdown}
          title="App Usage Breakdown"
        />

        {/* Schedule */}
        <ScheduleCard
          schedules={mockSchedules}
          onEditSchedule={handleEditSchedule}
          onToggleSchedule={handleToggleSchedule}
          onAddSchedule={handleAddSchedule}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },

  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[1],
  },

  periodButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
  },

  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },

  periodButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
  },

  periodButtonTextActive: {
    color: theme.colors.text.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
});
