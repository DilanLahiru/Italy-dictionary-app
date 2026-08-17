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
import {
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../constants/dimensions';

interface CategoryCardProps {
  icon: ImageSourcePropType | string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  cardColor?: string;
  iconBackgroundColor?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  label,
  onPress,
  disabled = false,
  cardColor = '#FFFFFF',
  iconBackgroundColor = '#F3F7FB',
}) => {
  const isLocalIcon = typeof icon !== 'string';
  const iconSource = isLocalIcon ? icon : { uri: 'https://italygoadmin.com' + icon };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBackgroundColor }]}>
        <Image source={iconSource} style={styles.icon} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '28%',
    minHeight: 80,
    borderRadius: 18,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  label: {
    textAlign: 'center',
    fontWeight: FONT_WEIGHTS.bold,
    color: '#1E2D3A',
    fontSize: FONT_SIZES.SMALL,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CategoryCard;
