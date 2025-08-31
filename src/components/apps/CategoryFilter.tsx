import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '@/theme';
import { AppCategory } from '@/types';

interface CategoryFilterProps {
  selectedCategory: AppCategory | 'all';
  onCategoryChange: (category: AppCategory | 'all') => void;
  appCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  appCounts,
}) => {
  const categories = [
    { key: 'all', label: 'All Apps', icon: 'apps-outline' },
    { key: AppCategory.SOCIAL, label: 'Social', icon: 'people-outline' },
    { key: AppCategory.GAMES, label: 'Games', icon: 'game-controller-outline' },
    { key: AppCategory.EDUCATION, label: 'Education', icon: 'book-outline' },
    { key: AppCategory.ENTERTAINMENT, label: 'Entertainment', icon: 'play-outline' },
    { key: AppCategory.PRODUCTIVITY, label: 'Productivity', icon: 'briefcase-outline' },
    { key: AppCategory.COMMUNICATION, label: 'Communication', icon: 'chatbubbles-outline' },
    { key: AppCategory.UTILITIES, label: 'Utilities', icon: 'construct-outline' },
  ];

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case AppCategory.SOCIAL:
        return theme.colors.secondary;
      case AppCategory.GAMES:
        return theme.colors.status.error;
      case AppCategory.EDUCATION:
        return theme.colors.status.success;
      case AppCategory.ENTERTAINMENT:
        return theme.colors.status.warning;
      case AppCategory.PRODUCTIVITY:
        return theme.colors.primary;
      case AppCategory.COMMUNICATION:
        return theme.colors.secondary;
      case AppCategory.UTILITIES:
        return theme.colors.text.tertiary;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const count = appCounts[category.key] || 0;
          const color = getCategoryColor(category.key);

          return (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                isSelected && [styles.selectedButton, { backgroundColor: `${color}20` }],
              ]}
              onPress={() => onCategoryChange(category.key as AppCategory | 'all')}
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                isSelected && { backgroundColor: color },
              ]}>
                <Icon
                  name={category.icon}
                  size={20}
                  color={isSelected ? theme.colors.text.primary : color}
                />
              </View>
              
              <Text style={[
                styles.categoryLabel,
                isSelected && [styles.selectedLabel, { color }],
              ]}>
                {category.label}
              </Text>
              
              {count > 0 && (
                <View style={[
                  styles.countBadge,
                  isSelected && { backgroundColor: color },
                ]}>
                  <Text style={[
                    styles.countText,
                    isSelected && styles.selectedCountText,
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
    marginBottom: theme.spacing[4],
    ...theme.shadows.sm,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing[2],
    gap: theme.spacing[2],
  },

  categoryButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    backgroundColor: theme.colors.background.tertiary,
  },

  selectedButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
    backgroundColor: theme.colors.background.secondary,
  },

  categoryLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },

  selectedLabel: {
    fontWeight: theme.typography.fontWeights.semibold,
  },

  countBadge: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },

  countText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.tertiary,
  },

  selectedCountText: {
    color: theme.colors.text.primary,
  },
});
