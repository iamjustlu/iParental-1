import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';

interface SafetySetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  color: string;
  requiresWarning?: boolean;
}

interface SafetySettingsProps {
  safeSearchEnabled: boolean;
  youtubeRestrictedEnabled: boolean;
  onSafeSearchToggle: (enabled: boolean) => void;
  onYoutubeRestrictedToggle: (enabled: boolean) => void;
}

export const SafetySettings: React.FC<SafetySettingsProps> = ({
  safeSearchEnabled,
  youtubeRestrictedEnabled,
  onSafeSearchToggle,
  onYoutubeRestrictedToggle,
}) => {
  const settings: SafetySetting[] = [
    {
      id: 'safe_search',
      title: 'Safe Search',
      description: 'Filter explicit content from search results on Google, Bing, and other search engines',
      icon: 'search-outline',
      isEnabled: safeSearchEnabled,
      color: theme.colors.status.success,
    },
    {
      id: 'youtube_restricted',
      title: 'YouTube Restricted Mode',
      description: 'Hide potentially mature content on YouTube that may not be appropriate for younger audiences',
      icon: 'play-circle-outline',
      isEnabled: youtubeRestrictedEnabled,
      color: theme.colors.status.error,
    },
    {
      id: 'dns_filtering',
      title: 'DNS-Level Filtering',
      description: 'Block malicious and inappropriate websites at the network level for enhanced protection',
      icon: 'shield-outline',
      isEnabled: true,
      color: theme.colors.primary,
    },
    {
      id: 'image_filtering',
      title: 'Image Content Filtering',
      description: 'Scan and filter inappropriate images across websites and social media platforms',
      icon: 'image-outline',
      isEnabled: true,
      color: theme.colors.secondary,
    },
  ];

  const handleToggle = (setting: SafetySetting) => {
    if (setting.requiresWarning) {
      Alert.alert(
        'Disable Protection',
        `Are you sure you want to disable ${setting.title}? This may expose your child to inappropriate content.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => performToggle(setting),
          },
        ]
      );
    } else {
      performToggle(setting);
    }
  };

  const performToggle = (setting: SafetySetting) => {
    switch (setting.id) {
      case 'safe_search':
        onSafeSearchToggle(!setting.isEnabled);
        break;
      case 'youtube_restricted':
        onYoutubeRestrictedToggle(!setting.isEnabled);
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available in a future update');
    }
  };

  const renderSetting = (setting: SafetySetting) => (
    <TouchableOpacity
      key={setting.id}
      style={styles.settingItem}
      onPress={() => handleToggle(setting)}
      activeOpacity={0.8}
    >
      <View style={styles.settingContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${setting.color}20` }]}>
          <Icon name={setting.icon} size={24} color={setting.color} />
        </View>

        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          <Text style={styles.settingDescription}>{setting.description}</Text>
        </View>

        <Switch
          value={setting.isEnabled}
          onValueChange={() => handleToggle(setting)}
          trackColor={{
            false: theme.colors.border.primary,
            true: setting.color,
          }}
          thumbColor={setting.isEnabled ? theme.colors.text.primary : theme.colors.text.tertiary}
        />
      </View>

      {setting.isEnabled && (
        <View style={styles.enabledIndicator}>
          <View style={[styles.enabledDot, { backgroundColor: setting.color }]} />
          <Text style={[styles.enabledText, { color: setting.color }]}>
            Active
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Safety Settings</Text>
      </View>

      <Text style={styles.subtitle}>
        Configure additional protection layers to keep your child safe online
      </Text>

      <View style={styles.settingsContainer}>
        {settings.map(renderSetting)}
      </View>

      <View style={styles.footer}>
        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={20} color={theme.colors.status.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Enhanced Protection</Text>
            <Text style={styles.infoText}>
              These settings work together with your filter level to provide comprehensive protection across all apps and browsers.
            </Text>
          </View>
        </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  settingsContainer: {
    gap: theme.spacing[4],
  },

  settingItem: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    position: 'relative',
  },

  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  settingInfo: {
    flex: 1,
    marginRight: theme.spacing[3],
  },

  settingTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  settingDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
  },

  enabledIndicator: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },

  enabledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing[1],
  },

  enabledText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
  },

  footer: {
    marginTop: theme.spacing[6],
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.transparent.primary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'flex-start',
  },

  infoContent: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },

  infoTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.status.info,
    marginBottom: theme.spacing[1],
  },

  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.info,
    lineHeight: theme.typography.lineHeights.normal,
  },
});
