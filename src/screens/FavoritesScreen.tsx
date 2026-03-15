// /**
//  * FavoritesScreen Component
//  * Displays user's favorite words with management options
//  */

// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   GestureResponderEvent,
//   Alert,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { COLORS } from '../constants/colors';
// import {
//   SPACING,
//   BORDER_RADIUS,
//   FONT_SIZES,
//   FONT_WEIGHTS,
// } from '../constants/dimensions';
// import { HOME_TAB_ITEMS, ASSETS } from '../constants/homeConstants';
// import TabBar from '../components/TabBar';
// import WordDetailModal from './WordDetailModal';
// import { logError } from '../utils/errorHandler';

// /**
//  * Props for FavoritesScreen component
//  */
// interface FavoritesScreenProps {
//   /** Callback to open home screen */
//   onOpenHome?: () => void;
//   /** Callback to open settings screen */
//   onOpenSettings?: () => void;
//   /** Callback to open notifications */
//   onOpenNotification?: () => void;
//   /** Callback to open user profile */
//   onOpenProfile?: () => void;
// }

// /**
//  * Favorite word structure from AsyncStorage
//  */
// interface FavoriteWord {
//   id: string;
//   name: string;
//   documentId?: string;
//   Italy_word?: string;
//   English_word?: string;
//   Sinhala_word?: string;
//   Category?: string;
//   Image?: Array<{ url: string }>;
//   Audio?: any;
//   createdAt?: string;
//   publishedAt?: string;
//   updatedAt?: string;
// }

// /**
//  * Storage key for favorites
//  */
// const FAVORITES_STORAGE_KEY = '@italian_word_teacher_favorites';

// /**
//  * Extract the main word text from favorite word object
//  * @param word - The favorite word object
//  * @returns The word text in Italian
//  */
// const getWordText = (word: FavoriteWord): string => {
//   // Use name or Italy_word (they should both have the same value now)
//   const text = word.name || word.Italy_word || 'Unknown Word';
//   console.log('FavoritesScreen getWordText:', { 
//     id: word.id,
//     name: word.name,
//     Italy_word: word.Italy_word,
//     result: text 
//   });
//   return text;
// };

// /**
//  * Extract image URL from favorite word object
//  * @param word - The favorite word object
//  * @returns The image URL or undefined
//  */
// const getImageUrl = (word: FavoriteWord): string | undefined => {
//   if (word.Image && Array.isArray(word.Image) && word.Image.length > 0) {
//     return word.Image[0].url;
//   }
//   return undefined;
// };

// /**
//  * Build translations object from favorite word
//  * @param word - The favorite word object
//  * @returns Object with English and Sinhala translations
//  */
// const buildTranslations = (word: FavoriteWord): Record<string, string> => {
//   const translations: Record<string, string> = {};

//   if (word.English_word) {
//     translations.English = word.English_word;
//   }
//   if (word.Sinhala_word) {
//     translations.Sinhala = word.Sinhala_word;
//   }

//   return translations;
// };

// /**
//  * FavoritesScreen Component
//  * Displays and manages user's favorite Italian words
//  *
//  * @component
//  * @example
//  * return (
//  *   <FavoritesScreen
//  *     onOpenHome={() => navigation.navigate('Home')}
//  *     onOpenSettings={() => navigation.navigate('Settings')}
//  *   />
//  * )
//  */
// const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
//   onOpenHome,
//   onOpenSettings,
//   onOpenNotification,
//   onOpenProfile,
// }) => {
//   const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedWord, setSelectedWord] = useState<FavoriteWord | null>(null);
//   const [activeTab, setActiveTab] = useState('favorites');

//   /**
//    * Load favorites from AsyncStorage on component mount
//    */
//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   /**
//    * Load favorites from persistent storage
//    */
//   const loadFavorites = useCallback(async () => {
//     try {
//       setLoading(true);
//       const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

