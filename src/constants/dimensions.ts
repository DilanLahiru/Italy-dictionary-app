/**
 * Layout and dimension constants
 */

export const SPACING = {
  EXTRA_SMALL: 4,
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
  EXTRA_LARGE: 20,
  XXL: 24,
  XXXL: 32,
  // Aliases for backwards compatibility
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
  FULL: 24,
  CIRCLE: 99999,
  // Aliases for backwards compatibility
  sm: 8,
  md: 12,
  lg: 16,
  full: 24,
  circle: 99999,
};

export const FONT_SIZES = {
  EXTRA_SMALL: 12,
  SMALL: 14,
  MEDIUM: 16,
  LARGE: 18,
  EXTRA_LARGE: 20,
  XXL: 32,
  // Aliases for backwards compatibility
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 32,
};

export const FONT_WEIGHTS = {
  NORMAL: '400' as const,
  MEDIUM: '500' as const,
  SEMI_BOLD: '600' as const,
  BOLD: '700' as const,
  EXTRA_BOLD: '800' as const,
  // Aliases for backwards compatibility
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
