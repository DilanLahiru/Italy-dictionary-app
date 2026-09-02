/**
 * LanguageSelector Component
 * Language selection tabs for the home screen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, DEVICE_HEIGHT } from '../constants/dimensions';

interface LanguageSelectorProps {
  languages: string[];
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={[
            styles.button,
            selectedLanguage === language && styles.buttonActive,
          ]}
          onPress={() => onLanguageChange(language)}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.text,
              selectedLanguage === language && styles.textActive,
            ]}
          >
            {language}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    marginTop: DEVICE_HEIGHT * 0.035,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.EXTRA_SMALL,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    backgroundColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  buttonActive: {
    backgroundColor: '#2B82F8',
  },
  text: {
    color: '#57677A',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  textActive: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default LanguageSelector;
