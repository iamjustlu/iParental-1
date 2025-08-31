import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { theme } from '@/theme';
import { AppUsage } from '@/types';

interface ScreenTimeChartProps {
  type: 'daily' | 'weekly' | 'app-breakdown';
  data: any[];
  title: string;
}

const screenWidth = Dimensions.get('window').width;

export const ScreenTimeChart: React.FC<ScreenTimeChartProps> = ({
  type,
  data,
  title,
}) => {
  const chartConfig = {
    backgroundColor: theme.colors.background.card,
    backgroundGradientFrom: theme.colors.background.card,
    backgroundGradientTo: theme.colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForLabels: {
      fontSize: theme.typography.fontSizes.xs,
    },
  };

  const renderDailyChart = () => {
    const chartData = {
      labels: data.map((item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [{
        data: data.map(item => item.screenTime / 60), // Convert minutes to hours
      }],
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - theme.spacing[8]}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix="h"
        showValuesOnTopOfBars
      />
    );
  };

  const renderWeeklyChart = () => {
    const chartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: data.map(item => item.screenTime / 60),
      }],
    };

    return (
      <BarChart
        data={chartData}
        width={screenWidth - theme.spacing[8]}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        yAxisSuffix="h"
        showValuesOnTopOfBars
      />
    );
  };

  const renderAppBreakdown = () => {
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.status.success,
      theme.colors.status.warning,
      theme.colors.status.error,
      theme.colors.chart.location,
    ];

    const pieData = data.slice(0, 6).map((app: AppUsage, index) => ({
      name: app.appName,
      usage: app.timeSpent,
      color: colors[index % colors.length],
      legendFontColor: theme.colors.text.secondary,
      legendFontSize: theme.typography.fontSizes.sm,
    }));

    return (
      <PieChart
        data={pieData}
        width={screenWidth - theme.spacing[8]}
        height={220}
        chartConfig={chartConfig}
        accessor="usage"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
      />
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'daily':
        return renderDailyChart();
      case 'weekly':
        return renderWeeklyChart();
      case 'app-breakdown':
        return renderAppBreakdown();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        {renderChart()}
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

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },

  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
  },

  chart: {
    marginVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },
});
