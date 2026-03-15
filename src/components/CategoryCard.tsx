/**
 * CategoryCard Component
 * Reusable card for displaying learning categories
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {COLORS} from '../constants/colors';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../constants/dimensions';

interface CategoryCardProps {
  icon: ImageSourcePropType | string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  label,
  onPress,
  disabled = false,
}) => {
  console.log('====================================');
  console.log(label);
  console.log('====================================');

  // Determine if icon is a local require() or a URL string
  const isLocalIcon = typeof icon !== 'string';
  const iconSource = isLocalIcon 
    ? icon 
    : { uri: 'https://italygoadmin.com' + icon };

  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}>
      <Image source={iconSource} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 2,
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  label: {
    marginTop: SPACING.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CategoryCard;