//       if (storedFavorites) {
//         const parsedFavorites = JSON.parse(storedFavorites);
//         setFavorites(
//           Array.isArray(parsedFavorites) ? parsedFavorites : [],
//         );
//       }
//     } catch (error) {
//       logError('FavoritesScreen', error, { action: 'loadFavorites' });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * Handle tab navigation
//    */
//   const handleTabPress = useCallback((tabId: string) => {
//     setActiveTab(tabId);
//     switch (tabId) {
//       case 'home':
//         onOpenHome?.();
//         break;
//       case 'favorites':
//         // Already on favorites
//         break;
//       case 'settings':
//         onOpenSettings?.();
//         break;
//     }
//   }, [onOpenHome, onOpenSettings]);

//   /**
//    * Open word detail modal
//    */
//   const handleOpenDetail = useCallback((word: FavoriteWord) => {
//     setSelectedWord(word);
//   }, []);

//   /**
//    * Close word detail modal
//    */
//   const handleCloseDetail = useCallback(() => {
//     setSelectedWord(null);
//   }, []);

//   /**
//    * Remove word from favorites
//    */
//   const handleRemoveFavorite = useCallback(
//     async (wordId: string, event: GestureResponderEvent) => {
//       // Prevent event propagation to parent TouchableOpacity
//       event.stopPropagation();

//       try {
//         const updatedFavorites = favorites.filter(fav => fav.id !== wordId);
//         setFavorites(updatedFavorites);

//         await AsyncStorage.setItem(
//           FAVORITES_STORAGE_KEY,
//           JSON.stringify(updatedFavorites),
//         );
//       } catch (error) {
//         logError('FavoritesScreen', error, { action: 'removeFavorite', wordId });
//       }
//     },
//     [favorites],
//   );

//   /**
//    * Handle notification button press
//    */
//   const handleOpenNotification = useCallback(() => {
//     onOpenNotification?.();
//   }, [onOpenNotification]);

//   /**
//    * Handle profile button press
//    */
//   const handleOpenProfile = useCallback(() => {
//     onOpenProfile?.();
//   }, [onOpenProfile]);

//   /**
//    * Clear all favorites (for testing/debugging)
//    */
//   const handleClearFavorites = useCallback(async () => {
//     try {
//       await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
//       setFavorites([]);
//       Alert.alert('Success', 'Favorites cleared');
//     } catch (error) {
//       logError('FavoritesScreen', error, { action: 'clearFavorites' });
//     }
//   }, []);

//   /**
//    * Render empty state
//    */
//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Text style={styles.emptyTitle}>No Favorite Words Yet</Text>
//       <Text style={styles.emptySubtitle}>
//         Mark words as favorites to see them here
//       </Text>
//     </View>
//   );

//   /**
//    * Render loading state
//    */
//   const renderLoadingState = () => (
//     <View style={styles.centerContainer}>
//       <ActivityIndicator size="large" color={COLORS.primary} />
//       <Text style={styles.loadingText}>Loading favorites...</Text>
//     </View>
//   );

//   /**
//    * Render favorite word item
//    */
//   const renderFavoriteItem = ({ item }: { item: FavoriteWord }) => {
//     const displayText = getWordText(item);
//     console.log('renderFavoriteItem - Rendering item:', { id: item.id, displayText, itemKeys: Object.keys(item) });
    
//     return (
//       // <TouchableOpacity
//       //   style={styles.wordItem}
//       //   onPress={() => handleOpenDetail(item)}
//       //   activeOpacity={0.7}
//       // >
//       //   <Text style={styles.wordName}>{displayText}</Text>
//       //   <View style={styles.itemActions}>
//       //     <TouchableOpacity
//       //       onPress={(e) => handleRemoveFavorite(item.id, e)}
//       //       activeOpacity={0.7}
//       //     >
//       //       <Text style={styles.heart}>♥</Text>
//       //     </TouchableOpacity>
//       //     <Text style={styles.chevron}>›</Text>
//       //   </View>
//       // </TouchableOpacity>
//       <TouchableOpacity style={{width: '100%', height: 'auto', backgroundColor: 'red', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10}}>
//         <Text style={{fontSize: 20, color: 'red'}}>{displayText}</Text>

