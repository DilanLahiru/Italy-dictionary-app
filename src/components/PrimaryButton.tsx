/**
 * PrimaryButton Component
 * Reusable primary button with gradient
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, style, isDisabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.backgroundWhite} />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  text: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
