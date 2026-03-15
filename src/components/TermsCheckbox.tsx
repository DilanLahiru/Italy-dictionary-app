/**
 * TermsCheckbox Component
 * Checkbox for agreeing to terms and conditions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: (value: boolean) => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  error?: string;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  onToggle,
  onTermsPress,
  onPrivacyPress,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={() => onToggle(!checked)}
        activeOpacity={0.7}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <View style={styles.textRow}>
          <Text style={styles.text}>I agree to the</Text>
          <TouchableOpacity onPress={onTermsPress}>
            <Text style={styles.link}>terms of use</Text>
          </TouchableOpacity>
          <Text style={styles.text}>and</Text>
          <TouchableOpacity onPress={onPrivacyPress}>
            <Text style={styles.link}>privacy policy</Text>
          </TouchableOpacity>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: SPACING.xs,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  textContainer: {
    flex: 1,
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  link: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    marginRight: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
});

export default TermsCheckbox;
