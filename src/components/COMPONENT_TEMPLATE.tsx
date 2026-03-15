/**
 * Component Template: StandardizedComponent
 * 
 * This is a template showing the standard pattern for components in this project.
 * Copy and modify as needed for your use case.
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

/**
 * Props interface for the component
 */
interface StandardizedComponentProps {
  /** Title text to display */
  title: string;
  /** Description text */
  description?: string;
  /** Callback when button is pressed */
  onPress?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Custom styles for root view */
  style?: any;
}

/**
 * StandardizedComponent
 * 
 * A reusable component following project standards.
 * 
 * @component
 * @example
 * return (
 *   <StandardizedComponent
 *     title="Hello"
 *     description="World"
 *     onPress={() => console.log('Pressed')}
 *   />
 * )
 */
const StandardizedComponent: React.FC<StandardizedComponentProps> = ({
  title,
  description,
  onPress,
  disabled = false,
  style,
}) => {
  /**
   * Handle button press
   */
  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress();
    }
  }, [disabled, onPress]);

  /**
   * Determine button opacity based on disabled state
   */
  const opacity = useMemo(
    () => (disabled ? 0.5 : 1),
    [disabled],
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Styles for StandardizedComponent
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.SMALL,
  },
  title: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHTS.BOLD,
    color: COLORS.textDark,
    marginBottom: SPACING.EXTRA_SMALL,
  },
  description: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.textSecondary,
  },
});

export default StandardizedComponent;

/**
 * Best Practices:
 * 
 * 1. Define Props interface with JSDoc for each property
 * 2. Use React.FC<PropsType> for typed components
 * 3. Add component documentation with @component and @example
 * 4. Use useCallback for event handlers
 * 5. Use useMemo for expensive computations
 * 6. Use const components, not function declarations
 * 7. Extract styles to StyleSheet at bottom
 * 8. Use design system constants (COLORS, SPACING, etc.)
 * 9. Make components reusable and flexible
 * 10. Handle all props with proper defaults
 * 11. Add accessibility props when needed (testID, accessibilityLabel)
 * 12. Avoid hardcoded strings and magic numbers
 * 13. Use activeOpacity for visual feedback
 * 14. Keep components focused on single responsibility
 * 15. Export named components (don't use default for easy refactoring)
 */
