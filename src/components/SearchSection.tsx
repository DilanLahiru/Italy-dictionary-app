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
  const handleSubmit = () => {
    if (searchText.trim()) {
      onSearch();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchField}>
        <View style={styles.iconWrapper} pointerEvents="none">
          <Text style={styles.searchIcon}>⌕</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search words, phrases..."
          placeholderTextColor="rgba(255,255,255,0.82)"
          value={searchText}
          onChangeText={onSearchTextChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          blurOnSubmit
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor="#ffffff"
        />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.actionIcon}>◉</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xxxl * 0.8,
    marginBottom: SPACING.sm,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#3494F5',
    borderRadius: 28,
    paddingHorizontal: SPACING.md,
    shadowColor: '#1D4F9A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrapper: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  searchIcon: {
    fontSize: 22,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.md,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  actionIcon: {
    color: COLORS.backgroundWhite,
    fontSize: 17,
    fontWeight: FONT_WEIGHTS.bold,
    //lineHeight: 17,
  },
});

export default SearchSection;
