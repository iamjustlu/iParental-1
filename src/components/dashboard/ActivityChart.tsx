import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '@/theme';
import { TimeSeriesData } from '@/types';

interface ActivityChartProps {
  title: string;
  data: TimeSeriesData[];
  color?: string;
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

export const ActivityChart: React.FC<ActivityChartProps> = ({
  title,
  data,
  color = theme.colors.primary,
  height = 200,
}) => {
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        data: data.map(item => item.value),
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.background.card,
    backgroundGradientFrom: theme.colors.background.card,
    backgroundGradientTo: theme.colors.background.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: color,
      fill: color,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border.secondary,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: theme.typography.fontSizes.xs,
    },
  };

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.emptyState, { height }]}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - theme.spacing[8]}
          height={height}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
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
  
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
  },
  
  emptyText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeights.medium,
  },
});
