/**
 * SecondaryButton Component
 * Reusable secondary/outline button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/dimensions';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: SPACING.md,
    resizeMode: 'contain',
  },
  text: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default SecondaryButton;
