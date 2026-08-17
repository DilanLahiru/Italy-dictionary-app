/**
 * AllCategoriesScreen Component
 * Full category list view for the app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CategoryCard from '../components/CategoryCard';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants/dimensions';
import { COLORS } from '../constants/colors';
import { ASSETS } from '../constants/homeConstants';

interface AllCategoriesScreenProps {
  categories: any[];
  onBack: () => void;
  onOpenCategoryDetail?: (category: any) => void;
  onOpenAZ?: () => void;
}

const AllCategoriesScreen: React.FC<AllCategoriesScreenProps> = ({
  categories,
  onBack,
  onOpenCategoryDetail,
  onOpenAZ,
}) => {
  const allCategoryList = [
    {
      id: 'atoz',
      name: 'A-Z',
      icon: ASSETS.dictionary,
      kind: 'special',
    },
    ...(categories ?? []).map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon?.url,
      kind: 'normal',
    })),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
            <Text style={styles.backGlyph}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>All Categories</Text>
            <Text style={styles.subtitle}>
              {allCategoryList.length} {allCategoryList.length === 1 ? 'category' : 'categories'} to explore
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <FlatList
        data={allCategoryList}
        keyExtractor={item => String(item.id)}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.listRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyText}>No categories available yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CategoryCard
            icon={item.icon}
            label={item.name}
            cardColor={item.kind === 'special' ? '#F4F9FF' : '#FFFFFF'}
            iconBackgroundColor={item.kind === 'special' ? '#DCEEFF' : '#F2F6FA'}
            onPress={() => {
              if (item.id === 'atoz') {
                onOpenAZ?.();
                return;
              }

              const category = categories?.find(cat => cat.id === item.id);
              if (category) {
                onOpenCategoryDetail?.(category);
              }
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FBFF',
  },
  headerGradient: {
    borderBottomLeftRadius: BORDER_RADIUS.LARGE,
    borderBottomRightRadius: BORDER_RADIUS.LARGE,
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backGlyph: {
    fontSize: FONT_SIZES.XXL,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: -8,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: SPACING.EXTRA_LARGE,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    fontSize: 22,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 5,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: FONT_WEIGHTS.medium,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  listRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: '#7B8A99',
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default AllCategoriesScreen;
