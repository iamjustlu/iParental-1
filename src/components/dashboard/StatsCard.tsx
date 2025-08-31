import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  onPress?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  onPress,
  trend,
}) => {
  const cardContent = (
    <>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Icon
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={16}
              color={trend.isPositive ? theme.colors.status.success : theme.colors.status.error}
            />
            <Text
              style={[
                styles.trendText,
                {
                  color: trend.isPositive ? theme.colors.status.success : theme.colors.status.error,
                },
              ]}
            >
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.8}>
        <LinearGradient
          colors={theme.colors.gradients.card}
          style={styles.gradient}
        >
          {cardContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradients.card}
        style={styles.gradient}
      >
        {cardContent}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
  },
  
  gradient: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    ...theme.shadows.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  
  trendText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    marginLeft: theme.spacing[1],
  },
  
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  value: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  
  title: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  
  subtitle: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },
});
