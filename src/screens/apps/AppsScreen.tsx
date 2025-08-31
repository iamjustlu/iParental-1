import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppListItem } from '@/components/apps/AppListItem';
import { CategoryFilter } from '@/components/apps/CategoryFilter';
import { QuickModeSelector } from '@/components/apps/QuickModeSelector';
import { useAuthStore } from '@/store/authStore';
import { appManagementService } from '@/services/appManagementService';
import { theme } from '@/theme';
import { AppInfo, AppCategory } from '@/types';

export const AppsScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'category'>('usage');

  const { childProfiles, activeChildProfile } = useAuthStore();

  useEffect(() => {
    loadApps();
  }, [activeChildProfile]);

  useEffect(() => {
    filterAndSortApps();
  }, [apps, selectedCategory, searchQuery, sortBy]);

  const loadApps = async () => {
    try {
      if (!activeChildProfile && childProfiles.length === 0) {
        return;
      }

      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      // Mock data - in real app, this would be API calls
      const mockApps: AppInfo[] = [
        {
          packageName: 'com.google.android.youtube',
          appName: 'YouTube',
          category: AppCategory.ENTERTAINMENT,
          isSystemApp: false,
          isBlocked: false,
          timeSpent: 180,
          lastUsed: new Date(Date.now() - 30 * 60 * 1000),
          version: '18.0.0',
          installDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          packageName: 'com.instagram.android',
          appName: 'Instagram',
          category: AppCategory.SOCIAL,
          isSystemApp: false,
          isBlocked: true,
          timeSpent: 120,
          lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
          version: '280.0.0',
          installDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
        {
          packageName: 'com.roblox.client',
          appName: 'Roblox',
          category: AppCategory.GAMES,
          isSystemApp: false,
          isBlocked: false,
          timeSpent: 240,
          lastUsed: new Date(Date.now() - 10 * 60 * 1000),
          version: '2.8.0',
          installDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
        {
          packageName: 'org.khanacademy.android',
          appName: 'Khan Academy',
          category: AppCategory.EDUCATION,
          isSystemApp: false,
          isBlocked: false,
          timeSpent: 45,
          lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
          version: '7.3.2',
          installDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        },
        {
          packageName: 'com.whatsapp',
          appName: 'WhatsApp',
          category: AppCategory.COMMUNICATION,
          isSystemApp: false,
          isBlocked: false,
          timeSpent: 90,
          lastUsed: new Date(Date.now() - 5 * 60 * 1000),
          version: '2.23.20',
          installDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
        },
        {
          packageName: 'com.spotify.music',
          appName: 'Spotify',
          category: AppCategory.ENTERTAINMENT,
          isSystemApp: false,
          isBlocked: false,
          timeSpent: 60,
          lastUsed: new Date(Date.now() - 4 * 60 * 60 * 1000),
          version: '8.8.0',
          installDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        },
      ];

      setApps(mockApps);
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  };

  const filterAndSortApps = () => {
    let filtered = apps;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(app =>
        app.appName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort apps
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.appName.localeCompare(b.appName);
        case 'usage':
          return b.timeSpent - a.timeSpent;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadApps();
    setIsRefreshing(false);
  };

  const handleToggleBlock = async (packageName: string, isBlocked: boolean) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      if (isBlocked) {
        const result = await appManagementService.blockApp(childId, packageName);
        if (result.success) {
          Alert.alert('Success', 'App blocked successfully');
        } else {
          Alert.alert('Error', result.error || 'Failed to block app');
        }
      } else {
        const result = await appManagementService.unblockApp(childId, packageName);
        if (result.success) {
          Alert.alert('Success', 'App unblocked successfully');
        } else {
          Alert.alert('Error', result.error || 'Failed to unblock app');
        }
      }
      
      // Update local state
      setApps(prevApps =>
        prevApps.map(app =>
          app.packageName === packageName ? { ...app, isBlocked } : app
        )
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleSetTimeLimit = (packageName: string) => {
    const app = apps.find(a => a.packageName === packageName);
    Alert.alert(
      'Set Time Limit',
      `Set daily time limit for ${app?.appName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '30 min', onPress: () => setTimeLimit(packageName, 30) },
        { text: '1 hour', onPress: () => setTimeLimit(packageName, 60) },
        { text: '2 hours', onPress: () => setTimeLimit(packageName, 120) },
        { text: 'Custom', onPress: () => Alert.alert('Custom Time', 'Custom time limit coming soon!') },
      ]
    );
  };

  const setTimeLimit = async (packageName: string, minutes: number) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await appManagementService.setAppTimeLimit(childId, packageName, minutes);
      if (result.success) {
        Alert.alert('Success', `Time limit set to ${minutes} minutes`);
      } else {
        Alert.alert('Error', result.error || 'Failed to set time limit');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleViewDetails = (packageName: string) => {
    const app = apps.find(a => a.packageName === packageName);
    Alert.alert('App Details', `${app?.appName}\nVersion: ${app?.version}\nUsage: ${app?.timeSpent} minutes today`);
  };

  const handleModeSelect = async (modeId: string) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      switch (modeId) {
        case 'homework':
          const educationApps = apps
            .filter(app => app.category === AppCategory.EDUCATION)
            .map(app => app.packageName);
          
          const result = await appManagementService.enableHomeworkMode(childId, educationApps, 120);
          if (result.success) {
            Alert.alert('Homework Mode', 'Homework mode enabled for 2 hours');
          }
          break;
        case 'bedtime':
          Alert.alert('Bedtime Mode', 'Bedtime mode activated');
          break;
        case 'mealtime':
          Alert.alert('Meal Time', 'Meal time restrictions applied');
          break;
        case 'emergency':
          Alert.alert('Emergency Lock', 'All devices have been locked');
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to activate mode');
    }
  };

  const getAppCounts = () => {
    const counts: Record<string, number> = { all: apps.length };
    apps.forEach(app => {
      counts[app.category] = (counts[app.category] || 0) + 1;
    });
    return counts;
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'name':
        return 'text-outline';
      case 'usage':
        return 'time-outline';
      case 'category':
        return 'folder-outline';
      default:
        return 'swap-vertical-outline';
    }
  };

  if (childProfiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="person-add-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No Children Added</Text>
        <Text style={styles.emptySubtitle}>
          Add a child profile to start managing their apps
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Apps</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options = ['name', 'usage', 'category'] as const;
            const currentIndex = options.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % options.length;
            setSortBy(options[nextIndex]);
          }}
        >
          <Icon name={getSortIcon()} size={20} color={theme.colors.text.secondary} />
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
        {/* Quick Modes */}
        <QuickModeSelector onModeSelect={handleModeSelect} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search apps..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-outline" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          appCounts={getAppCounts()}
        />

        {/* Apps List */}
        <View style={styles.appsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredApps.length} App{filteredApps.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.sectionSubtitle}>
              Sorted by {sortBy}
            </Text>
          </View>

          {filteredApps.map(app => (
            <AppListItem
              key={app.packageName}
              app={app}
              onToggleBlock={handleToggleBlock}
              onSetTimeLimit={handleSetTimeLimit}
              onViewDetails={handleViewDetails}
            />
          ))}

          {filteredApps.length === 0 && (
            <View style={styles.noAppsContainer}>
              <Icon name="apps-outline" size={48} color={theme.colors.text.tertiary} />
              <Text style={styles.noAppsText}>No apps found</Text>
              <Text style={styles.noAppsSubtext}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
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

  sortButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.tertiary,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    marginBottom: theme.spacing[4],
    ...theme.shadows.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
    padding: 0,
  },

  appsSection: {
    marginBottom: theme.spacing[6],
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },

  sectionSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  noAppsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },

  noAppsText: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[3],
  },

  noAppsSubtext: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});
