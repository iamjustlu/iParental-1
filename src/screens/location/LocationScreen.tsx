import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: Date;
  accuracy: number;
}

interface GeofenceZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  type: 'home' | 'school' | 'safe_zone';
  isActive: boolean;
}

export const LocationScreen: React.FC = () => {
  const [childLocations, setChildLocations] = useState<Record<string, LocationData>>({});
  const [geofences, setGeofences] = useState<GeofenceZone[]>([]);
  
  const { childProfiles } = useAuthStore();

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    // Mock data
    const mockLocations: Record<string, LocationData> = {};
    childProfiles.forEach(child => {
      mockLocations[child.id] = {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        address: '123 Main St, San Francisco, CA',
        timestamp: new Date(),
        accuracy: 10,
      };
    });
    setChildLocations(mockLocations);

    const mockGeofences: GeofenceZone[] = [
      {
        id: '1',
        name: 'Home',
        latitude: 37.7749,
        longitude: -122.4194,
        radius: 100,
        type: 'home',
        isActive: true,
      },
      {
        id: '2',
        name: 'School',
        latitude: 37.7849,
        longitude: -122.4094,
        radius: 200,
        type: 'school',
        isActive: true,
      },
    ];
    setGeofences(mockGeofences);
  };

  const renderChildLocation = (child: any) => {
    const location = childLocations[child.id];
    if (!location) return null;

    return (
      <View key={child.id} style={styles.locationCard}>
        <View style={styles.childHeader}>
          <View style={styles.childAvatar}>
            <Text style={styles.childInitial}>{child.name[0]}</Text>
          </View>
          <View style={styles.childInfo}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.lastUpdate}>
              Updated {location.timestamp.toLocaleTimeString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.locateButton}>
            <Icon name="navigate-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationInfo}>
          <Icon name="location-outline" size={16} color={theme.colors.secondary} />
          <Text style={styles.address}>{location.address}</Text>
        </View>
        
        <View style={styles.batteryInfo}>
          <Icon name="battery-half-outline" size={16} color={theme.colors.status.success} />
          <Text style={styles.batteryText}>Battery: 75%</Text>
        </View>
      </View>
    );
  };

  const renderGeofence = (zone: GeofenceZone) => (
    <View key={zone.id} style={styles.geofenceCard}>
      <View style={styles.geofenceHeader}>
        <Icon 
          name={zone.type === 'home' ? 'home-outline' : 'school-outline'} 
          size={20} 
          color={theme.colors.primary} 
        />
        <Text style={styles.geofenceName}>{zone.name}</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.geofenceRadius}>Radius: {zone.radius}m</Text>
      <Text style={styles.geofenceStatus}>
        {zone.isActive ? 'Active' : 'Inactive'}
      </Text>
    </View>
  );

  if (childProfiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="person-add-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No Children Added</Text>
        <Text style={styles.emptySubtitle}>
          Add a child profile to start tracking their location
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Add Geofence', 'Feature coming soon!')}
        >
          <Icon name="add-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Child Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children Locations</Text>
          {childProfiles.map(renderChildLocation)}
        </View>

        {/* Geofences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geofences</Text>
          {geofences.map(renderGeofence)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Check In', 'Request check-in from all children?')}
          >
            <Icon name="checkmark-circle-outline" size={24} color={theme.colors.status.success} />
            <Text style={styles.actionText}>Request Check-in</Text>
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

  addButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  section: {
    marginBottom: theme.spacing[6],
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },

  locationCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    ...theme.shadows.md,
  },

  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  childInitial: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  childInfo: {
    flex: 1,
  },

  childName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },

  lastUpdate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  locateButton: {
    padding: theme.spacing[2],
  },

  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  address: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[2],
    flex: 1,
  },

  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  batteryText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing[2],
  },

  geofenceCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },

  geofenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  geofenceName: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
    flex: 1,
  },

  geofenceRadius: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },

  geofenceStatus: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.success,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
  },

  actionText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[3],
  },
});
