/**
 * SearchSection Component
 * Search bar for the home screen
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface SearchSectionProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchText,
  onSearchTextChange,
  onSearch,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Text..."
        placeholderTextColor={COLORS.textTertiary}
        value={searchText}
        onChangeText={onSearchTextChange}
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch} activeOpacity={0.8}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: SPACING.md,
  },
  input: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: FONT_SIZES.md,
  },
  searchButton: {
    backgroundColor: '#E94A4A',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.md,
  },
  searchButtonText: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
  },
});

export default SearchSection;
