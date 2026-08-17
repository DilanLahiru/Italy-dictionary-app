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

  const CARD_PALETTE = [
    { bg: '#E3F2FD', badge: '#BBDEFB' },
    { bg: '#FFF3E0', badge: '#FFE0B2' },
    { bg: '#E8F5E9', badge: '#C8E6C9' },
    { bg: '#F3E5F5', badge: '#E1BEE7' },
    { bg: '#FCE4EC', badge: '#F8BBD0' },
    { bg: '#E0F7FA', badge: '#B2EBF2' },
  ];

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

  /**
   * Render subcategory card
   */
  const renderSubcategoryCard = ({ item, index }: { item: SubCategory; index: number }) => {
    const palette = CARD_PALETTE[index % CARD_PALETTE.length];
    return (
      <TouchableOpacity
        style={[styles.subcategoryCard, { backgroundColor: palette.bg }]}
        onPress={() => handleSubcategoryPress(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.subcategoryBadge, { backgroundColor: palette.badge }]}>
          <Text style={styles.subcategoryBadgeText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.subcategoryContent}>
          <Text style={styles.subcategoryName} numberOfLines={2}>{item.name}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#1565C0', '#1D5FE5']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.headerGradient}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title} numberOfLines={1}>{category.name}</Text>
          <Text style={styles.headerSubtitle}>
            {subcategories.length} {subcategories.length === 1 ? 'subcategory' : 'subcategories'}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>
    </LinearGradient>
  );

  /**
   * Render empty state
   */
  if (subcategories.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          {renderHeader()}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🗂️</Text>
            <Text style={styles.emptyText}>No subcategories found</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {renderHeader()}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  safe: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: BORDER_RADIUS.lg,
    paddingBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: -8,
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: FONT_WEIGHTS.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  subcategoryCard: {
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  subcategoryBadge: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  subcategoryBadgeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  subcategoryContent: {
    flex: 1,
  },
  subcategoryName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
  },
  chevron: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default CategoryDetailScreen;
