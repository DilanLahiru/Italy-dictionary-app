import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  GestureResponderEvent,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { COLORS } from '../constants/colors';
import {
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../constants/dimensions';
import { ASSETS, HOME_TAB_ITEMS } from '../constants/homeConstants';
import TabBar from '../components/TabBar';
import WordDetailModal from './WordDetailModal';
import NotificationModal from './NotificationModal';
import { logError } from '../utils/errorHandler';

/**
 * Props for FavoritesScreen component
 */
interface FavoritesScreenProps {
  /** Callback to open home screen */
  onOpenHome?: () => void;
  /** Callback to open settings screen */
  onOpenSettings?: () => void;
  /** Callback to open notifications */
  onOpenNotification?: () => void;
  /** Callback to open user profile */
  onOpenProfile?: () => void;
}

/**
 * Favorite word structure from AsyncStorage
 */
interface FavoriteWord {
  id: string;
  name: string;
  documentId?: string;
  Italy_word?: string;
  English_word?: string;
  Sinhala_word?: string;
  Category?: string;
  Image?: Array<{ url: string }>;
  Audio?: any;
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
}

/**
 * Storage key for favorites
 */
const FAVORITES_STORAGE_KEY = '@italian_word_teacher_favorites';

/**
 * Extract the main word text from favorite word object
 * @param word - The favorite word object
 * @returns The word text in Italian
 */
const getWordText = (word: FavoriteWord): string => {
  // Use name or Italy_word (they should both have the same value now)
  const text = word.name || word.Italy_word || 'Unknown Word';
  return text;
};

/**
 * Extract image URL from favorite word object
 * @param word - The favorite word object
 * @returns The image URL or undefined
 */
const getImageUrl = (word: FavoriteWord): string | undefined => {
  if (word.Image && Array.isArray(word.Image) && word.Image.length > 0) {
    return word.Image[0].url;
  }
  return undefined;
};

/**
 * FavoritesScreen Component
 * Displays and manages user's favorite Italian words
 *
 * @component
 * @example
 * return (
 *   <FavoritesScreen
 *     onOpenHome={() => navigation.navigate('Home')}
 *     onOpenSettings={() => navigation.navigate('Settings')}
 *   />
 * )
 */
const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onOpenHome,
  onOpenSettings,
  onOpenNotification,
  onOpenProfile,
}) => {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<FavoriteWord | null>(null);
  const [activeTab, setActiveTab] = useState('favorites');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [userInitial, setUserInitial] = useState('U');

  /**
   * Load favorites from AsyncStorage on component mount
   */
  /**
   * Load favorites from persistent storage
   */
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(
          Array.isArray(parsedFavorites) ? parsedFavorites : [],
        );
      }
    } catch (error) {
      logError('FavoritesScreen', error, { action: 'loadFavorites' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserInitial = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userName = user?.username || user?.name || user?.email || 'U';
      setUserInitial(String(userName).trim().charAt(0).toUpperCase() || 'U');
    } catch (error) {
      logError('FavoritesScreen', error, { action: 'loadUserInitial' });
    }
  }, []);

  useEffect(() => {
    loadFavorites();
    loadUserInitial();
  }, [loadFavorites, loadUserInitial]);

  /**
   * Handle tab navigation
   */
  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'home':
        onOpenHome?.();
        break;
      case 'favorites':
        // Already on favorites
        break;
      case 'settings':
        onOpenSettings?.();
        break;
    }
  }, [onOpenHome, onOpenSettings]);

  /**
   * Open word detail modal
   */
  const handleOpenDetail = useCallback((word: FavoriteWord) => {
    setSelectedWord(word);
  }, []);

  /**
   * Close word detail modal
   */
  const handleCloseDetail = useCallback(() => {
    setSelectedWord(null);
  }, []);

  /**
   * Remove word from favorites
   */
  const handleRemoveFavorite = useCallback(
    async (wordId: string) => {
      try {
        const updatedFavorites = favorites.filter(fav => fav.id !== wordId);
        setFavorites(updatedFavorites);

        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(updatedFavorites),
        );
      } catch (error) {
        logError('FavoritesScreen', error, { action: 'removeFavorite', wordId });
      }
    },
    [favorites],
  );

  /**
   * Show confirmation before removing favorite word
   */
  const handleConfirmRemoveFavorite = useCallback(
    (wordId: string, event: GestureResponderEvent) => {
      // Prevent event propagation to parent TouchableOpacity
      event.stopPropagation();

      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Remove Favorite',
        textBody: 'Are you sure you want to remove this word from favorites?',
        button: 'Remove',
        onPressButton: () => {
          Dialog.hide();
          handleRemoveFavorite(wordId);
        },
      });
    },
    [handleRemoveFavorite],
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBadge}>
        <Text style={styles.emptyIcon}>♥</Text>
      </View>
      <Text style={styles.emptyTitle}>No Favorite Words Yet</Text>
      <Text style={styles.emptySubtitle}>
        Save the Italian words you want to revisit, and they will appear here.
      </Text>
    </View>
  );

  /**
   * Render loading state
   */
  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading favorites...</Text>
    </View>
  );

  /**
   * Render favorite word item
   */
  const renderFavoriteItem = ({ item }: { item: FavoriteWord }) => {
    const displayText = getWordText(item);
    const initial = String(displayText).trim().charAt(0)?.toUpperCase() || 'A';
    const wordType = item.Category || 'Noun';
    const imageUrl = getImageUrl(item);

    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleOpenDetail(item)}
        activeOpacity={0.8}
      >
        <View style={styles.wordInfo}>
          {imageUrl ? (
            <Image
              source={{ uri: `https://italygoadmin.com/${imageUrl}` }}
              style={styles.wordImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.initialBadge}>
              <Text style={styles.initialText}>{initial}</Text>
            </View>
          )}

          <View style={styles.textBlock}>
            <Text style={styles.wordName} numberOfLines={1}>{displayText}</Text>
            {!!item.English_word && (
              <Text style={styles.translation} numberOfLines={1}>
                {item.English_word}
              </Text>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.wordType}>{wordType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={(e) => handleConfirmRemoveFavorite(item.id, e)}
            activeOpacity={0.7}
            style={styles.removeButton}
          >
            <Text style={styles.heart}>♥</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  // const displayFavorites = favorites.length > 0 ? favorites : [
  //   { id: 'sample-1', name: 'Africa', Category: 'Noun' },
  //   { id: 'sample-2', name: 'teiera', Category: 'Noun', English_word: 'kettle, teapot' },
  // ];


  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroPatternCircleLarge} />
        <View style={styles.heroPatternCircleSmall} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => {
                  setNotificationVisible(true);
                  onOpenNotification?.();
                }}
                style={styles.notificationButton}
                activeOpacity={0.8}>
                <Image source={ASSETS.notification} style={styles.notificationIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onOpenProfile} activeOpacity={0.8}>
                <View style={styles.profileBadge}>
                  <Text style={styles.profileInitial}>{userInitial}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
            <Text style={styles.headerTitle}>Your Favorites</Text>
            <Text style={styles.heroSubtitle}>
              {favorites.length === 0
                ? 'Your saved words will live here'
                : `${favorites.length} saved word${favorites.length === 1 ? '' : 's'} to practice`}
            </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentContainer}>
          {loading ? (
            renderLoadingState()
          ) : favorites.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={renderFavoriteItem}
              showsVerticalScrollIndicator={false}
            />
          )}
      </View>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          visible={true}
          word={getWordText(selectedWord)}
          details={selectedWord as any}
          onClose={handleCloseDetail}
          position="center"
        />
      )}

      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

      {/* Bottom Tab Bar */}
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

/**
 * Styles for FavoritesScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  heroGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroPatternCircleLarge: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -64,
    right: -38,
  },
  heroPatternCircleSmall: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -34,
    left: -20,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerActions: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  notificationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: COLORS.backgroundWhite,
  },
  profileBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundWhite,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.38)',
  },
  profileInitial: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  heroIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: SPACING.md,
  },
  heroIcon: {
    color: COLORS.backgroundWhite,
    fontSize: 30,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHTS.medium,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: 78,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 78,
  },
  loadingText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    marginTop: SPACING.MEDIUM,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: 78,
  },
  emptyIconBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FDEBEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 34,
    color: '#E53935',
  },
  emptyTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginBottom: SPACING.SMALL,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  wordItem: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  wordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  initialBadge: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundLightAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  wordImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: SPACING.md,
  },
  initialText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  textBlock: {
    justifyContent: 'center',
    flex: 1,
  },
  wordName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  translation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    backgroundColor: '#E3F2FD',
  },
  wordType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
  },
  removeButton: {
    padding: SPACING.xs,
    borderRadius: 16,
    backgroundColor: '#FDEBEC',
  },
  heart: {
    color: '#E53935',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  chevron: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.xs,
  },
});

export default FavoritesScreen;