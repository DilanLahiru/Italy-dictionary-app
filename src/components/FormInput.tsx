/**
 * FormInput Component
 * Reusable input component with label and error handling
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, containerStyle, icon, style, ...inputProps }, ref) => {
    return (
      <View style={containerStyle}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputContainer, error && styles.inputError]}>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={COLORS.textMuted}
            {...inputProps}
          />
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

FormInput.displayName = 'FormInput';

const styles = StyleSheet.create({
  label: {
    marginTop: SPACING.sm,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.full,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.md,
    color: COLORS.textDark,
  },
  icon: {
    marginRight: SPACING.md,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    marginLeft: SPACING.lg,
  },
});

export default FormInput;
