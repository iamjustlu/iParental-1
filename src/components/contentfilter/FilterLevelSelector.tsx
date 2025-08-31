import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';
import { ContentFilterLevel, AgeGroup } from '@/types';

interface FilterLevel {
  level: ContentFilterLevel;
  ageGroup: AgeGroup;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

interface FilterLevelSelectorProps {
  selectedLevel: ContentFilterLevel;
  selectedAgeGroup: AgeGroup;
  onLevelChange: (level: ContentFilterLevel, ageGroup: AgeGroup) => void;
}

export const FilterLevelSelector: React.FC<FilterLevelSelectorProps> = ({
  selectedLevel,
  selectedAgeGroup,
  onLevelChange,
}) => {
  const filterLevels: FilterLevel[] = [
    {
      level: ContentFilterLevel.STRICT,
      ageGroup: AgeGroup.PRESCHOOL,
      title: 'Preschool (3-5)',
      description: 'Maximum protection for young children',
      icon: 'shield',
      color: theme.colors.status.success,
      features: [
        'Blocks all social media',
        'Only educational content',
        'No user-generated content',
        'Restricted search results',
        'Time-based restrictions',
      ],
    },
    {
      level: ContentFilterLevel.MODERATE,
      ageGroup: AgeGroup.CHILD,
      title: 'Child (6-12)',
      description: 'Balanced protection for school-age children',
      icon: 'school',
      color: theme.colors.secondary,
      features: [
        'Blocks inappropriate content',
        'Allows educational sites',
        'Monitored social interaction',
        'Safe search enabled',
        'Scheduled access times',
      ],
    },
    {
      level: ContentFilterLevel.RELAXED,
      ageGroup: AgeGroup.TEEN,
      title: 'Teen (13-17)',
      description: 'Guided freedom for teenagers',
      icon: 'people',
      color: theme.colors.status.warning,
      features: [
        'Blocks explicit content',
        'Allows most social media',
        'Monitors risky websites',
        'Educational content priority',
        'Extended access hours',
      ],
    },
    {
      level: ContentFilterLevel.CUSTOM,
      ageGroup: AgeGroup.CUSTOM,
      title: 'Custom',
      description: 'Create your own filtering rules',
      icon: 'settings',
      color: theme.colors.primary,
      features: [
        'Full customization',
        'Custom block/allow lists',
        'Advanced rule creation',
        'Category-based filtering',
        'Flexible scheduling',
      ],
    },
  ];

  const isSelected = (level: FilterLevel): boolean => {
    return selectedLevel === level.level && selectedAgeGroup === level.ageGroup;
  };

  const renderFilterLevel = (level: FilterLevel) => (
    <TouchableOpacity
      key={`${level.level}-${level.ageGroup}`}
      style={[
        styles.levelCard,
        isSelected(level) && [styles.selectedCard, { borderColor: level.color }],
      ]}
      onPress={() => onLevelChange(level.level, level.ageGroup)}
      activeOpacity={0.8}
    >
      <View style={styles.levelHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${level.color}20` }]}>
          <Icon name={level.icon} size={24} color={level.color} />
        </View>
        
        <View style={styles.levelInfo}>
          <Text style={[
            styles.levelTitle,
            isSelected(level) && { color: level.color },
          ]}>
            {level.title}
          </Text>
          <Text style={styles.levelDescription}>
            {level.description}
          </Text>
        </View>

        {isSelected(level) && (
          <View style={styles.selectedIndicator}>
            <Icon name="checkmark-circle" size={24} color={level.color} />
          </View>
        )}
      </View>

      <View style={styles.featuresContainer}>
        {level.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon
              name="checkmark-outline"
              size={16}
              color={isSelected(level) ? level.color : theme.colors.status.success}
            />
            <Text style={[
              styles.featureText,
              isSelected(level) && { color: theme.colors.text.primary },
            ]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {isSelected(level) && (
        <View style={[styles.selectedBanner, { backgroundColor: level.color }]}>
          <Text style={styles.selectedBannerText}>Currently Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Filter Level</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Choose the appropriate protection level based on your child's age and maturity
      </Text>

      <View style={styles.levelsContainer}>
        {filterLevels.map(renderFilterLevel)}
      </View>

      <View style={styles.footer}>
        <View style={styles.noteContainer}>
          <Icon name="information-circle-outline" size={16} color={theme.colors.status.info} />
          <Text style={styles.noteText}>
            You can always adjust these settings later or create custom rules
          </Text>
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

  levelsContainer: {
    gap: theme.spacing[4],
  },

  levelCard: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedCard: {
    backgroundColor: theme.colors.background.secondary,
  },

  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  levelInfo: {
    flex: 1,
  },

  levelTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  levelDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  selectedIndicator: {
    marginLeft: theme.spacing[2],
  },

  featuresContainer: {
    gap: theme.spacing[2],
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[2],
    flex: 1,
  },

  selectedBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderTopRightRadius: theme.borderRadius.md,
    borderBottomLeftRadius: theme.borderRadius.md,
  },

  selectedBannerText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },

  footer: {
    marginTop: theme.spacing[6],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },

  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.primary,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
  },

  noteText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.info,
    marginLeft: theme.spacing[2],
    flex: 1,
  },
});
