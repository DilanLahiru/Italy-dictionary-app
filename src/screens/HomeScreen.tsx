/**
 * HomeScreen Component
 * Main dashboard screen with learning categories and navigation
 */

import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useHomeScreen } from '../hooks/useHomeScreen';
import {
  LANGUAGES,
  LEARNING_CATEGORIES,
  HOME_TAB_ITEMS,
  ASSETS,
} from '../constants/homeConstants';
import CategoryCard from '../components/CategoryCard';
import LanguageSelector from '../components/LanguageSelector';
import SearchSection from '../components/SearchSection';
import TabBar from '../components/TabBar';
import NotificationModal from './NotificationModal';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCategories} from '../features/words/wordSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface HomeScreenProps {
  onOpenAZ?: () => void;
  onOpenHouse?: () => void;
  onOpenCategoryDetail?: (category: any) => void;
  onOpenFavorites?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenSearchResults?: (query: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenAZ,
  onOpenHouse,
  onOpenCategoryDetail,
  onOpenFavorites,
  onOpenSettings,
  onOpenProfile,
  onOpenSearchResults,
}) => {
  const screen = useHomeScreen(onOpenSearchResults);
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.word);

  useEffect(() => {
    handleLoadCredentials();
    handleLoadCategories();
  }, []);

  const handleLoadCategories = async () => {
    try {
      const categorie = await dispatch(getCategories()).unwrap();
      console.log('====================================');
      console.log(categorie);
      console.log('====================================');
      console.log(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategoryPress = (categoryId: string | number, cat: any) => {
    console.log('====================================');
    console.log("category press :", cat);
    console.log('====================================');
    // Handle static AtoZ category
    if (categoryId === 'atoz') {
      onOpenAZ?.();
      return;
    }

    // Handle dynamic backend categories
    const category = categories?.find(c => c.id === categoryId);
    if (!category) {
      console.log(`Category with ID ${categoryId} not found`);
      return;
    }

    // Pass the full category object to the detail screen
    onOpenCategoryDetail?.(category);
  };

  const handleTabPress = (tabId: string) => {
    screen.setActiveTab(tabId);
    switch (tabId) {
      case 'home':
        // Already on home
        break;
      case 'favorites':
        onOpenFavorites?.();
        break;
      case 'settings':
        onOpenSettings?.();
        break;
    }
  };

  const handleLoadCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('rememberMe_email');
      const savedPassword = await AsyncStorage.getItem('rememberMe_password');
    
      console.log('====================================');
      console.log(savedEmail);
      console.log(savedPassword);
      console.log('====================================');
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>ItalyGo Dictionary</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={screen.openNotification}
                style={styles.notificationButton}
                activeOpacity={1}
              >
                <Image source={ASSETS.notification} style={styles.notificationIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onOpenProfile?.()}
                activeOpacity={0.7}
              >
                <Image source={ASSETS.user} style={styles.profileIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Card Section */}
          <View style={styles.searchCard}>
            <LanguageSelector
              languages={LANGUAGES}
              selectedLanguage={screen.selectedLanguage}
              onLanguageChange={screen.setSelectedLanguage}
            />

            <SearchSection
              searchText={screen.searchText}
              onSearchTextChange={screen.setSearchText}
              onSearch={screen.handleSearch}
            />
          </View>

          {/* Learning Categories Section */}
          <Text style={styles.sectionTitle}>Learn New Words</Text>
          <View style={styles.grid}>
            {/* Static AtoZ Card */}
            <CategoryCard
              key="atoz"
              icon={ASSETS.dictionary}
              label="A - Z"
              onPress={() => handleCategoryPress('atoz', null)}
            />

            {/* Dynamic Categories from Backend */}
            {categories?.map((category) => (
              <CategoryCard
                key={category.id}
                icon={category.icon?.url}
                label={category.name}
                onPress={() => handleCategoryPress(category.id, category)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Tab Bar */}
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={screen.activeTab}
        onTabPress={handleTabPress}
      />

      {/* Notification Modal */}
      <NotificationModal
        visible={screen.notificationVisible}
        onClose={screen.closeNotification}
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
    paddingHorizontal: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationButton: {
    padding: SPACING.xs,
  },
  notificationIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  searchCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    elevation: 2,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
});

export default HomeScreen;