//       </TouchableOpacity>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
//       style={styles.container}
//     >
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.headerRow}>
//           <Text style={styles.headerTitle}>Italian Word Teacher</Text>
//           <View style={styles.headerActions}>
//             <TouchableOpacity
//               onPress={handleClearFavorites}
//               style={styles.headerButton}
//               activeOpacity={0.7}
//             >
//               <Text style={{ fontSize: 20 }}>🗑️</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={handleOpenNotification}
//               style={styles.headerButton}
//               activeOpacity={0.7}
//             >
//               <Image source={ASSETS.notification} style={styles.headerIcon} />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={handleOpenProfile}
//               style={styles.headerButton}
//               activeOpacity={0.7}
//             >
//               <Image source={ASSETS.user} style={styles.headerIcon} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content */}
//         {loading ? (
//           renderLoadingState()
//         ) : favorites.length === 0 ? (
//           renderEmptyState()
//         ) : (
//           <FlatList
//             data={favorites}
//             keyExtractor={item => item.id}
//             contentContainerStyle={styles.listContent}
//             scrollEnabled={false}
//             renderItem={renderFavoriteItem}
//           />
//         )}
//       </SafeAreaView>

//       {/* Word Detail Modal */}
//       {selectedWord && (
//         <WordDetailModal
//           visible={true}
//           word={getWordText(selectedWord)}
//           details={{
//             translations: buildTranslations(selectedWord),
//             imageUrl: getImageUrl(selectedWord),
//             Italy_word: selectedWord.Italy_word,
//             English_word: selectedWord.English_word,
//             Sinhala_word: selectedWord.Sinhala_word,
//           }}
//           onClose={handleCloseDetail}
//           position="center"
//         />
//       )}

//       {/* Bottom Tab Bar */}
//       <TabBar
//         items={HOME_TAB_ITEMS}
//         activeTabId={activeTab}
//         onTabPress={handleTabPress}
//       />
//     </LinearGradient>
//   );
// };

// /**
//  * Styles for FavoritesScreen
//  */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: SPACING.SMALL,
//     marginBottom: SPACING.LARGE,
//     width: '90%',
//   },
//   headerTitle: {
//     fontSize: FONT_SIZES.EXTRA_LARGE,
//     color: COLORS.primary,
//     fontWeight: FONT_WEIGHTS.BOLD,
//   },
//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.MEDIUM,
//   },
//   headerButton: {
//     padding: SPACING.SMALL,
//   },
//   headerIcon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: SPACING.XXXL,
//   },
//   loadingText: {
//     fontSize: FONT_SIZES.MEDIUM,
//     color: COLORS.primary,
//     fontWeight: FONT_WEIGHTS.SEMI_BOLD,
//     marginTop: SPACING.MEDIUM,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: SPACING.XXXL,
//     paddingHorizontal: SPACING.LARGE,
//   },
//   emptyTitle: {
//     fontSize: FONT_SIZES.EXTRA_LARGE,
//     color: COLORS.primary,
//     fontWeight: FONT_WEIGHTS.BOLD,
//     marginBottom: SPACING.SMALL,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     fontSize: FONT_SIZES.MEDIUM,
//     color: COLORS.textSecondary,
//     textAlign: 'center',
//   },
//   listContent: {
//     backgroundColor: 'yellow',
//     width: '100%',
//     // paddingBottom: SPACING.XXXL,
//     // width: '95%',
//   },
//   wordItem: {
//     backgroundColor: COLORS.backgroundWhite,
//     borderRadius: BORDER_RADIUS.MEDIUM,
//     paddingVertical: SPACING.MEDIUM,
//     paddingHorizontal: SPACING.MEDIUM,
//     marginBottom: SPACING.SMALL,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   wordName: {
//     fontSize: FONT_SIZES.MEDIUM,
//     color: COLORS.textDark,
//     fontWeight: FONT_WEIGHTS.SEMI_BOLD,
//     flex: 1,
//     minHeight: 20,
//   },
//   itemActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.MEDIUM,
//   },
//   heart: {
//     color: COLORS.error,
//     fontSize: FONT_SIZES.MEDIUM,
//   },
//   chevron: {
//     color: COLORS.textTertiary,
//     fontSize: FONT_SIZES.LARGE,
//   },
// });

