/**
 * HomeScreen Component
 * Main dashboard screen with learning categories and navigation
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useHomeScreen} from '../hooks/useHomeScreen';
import {LANGUAGES, HOME_TAB_ITEMS, ASSETS} from '../constants/homeConstants';
import CategoryCard from '../components/CategoryCard';
import LanguageSelector from '../components/LanguageSelector';
import SearchSection from '../components/SearchSection';
import TabBar from '../components/TabBar';
import NotificationModal from './NotificationModal';
import {SPACING, FONT_SIZES, FONT_WEIGHTS} from '../constants/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCategories} from '../features/words/wordSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';

interface HomeScreenProps {
  onOpenAZ?: () => void;
  onOpenHouse?: () => void;
  onOpenCategoryDetail?: (category: any) => void;
  onOpenFavorites?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenSearchResults?: (query: string) => void;
  onOpenAllCategories?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenAZ,
  onOpenHouse: _onOpenHouse,
  onOpenCategoryDetail,
  onOpenFavorites,
  onOpenSettings,
  onOpenProfile,
  onOpenSearchResults,
  onOpenAllCategories,
}) => {
  const screen = useHomeScreen(onOpenSearchResults);
  const dispatch = useAppDispatch();
  const {categories} = useAppSelector(state => state.word);
  const [userInitial, setUserInitial] = useState('U');

  const handleLoadUserData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      if (userData) {
        const user = JSON.parse(userData);
        const userName = user?.username || user?.name || user?.email || 'U';
        const initial = String(userName).trim().charAt(0)?.toUpperCase() || 'U';
        setUserInitial(initial);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleLoadCredentials = useCallback(async () => {
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
  }, []);

  const handleLoadCategories = useCallback(async () => {
    try {
      await dispatch(getCategories()).unwrap();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    handleLoadUserData();
    handleLoadCredentials();
    handleLoadCategories();
  }, [handleLoadCategories, handleLoadCredentials, handleLoadUserData]);

  const handleCategoryPress = (categoryId: string | number, cat: any) => {
    console.log('====================================');
    console.log('category press :', cat);
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
      case 'history':
        // Keep on current home screen for now
        break;
      case 'settings':
        onOpenSettings?.();
        break;
    }
  };

  const categoryList = [
    {
      id: 'atoz',
      name: 'A-Z',
      icon: ASSETS.dictionary,
      kind: 'special',
    },
    ...(categories ?? []).slice(0, 5).map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon?.url,
      kind: 'normal',
    })),
  ];

  return (
    <View style={styles.overlay}>
      <ImageBackground
        source={ASSETS.BannerImage}
        style={styles.container}
        imageStyle={styles.backgroundImage}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.88)',
            'rgba(255,255,255,0.48)',
            'rgba(255,255,255,0.12)',
          ]}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
          style={styles.fadeOverlay}>
          <SafeAreaView style={styles.safe}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.menuButton} activeOpacity={0.8}>
                <Text style={styles.menuIcon}>☰</Text>
              </TouchableOpacity>

              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={screen.openNotification}
                  style={styles.notificationButton}
                  activeOpacity={1}>
                  <Image
                    source={ASSETS.notification}
                    style={styles.notificationIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onOpenProfile?.()}
                  activeOpacity={0.7}>
                  <View style={styles.profileBadge}>
                    <Text style={styles.profileInitial}>{userInitial}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>{`Italy Go
Dictionary`}</Text>

            <View style={styles.badgeRow}>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>🇮🇹</Text>
              </View>
              <Text style={styles.subtitle}>Learn Italian with Confidence</Text>
            </View>

            <SearchSection
              searchText={screen.searchText}
              onSearchTextChange={screen.setSearchText}
              onSearch={screen.handleSearch}
            />

            <LanguageSelector
              languages={LANGUAGES}
              selectedLanguage={screen.selectedLanguage}
              onLanguageChange={screen.setSelectedLanguage}
            />
            <View style={styles.categoriesHeader}>
              <Text style={styles.sectionTitle}>Explore Categories</Text>
              <TouchableOpacity onPress={onOpenAllCategories} activeOpacity={0.8}>
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={categoryList}
              keyExtractor={item => String(item.id)}
              numColumns={3}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.listRow}
              initialNumToRender={2}
              renderItem={({item}) => (
                <CategoryCard
                  icon={item.icon}
                  label={item.name}
                  cardColor={item.kind === 'special' ? '#F4F9FF' : '#FFFFFF'}
                  iconBackgroundColor={item.kind === 'special' ? '#DCEEFF' : '#F2F6FA'}
                  onPress={() => {
                    if (item.id === 'atoz') {
                      handleCategoryPress('atoz', null);
                      return;
                    }

                    const foundCategory = categories?.find(category => category.id === item.id);
                    if (foundCategory) {
                      handleCategoryPress(foundCategory.id, foundCategory);
                    }
                  }}
                />
              )}
            />
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={screen.activeTab}
        onTabPress={handleTabPress}
      />

      <NotificationModal
        visible={screen.notificationVisible}
        onClose={screen.closeNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 300, // Adjust the height as needed
    resizeMode: 'cover',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#effafc',
  },
  fadeOverlay: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 18,
  },
  contentContainer: {
    paddingBottom: SPACING.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  menuButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: FONT_WEIGHTS.bold,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    color: '#0B2240',
    fontWeight: FONT_WEIGHTS.EXTRA_BOLD,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  flagBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  flagText: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#1A2D39',
    fontWeight: FONT_WEIGHTS.BOLD,
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
  profileBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1D5FE5',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.XXL,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#172B3B',
    fontWeight: FONT_WEIGHTS.bold,
  },
  viewAll: {
    fontSize: FONT_SIZES.sm,
    color: '#2E7DE1',
    fontWeight: FONT_WEIGHTS.medium,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  listRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default HomeScreen;
