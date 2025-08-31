import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { FilterLevelSelector } from '@/components/contentfilter/FilterLevelSelector';
import { SiteManager } from '@/components/contentfilter/SiteManager';
import { SafetySettings } from '@/components/contentfilter/SafetySettings';
import { useAuthStore } from '@/store/authStore';
import { contentFilteringService } from '@/services/contentFilteringService';
import { theme } from '@/theme';
import { ContentFilterLevel, AgeGroup } from '@/types';

interface Site {
  url: string;
  addedAt: Date;
  category?: string;
}

export const ContentFilterScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ContentFilterLevel>(ContentFilterLevel.MODERATE);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(AgeGroup.CHILD);
  const [blockedSites, setBlockedSites] = useState<Site[]>([]);
  const [allowedSites, setAllowedSites] = useState<Site[]>([]);
  const [safeSearchEnabled, setSafeSearchEnabled] = useState(true);
  const [youtubeRestrictedEnabled, setYoutubeRestrictedEnabled] = useState(true);

  const { childProfiles, activeChildProfile } = useAuthStore();

  useEffect(() => {
    loadFilterSettings();
  }, [activeChildProfile]);

  const loadFilterSettings = async () => {
    try {
      if (!activeChildProfile && childProfiles.length === 0) {
        return;
      }

      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      // Mock data - in real app, this would be API calls
      setSelectedLevel(ContentFilterLevel.MODERATE);
      setSelectedAgeGroup(AgeGroup.CHILD);
      setBlockedSites([
        { url: 'facebook.com', addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { url: 'instagram.com', addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { url: 'tiktok.com', addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      ]);
      setAllowedSites([
        { url: 'khanacademy.org', addedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { url: 'wikipedia.org', addedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      ]);
      setSafeSearchEnabled(true);
      setYoutubeRestrictedEnabled(true);
    } catch (error) {
      console.error('Error loading filter settings:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFilterSettings();
    setIsRefreshing(false);
  };

  const handleLevelChange = async (level: ContentFilterLevel, ageGroup: AgeGroup) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.updateFilterLevel(childId, level, ageGroup);
      if (result.success) {
        setSelectedLevel(level);
        setSelectedAgeGroup(ageGroup);
        Alert.alert('Success', 'Filter level updated successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to update filter level');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddBlockedSite = async (url: string) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.addBlockedSite(childId, url);
      if (result.success) {
        setBlockedSites(prev => [...prev, { url, addedAt: new Date() }]);
        Alert.alert('Success', `${url} has been blocked`);
      } else {
        Alert.alert('Error', result.error || 'Failed to block site');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleRemoveBlockedSite = async (url: string) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.removeBlockedSite(childId, url);
      if (result.success) {
        setBlockedSites(prev => prev.filter(site => site.url !== url));
        Alert.alert('Success', `${url} has been unblocked`);
      } else {
        Alert.alert('Error', result.error || 'Failed to unblock site');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddAllowedSite = async (url: string) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.addAllowedSite(childId, url);
      if (result.success) {
        setAllowedSites(prev => [...prev, { url, addedAt: new Date() }]);
        Alert.alert('Success', `${url} has been added to allowed sites`);
      } else {
        Alert.alert('Error', result.error || 'Failed to allow site');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleRemoveAllowedSite = async (url: string) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.removeAllowedSite(childId, url);
      if (result.success) {
        setAllowedSites(prev => prev.filter(site => site.url !== url));
        Alert.alert('Success', `${url} has been removed from allowed sites`);
      } else {
        Alert.alert('Error', result.error || 'Failed to remove allowed site');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleSafeSearchToggle = async (enabled: boolean) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.enableSafeSearch(childId, enabled);
      if (result.success) {
        setSafeSearchEnabled(enabled);
        Alert.alert('Success', `Safe search ${enabled ? 'enabled' : 'disabled'}`);
      } else {
        Alert.alert('Error', result.error || 'Failed to update safe search');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleYoutubeRestrictedToggle = async (enabled: boolean) => {
    try {
      const childId = activeChildProfile?.id || childProfiles[0]?.id;
      if (!childId) return;

      const result = await contentFilteringService.enableYouTubeRestricted(childId, enabled);
      if (result.success) {
        setYoutubeRestrictedEnabled(enabled);
        Alert.alert('Success', `YouTube restricted mode ${enabled ? 'enabled' : 'disabled'}`);
      } else {
        Alert.alert('Error', result.error || 'Failed to update YouTube settings');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  if (childProfiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Children Added</Text>
        <Text style={styles.emptySubtitle}>
          Add a child profile to configure content filtering
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Filter</Text>
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
        {/* Filter Level Selector */}
        <FilterLevelSelector
          selectedLevel={selectedLevel}
          selectedAgeGroup={selectedAgeGroup}
          onLevelChange={handleLevelChange}
        />

        {/* Safety Settings */}
        <SafetySettings
          safeSearchEnabled={safeSearchEnabled}
          youtubeRestrictedEnabled={youtubeRestrictedEnabled}
          onSafeSearchToggle={handleSafeSearchToggle}
          onYoutubeRestrictedToggle={handleYoutubeRestrictedToggle}
        />

        {/* Blocked Sites */}
        <SiteManager
          type="blocked"
          sites={blockedSites}
          onAddSite={handleAddBlockedSite}
          onRemoveSite={handleRemoveBlockedSite}
        />

        {/* Allowed Sites */}
        <SiteManager
          type="allowed"
          sites={allowedSites}
          onAddSite={handleAddAllowedSite}
          onRemoveSite={handleRemoveAllowedSite}
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
    marginBottom: theme.spacing[2],
  },

  emptySubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },

  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
});