// export default FavoritesScreen;

/**
 * FavoritesScreen Component
 * Displays user's favorite words with management options
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../constants/dimensions';
import { HOME_TAB_ITEMS, ASSETS } from '../constants/homeConstants';
import TabBar from '../components/TabBar';
import WordDetailModal from './WordDetailModal';
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
  console.log('FavoritesScreen getWordText:', { 
    id: word.id,
    name: word.name,
    Italy_word: word.Italy_word,
    result: text 
  });
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
 * Build translations object from favorite word
 * @param word - The favorite word object
 * @returns Object with English and Sinhala translations
 */
const buildTranslations = (word: FavoriteWord): Record<string, string> => {
  const translations: Record<string, string> = {};

  if (word.English_word) {
    translations.English = word.English_word;
  }
  if (word.Sinhala_word) {
    translations.Sinhala = word.Sinhala_word;
  }

  return translations;
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

  /**
   * Load favorites from AsyncStorage on component mount
   */
  useEffect(() => {
    loadFavorites();
  }, []);

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
    async (wordId: string, event: GestureResponderEvent) => {
      // Prevent event propagation to parent TouchableOpacity
      event.stopPropagation();

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
   * Handle notification button press
   */
  const handleOpenNotification = useCallback(() => {
    onOpenNotification?.();
  }, [onOpenNotification]);

  /**
   * Handle profile button press
   */
  const handleOpenProfile = useCallback(() => {
    onOpenProfile?.();
  }, [onOpenProfile]);

  /**
   * Clear all favorites (for testing/debugging)
   */
  const handleClearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      setFavorites([]);
      Alert.alert('Success', 'Favorites cleared');
    } catch (error) {
      logError('FavoritesScreen', error, { action: 'clearFavorites' });
    }
  }, []);

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Favorite Words Yet</Text>
      <Text style={styles.emptySubtitle}>
        Mark words as favorites to see them here
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
    
    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleOpenDetail(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.wordName}>{displayText}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity
            onPress={(e) => handleRemoveFavorite(item.id, e)}
            activeOpacity={0.7}
            style={styles.removeButton}
          >
            <Text style={styles.heart}>♥</Text>
          </TouchableOpacity>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>ItalyGo Dictionary</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleClearFavorites}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Text style={styles.clearIcon}>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenNotification}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Image source={ASSETS.notification} style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenProfile}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Image source={ASSETS.user} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
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
      </SafeAreaView>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          visible={true}
          word={getWordText(selectedWord)}
          details={{
            translations: buildTranslations(selectedWord),
            imageUrl: getImageUrl(selectedWord),
            Italy_word: selectedWord.Italy_word,
            English_word: selectedWord.English_word,
            Sinhala_word: selectedWord.Sinhala_word,
          }}
          onClose={handleCloseDetail}
          position="center"
        />
      )}

      {/* Bottom Tab Bar */}
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
      />
    </LinearGradient>
  );
};

/**
 * Styles for FavoritesScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.SMALL,
    marginBottom: SPACING.LARGE,
    paddingHorizontal: SPACING.LARGE,
    width: '100%',
  },
  headerTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MEDIUM,
  },
  headerButton: {
    padding: SPACING.SMALL,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  clearIcon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: SPACING.XXXL, // Space for tab bar
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.XXXL,
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
    paddingHorizontal: SPACING.LARGE,
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
    paddingHorizontal: SPACING.LARGE,
    paddingBottom: SPACING.LARGE,
  },
  wordItem: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  wordName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MEDIUM,
  },
  removeButton: {
    padding: SPACING.SMALL,
  },
  heart: {
    color: COLORS.error,
    fontSize: FONT_SIZES.MEDIUM,
  },
  chevron: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.LARGE,
  },
});

export default FavoritesScreen;