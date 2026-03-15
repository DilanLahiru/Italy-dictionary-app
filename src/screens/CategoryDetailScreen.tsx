/**
 * CategoryDetailScreen Component
 * Displays subcategories for a selected category
 * Generic screen that works for any backend category
 */

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import TabBar from '../components/TabBar';
import { HOME_TAB_ITEMS } from '../constants/homeConstants';

interface SubCategory {
  id: number;
  name: string;
  documentId: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

interface Word {
  id: number;
  English_word: string;
  Italy_word: string;
  Sinhala_word: string;
  documentId: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
  sub_category?: number | { id: number; name: string };
  sub_category_id?: number;
}

interface Category {
  id: number;
  name: string;
  icon?: any;
  sub_categories?: SubCategory[];
  words?: Word[];
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

interface CategoryDetailScreenProps {
  category: Category;
  onBack?: () => void;
  onOpenSubcategoryWords?: (subcategory: SubCategory) => void;
  onOpenHome?: () => void;
  onOpenFavorites?: () => void;
  onOpenSettings?: () => void;
}

const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  category,
  onBack,
  onOpenSubcategoryWords,
  onOpenHome,
  onOpenFavorites,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState('home');

  /**
   * Handle subcategory press
   * Pass the subcategory object to the next screen
   */
  const handleSubcategoryPress = useCallback((subcategory: SubCategory) => {
    // Pass the subcategory object - SubcategoryWordsScreen will fetch and filter words
    onOpenSubcategoryWords?.(subcategory);
  }, [onOpenSubcategoryWords]);

  /**
   * Handle tab press
   */
  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'home':
        onOpenHome?.();
        break;
      case 'favorites':
        onOpenFavorites?.();
        break;
      case 'settings':
        onOpenSettings?.();
        break;
    }
  };

  const subcategories = category.sub_categories || [];

  console.log('====================================');
  console.log(subcategories);
  console.log('====================================');

  /**
   * Render subcategory card
   */
  const renderSubcategoryCard = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity
      style={styles.subcategoryCard}
      onPress={() => handleSubcategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.subcategoryContent}>
        <Text style={styles.subcategoryName}>{item.name}</Text>
        {/* <Text style={styles.wordCount}>{category.words?.length || 0} words</Text> */}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  /**
   * Render empty state
   */
  if (subcategories.length === 0) {
    return (
      <LinearGradient
        colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{category.name}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No subcategories found</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{category.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Subcategories List */}
        <FlatList
          data={subcategories}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderSubcategoryCard}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </SafeAreaView>

      {/* Bottom Tab Bar */}
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  subcategoryCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    width: '48%',
  },
  subcategoryContent: {
    flex: 1,
  },
  subcategoryName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  wordCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  chevron: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    marginLeft: SPACING.md,
  },
});

export default CategoryDetailScreen;
