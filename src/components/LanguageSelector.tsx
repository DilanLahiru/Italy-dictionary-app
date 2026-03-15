/**
 * LanguageSelector Component
 * Language selection tabs for the home screen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

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
          activeOpacity={0.7}
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
  },
  button: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    backgroundColor: '#EFEFEF',
  },
  buttonActive: {
    backgroundColor: '#2D79D6',
  },
  text: {
    color: '#777',
    fontSize: FONT_SIZES.md,
  },
  textActive: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
  },
});

export default LanguageSelector;
