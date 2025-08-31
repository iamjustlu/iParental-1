import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

const screenWidth = Dimensions.get('window').width;

interface ReportData {
  screenTime: {
    daily: number[];
    weekly: number[];
    apps: Array<{ name: string; time: number; color: string }>;
  };
  tasks: {
    completed: number;
    pending: number;
    overdue: number;
  };
  location: {
    alerts: number;
    geofenceEvents: number;
  };
  safety: {
    blockedRequests: number;
    allowedRequests: number;
  };
}

export const ReportingScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  const { childProfiles, activeChildProfile } = useAuthStore();

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod, activeChildProfile]);

  const loadReportData = async () => {
    // Mock data
    const mockData: ReportData = {
      screenTime: {
        daily: [3.2, 4.1, 2.8, 5.2, 3.7, 4.5, 3.9],
        weekly: [25, 28, 22, 31, 26, 29, 24],
        apps: [
          { name: 'YouTube', time: 120, color: '#FF6B6B' },
          { name: 'Games', time: 95, color: '#4ECDC4' },
          { name: 'Social', time: 85, color: '#45B7D1' },
          { name: 'Education', time: 60, color: '#96CEB4' },
          { name: 'Other', time: 40, color: '#FECA57' },
        ],
      },
      tasks: {
        completed: 18,
        pending: 5,
        overdue: 2,
      },
      location: {
        alerts: 3,
        geofenceEvents: 12,
      },
      safety: {
        blockedRequests: 45,
        allowedRequests: 234,
      },
    };
    setReportData(mockData);
  };

  const handleExportReport = () => {
    Alert.alert(
      'Export Report',
      'Choose export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF', onPress: () => Alert.alert('Success', 'PDF report generated!') },
        { text: 'CSV', onPress: () => Alert.alert('Success', 'CSV report generated!') },
        { text: 'Email', onPress: () => Alert.alert('Success', 'Report sent via email!') },
      ]
    );
  };

  const chartConfig = {
    backgroundColor: theme.colors.background.card,
    backgroundGradientFrom: theme.colors.background.card,
    backgroundGradientTo: theme.colors.background.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`,
    style: { borderRadius: theme.borderRadius.lg },
    propsForLabels: { fontSize: theme.typography.fontSizes.xs },
  };

  if (!reportData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (childProfiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="bar-chart-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptySubtitle}>
          Add a child profile to start generating reports
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExportReport}>
          <Icon name="download-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.activePeriodButtonText,
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Icon name="time-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.summaryNumber}>
              {reportData.screenTime.weekly.reduce((a, b) => a + b, 0)}h
            </Text>
            <Text style={styles.summaryLabel}>Total Screen Time</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Icon name="checkmark-circle-outline" size={24} color={theme.colors.status.success} />
            <Text style={styles.summaryNumber}>{reportData.tasks.completed}</Text>
            <Text style={styles.summaryLabel}>Tasks Completed</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Icon name="shield-outline" size={24} color={theme.colors.status.error} />
            <Text style={styles.summaryNumber}>{reportData.safety.blockedRequests}</Text>
            <Text style={styles.summaryLabel}>Blocked Requests</Text>
          </View>
        </View>

        {/* Screen Time Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Daily Screen Time</Text>
          <BarChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: reportData.screenTime.daily }],
            }}
            width={screenWidth - theme.spacing[8]}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisSuffix="h"
            showValuesOnTopOfBars
          />
        </View>

        {/* App Usage Breakdown */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>App Usage Breakdown</Text>
          <PieChart
            data={reportData.screenTime.apps.map(app => ({
              name: app.name,
              usage: app.time,
              color: app.color,
              legendFontColor: theme.colors.text.secondary,
              legendFontSize: theme.typography.fontSizes.sm,
            }))}
            width={screenWidth - theme.spacing[8]}
            height={220}
            chartConfig={chartConfig}
            accessor="usage"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>

        {/* Task Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.chartTitle}>Task Progress</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.status.success }]}>
                <View style={[
                  styles.progressFill,
                  {
                    width: `${(reportData.tasks.completed / (reportData.tasks.completed + reportData.tasks.pending + reportData.tasks.overdue)) * 100}%`,
                    backgroundColor: theme.colors.status.success,
                  },
                ]} />
              </View>
              <Text style={styles.progressLabel}>Completed: {reportData.tasks.completed}</Text>
            </View>
            
            <View style={styles.progressItem}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.status.warning }]}>
                <View style={[
                  styles.progressFill,
                  {
                    width: `${(reportData.tasks.pending / (reportData.tasks.completed + reportData.tasks.pending + reportData.tasks.overdue)) * 100}%`,
                    backgroundColor: theme.colors.status.warning,
                  },
                ]} />
              </View>
              <Text style={styles.progressLabel}>Pending: {reportData.tasks.pending}</Text>
            </View>
            
            <View style={styles.progressItem}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.status.error }]}>
                <View style={[
                  styles.progressFill,
                  {
                    width: `${(reportData.tasks.overdue / (reportData.tasks.completed + reportData.tasks.pending + reportData.tasks.overdue)) * 100}%`,
                    backgroundColor: theme.colors.status.error,
                  },
                ]} />
              </View>
              <Text style={styles.progressLabel}>Overdue: {reportData.tasks.overdue}</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.chartTitle}>Weekly Insights</Text>
          
          <View style={styles.insightItem}>
            <Icon name="trending-up-outline" size={20} color={theme.colors.status.warning} />
            <Text style={styles.insightText}>
              Screen time increased by 12% compared to last week
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Icon name="checkmark-circle-outline" size={20} color={theme.colors.status.success} />
            <Text style={styles.insightText}>
              Task completion rate improved to 85%
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Icon name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.insightText}>
              Content filter blocked 45 inappropriate requests
            </Text>
          </View>
          
          <View style={styles.insightItem}>
            <Icon name="location-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.insightText}>
              All location check-ins were on time this week
            </Text>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportContainer}>
          <Text style={styles.chartTitle}>Export Options</Text>
          <TouchableOpacity style={styles.exportOption} onPress={handleExportReport}>
            <Icon name="mail-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.exportOptionText}>Email Weekly Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportOption} onPress={handleExportReport}>
            <Icon name="document-text-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.exportOptionText}>Generate PDF Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportOption} onPress={handleExportReport}>
            <Icon name="stats-chart-outline" size={20} color={theme.colors.status.success} />
            <Text style={styles.exportOptionText}>Export Data (CSV)</Text>
          </TouchableOpacity>
        </View>
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[6],
  },

  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },

  emptySubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
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

  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },

  exportButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing[1],
    fontWeight: theme.typography.fontWeights.medium,
  },

  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },

  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  activePeriodButton: {
    backgroundColor: theme.colors.primary,
  },

  periodButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  activePeriodButtonText: {
    color: theme.colors.text.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  summaryContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[6],
    gap: theme.spacing[3],
  },

  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },

  summaryNumber: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[2],
  },

  summaryLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },

  chartContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },

  chartTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },

  chart: {
    borderRadius: theme.borderRadius.md,
  },

  progressContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },

  progressGrid: {
    gap: theme.spacing[4],
  },

  progressItem: {
    marginBottom: theme.spacing[2],
  },

  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: theme.spacing[2],
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  progressLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  insightsContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadows.md,
  },

  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  insightText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[3],
    flex: 1,
  },

  exportContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    ...theme.shadows.md,
  },

  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },

  exportOptionText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[3],
    fontWeight: theme.typography.fontWeights.medium,
  },
});
