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
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AlertsList } from '@/components/dashboard/AlertsList';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import { DashboardStats, SafetyAlert, TimeSeriesData } from '@/types';

export const DashboardScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<SafetyAlert[]>([]);
  
  const { user, childProfiles, activeChildProfile, setActiveChildProfile } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, [activeChildProfile]);

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app, this would be API calls
      const mockStats: DashboardStats = {
        totalScreenTime: 4.5, // hours
        totalChildren: childProfiles.length,
        activeAlerts: 2,
        completedTasks: 8,
        weeklyScreenTime: [
          { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), value: 3.2 },
          { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), value: 4.1 },
          { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), value: 2.8 },
          { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), value: 5.2 },
          { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), value: 3.7 },
          { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), value: 4.5 },
          { timestamp: new Date(), value: 4.5 },
        ],
        topApps: [
          { label: 'YouTube', value: 35, color: theme.colors.status.error },
          { label: 'Games', value: 25, color: theme.colors.primary },
          { label: 'Social', value: 20, color: theme.colors.secondary },
          { label: 'Education', value: 20, color: theme.colors.status.success },
        ],
        taskCompletion: [
          { label: 'Completed', value: 8, color: theme.colors.status.success },
          { label: 'Pending', value: 3, color: theme.colors.status.warning },
          { label: 'Overdue', value: 1, color: theme.colors.status.error },
        ],
      };

      const mockAlerts: SafetyAlert[] = [
        {
          id: '1',
          childId: childProfiles[0]?.id || '',
          type: 'geofence_exit' as any,
          message: 'Emma left school at 3:15 PM',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          severity: 'medium',
        },
        {
          id: '2',
          childId: childProfiles[0]?.id || '',
          type: 'low_battery' as any,
          message: "Alex's device battery is below 20%",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          severity: 'low',
        },
      ];

      setDashboardStats(mockStats);
      setRecentAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const quickActions = [
    {
      id: 'homework_mode',
      title: 'Homework Mode',
      icon: 'book-outline',
      color: theme.colors.status.info,
      onPress: () => Alert.alert('Homework Mode', 'Feature coming soon!'),
    },
    {
      id: 'emergency_lock',
      title: 'Emergency Lock',
      icon: 'lock-closed-outline',
      color: theme.colors.status.error,
      onPress: () => Alert.alert('Emergency Lock', 'This will lock all child devices. Continue?'),
    },
    {
      id: 'location_check',
      title: 'Check Location',
      icon: 'location-outline',
      color: theme.colors.status.success,
      onPress: () => Alert.alert('Location Check', 'Feature coming soon!'),
    },
    {
      id: 'bedtime',
      title: 'Bedtime Mode',
      icon: 'moon-outline',
      color: theme.colors.primary,
      onPress: () => Alert.alert('Bedtime Mode', 'Feature coming soon!'),
    },
  ];

  const handleChildSelection = () => {
    if (childProfiles.length === 0) {
      Alert.alert('No Children', 'Add a child profile to get started.');
      return;
    }

    // In a real app, this would show a picker modal
    Alert.alert('Child Selection', 'Feature coming soon!');
  };

  const formatScreenTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (!dashboardStats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        
        <TouchableOpacity onPress={handleChildSelection} style={styles.childSelector}>
          <Text style={styles.childSelectorText}>
            {activeChildProfile ? activeChildProfile.name : 'All Children'}
          </Text>
          <Icon name="chevron-down-outline" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
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
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatsCard
            title="Today's Screen Time"
            value={formatScreenTime(dashboardStats.totalScreenTime)}
            icon="phone-portrait-outline"
            color={theme.colors.chart.screenTime}
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="Active Alerts"
            value={dashboardStats.activeAlerts}
            icon="notifications-outline"
            color={theme.colors.status.warning}
            onPress={() => Alert.alert('Alerts', 'Navigate to alerts screen')}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatsCard
            title="Children"
            value={dashboardStats.totalChildren}
            icon="people-outline"
            color={theme.colors.secondary}
          />
          <StatsCard
            title="Tasks Completed"
            value={`${dashboardStats.completedTasks}/12`}
            subtitle="This week"
            icon="checkmark-circle-outline"
            color={theme.colors.status.success}
            trend={{ value: 25, isPositive: true }}
          />
        </View>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />

        {/* Activity Chart */}
        <ActivityChart
          title="Weekly Screen Time"
          data={dashboardStats.weeklyScreenTime}
          color={theme.colors.chart.screenTime}
        />

        {/* Recent Alerts */}
        <AlertsList
          alerts={recentAlerts}
          onAlertPress={(alert) => Alert.alert('Alert Details', alert.message)}
          onViewAll={() => Alert.alert('All Alerts', 'Navigate to alerts screen')}
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
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  
  loadingText: {
    fontSize: theme.typography.fontSizes.lg,
    color: theme.colors.text.secondary,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },
  
  greeting: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
  },
  
  userName: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },
  
  childSelectorText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing[1],
  },
  
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
