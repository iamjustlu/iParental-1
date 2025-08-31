import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';
import { SafetyAlert, AlertType } from '@/types';

interface AlertsListProps {
  alerts: SafetyAlert[];
  onAlertPress: (alert: SafetyAlert) => void;
  onViewAll: () => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  onAlertPress,
  onViewAll,
}) => {
  const getAlertIcon = (type: AlertType): string => {
    switch (type) {
      case AlertType.GEOFENCE_ENTRY:
      case AlertType.GEOFENCE_EXIT:
        return 'location-outline';
      case AlertType.LOW_BATTERY:
        return 'battery-dead-outline';
      case AlertType.DEVICE_OFFLINE:
        return 'wifi-outline';
      case AlertType.PANIC_BUTTON:
        return 'warning-outline';
      case AlertType.SPEED_ALERT:
        return 'speedometer-outline';
      case AlertType.LATE_ARRIVAL:
        return 'time-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getAlertColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return theme.colors.status.error;
      case 'high':
        return theme.colors.status.warning;
      case 'medium':
        return theme.colors.secondary;
      case 'low':
        return theme.colors.status.info;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderAlert = ({ item }: { item: SafetyAlert }) => (
    <TouchableOpacity
      style={[
        styles.alertItem,
        !item.isRead && styles.unreadAlert,
      ]}
      onPress={() => onAlertPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.alertIconContainer}>
        <View
          style={[
            styles.alertIcon,
            { backgroundColor: `${getAlertColor(item.severity)}20` },
          ]}
        >
          <Icon
            name={getAlertIcon(item.type)}
            size={20}
            color={getAlertColor(item.severity)}
          />
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.alertContent}>
        <Text style={styles.alertMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.alertTime}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
      
      <Icon
        name="chevron-forward-outline"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );

  if (alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Recent Alerts</Text>
        </View>
        <View style={styles.emptyState}>
          <Icon
            name="checkmark-circle-outline"
            size={48}
            color={theme.colors.status.success}
          />
          <Text style={styles.emptyText}>All good!</Text>
          <Text style={styles.emptySubtext}>No alerts at the moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Alerts</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={alerts.slice(0, 5)} // Show only first 5 alerts
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
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
    marginBottom: theme.spacing[4],
  },
  
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
  
  viewAllText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.primary,
  },
  
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  
  unreadAlert: {
    backgroundColor: theme.colors.transparent.primary,
  },
  
  alertIconContainer: {
    position: 'relative',
    marginRight: theme.spacing[3],
  },
  
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  
  alertContent: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  
  alertMessage: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  
  alertTime: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
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
    marginTop: theme.spacing[1],
  },
});
