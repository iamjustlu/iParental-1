import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  
  // Common component styles
  components: {
    button: {
      height: 48,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[6],
    },
    
    input: {
      height: 48,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[4],
      borderWidth: 1,
    },
    
    card: {
      borderRadius: borderRadius.lg,
      padding: spacing[6],
      backgroundColor: colors.background.card,
    },
    
    header: {
      height: 56,
      paddingHorizontal: spacing[4],
    },
    
    tabBar: {
      height: 80,
      paddingBottom: spacing[6],
      paddingTop: spacing[2],
    },
  },
  
  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export * from './colors';
export * from './typography';
export * from './spacing';
