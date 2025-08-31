import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '@/components/ui/Button';
import { theme } from '@/theme';

interface Site {
  url: string;
  addedAt: Date;
  category?: string;
}

interface SiteManagerProps {
  type: 'blocked' | 'allowed';
  sites: Site[];
  onAddSite: (url: string) => void;
  onRemoveSite: (url: string) => void;
}

export const SiteManager: React.FC<SiteManagerProps> = ({
  type,
  sites,
  onAddSite,
  onRemoveSite,
}) => {
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const isBlocked = type === 'blocked';
  const color = isBlocked ? theme.colors.status.error : theme.colors.status.success;
  const icon = isBlocked ? 'ban-outline' : 'checkmark-circle-outline';

  const validateUrl = (url: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const formatUrl = (url: string): string => {
    // Remove protocol if present
    let formatted = url.replace(/^https?:\/\//, '');
    // Remove www. if present
    formatted = formatted.replace(/^www\./, '');
    // Remove trailing slash
    formatted = formatted.replace(/\/$/, '');
    return formatted;
  };

  const handleAddSite = () => {
    const trimmedUrl = newSiteUrl.trim();
    if (!trimmedUrl) {
      Alert.alert('Error', 'Please enter a website URL');
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      Alert.alert('Error', 'Please enter a valid website URL');
      return;
    }

    const formattedUrl = formatUrl(trimmedUrl);
    
    // Check if site already exists
    if (sites.some(site => site.url === formattedUrl)) {
      Alert.alert('Error', `This website is already in your ${type} list`);
      return;
    }

    onAddSite(formattedUrl);
    setNewSiteUrl('');
    setIsAddingCustom(false);
  };

  const handleRemoveSite = (url: string) => {
    Alert.alert(
      `Remove from ${type} list`,
      `Remove ${url} from your ${type} websites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveSite(url),
        },
      ]
    );
  };

  const renderSiteItem = ({ item }: { item: Site }) => (
    <View style={styles.siteItem}>
      <View style={styles.siteInfo}>
        <View style={[styles.siteIcon, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={16} color={color} />
        </View>
        
        <View style={styles.siteDetails}>
          <Text style={styles.siteUrl}>{item.url}</Text>
          <Text style={styles.siteDate}>
            Added {item.addedAt.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveSite(item.url)}
      >
        <Icon name="close-outline" size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>
    </View>
  );

  const renderQuickAddButton = (site: string, label: string) => (
    <TouchableOpacity
      key={site}
      style={styles.quickAddButton}
      onPress={() => onAddSite(site)}
    >
      <Text style={styles.quickAddText}>{label}</Text>
    </TouchableOpacity>
  );

  const getQuickAddSites = () => {
    if (isBlocked) {
      return [
        { site: 'facebook.com', label: 'Facebook' },
        { site: 'instagram.com', label: 'Instagram' },
        { site: 'tiktok.com', label: 'TikTok' },
        { site: 'youtube.com', label: 'YouTube' },
        { site: 'reddit.com', label: 'Reddit' },
        { site: 'twitter.com', label: 'Twitter' },
      ];
    } else {
      return [
        { site: 'khanacademy.org', label: 'Khan Academy' },
        { site: 'wikipedia.org', label: 'Wikipedia' },
        { site: 'nationalgeographic.com', label: 'Nat Geo' },
        { site: 'nasa.gov', label: 'NASA' },
        { site: 'bbc.co.uk/education', label: 'BBC Education' },
        { site: 'smithsonian.com', label: 'Smithsonian' },
      ];
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name={icon} size={20} color={color} />
          <Text style={styles.title}>
            {isBlocked ? 'Blocked' : 'Allowed'} Websites
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingCustom(!isAddingCustom)}
        >
          <Icon
            name={isAddingCustom ? 'close-outline' : 'add-outline'}
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {isBlocked 
          ? 'These websites will be blocked for this child'
          : 'Only these websites will be accessible (whitelist mode)'
        }
      </Text>

      {/* Add Custom Site */}
      {isAddingCustom && (
        <View style={styles.addSiteContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.urlInput}
              placeholder="Enter website URL (e.g., example.com)"
              placeholderTextColor={theme.colors.text.tertiary}
              value={newSiteUrl}
              onChangeText={setNewSiteUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
          
          <Button
            title="Add"
            onPress={handleAddSite}
            size="sm"
            style={styles.addSiteButton}
          />
        </View>
      )}

      {/* Quick Add */}
      <View style={styles.quickAddSection}>
        <Text style={styles.quickAddTitle}>Quick Add:</Text>
        <View style={styles.quickAddGrid}>
          {getQuickAddSites().map(({ site, label }) => 
            renderQuickAddButton(site, label)
          )}
        </View>
      </View>

      {/* Sites List */}
      <View style={styles.sitesSection}>
        <Text style={styles.sectionTitle}>
          {sites.length} {isBlocked ? 'Blocked' : 'Allowed'} Sites
        </Text>
        
        {sites.length === 0 ? (
          <View style={styles.emptySites}>
            <Icon name="globe-outline" size={48} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyText}>
              No {isBlocked ? 'blocked' : 'allowed'} websites yet
            </Text>
            <Text style={styles.emptySubtext}>
              Add websites to {isBlocked ? 'block' : 'allow'} them for this child
            </Text>
          </View>
        ) : (
          <FlatList
            data={sites}
            renderItem={renderSiteItem}
            keyExtractor={(item) => item.url}
            showsVerticalScrollIndicator={false}
            style={styles.sitesList}
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },

  addButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent.primary,
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },

  addSiteContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
  },

  inputContainer: {
    flex: 1,
  },

  urlInput: {
    height: 40,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[3],
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
  },

  addSiteButton: {
    minWidth: 80,
  },

  quickAddSection: {
    marginBottom: theme.spacing[6],
  },

  quickAddTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },

  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },

  quickAddButton: {
    backgroundColor: theme.colors.background.tertiary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },

  quickAddText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeights.medium,
  },

  sitesSection: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },

  sitesList: {
    maxHeight: 300,
  },

  siteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },

  siteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  siteIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  siteDetails: {
    flex: 1,
  },

  siteUrl: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  siteDate: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
  },

  removeButton: {
    padding: theme.spacing[1],
  },

  emptySites: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },

  emptyText: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[3],
  },

  emptySubtext: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[1],
  },
});
