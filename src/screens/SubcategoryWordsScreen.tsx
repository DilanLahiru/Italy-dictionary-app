/**
 * SubcategoryWordsScreen Component
 * Displays words for a selected subcategory
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Dialog,Toast } from 'react-native-alert-notification';
import WordDetailModal from './WordDetailModal';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import TabBar from '../components/TabBar';
import { HOME_TAB_ITEMS } from '../constants/homeConstants';
import { useAppDispatch } from '../store/hooks';
import { getAllWords } from '../features/words/wordSlice';

interface SubCategory {
  id: number;
  name: string;
  documentId: string;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

interface SubcategoryWordsScreenProps {
  subcategory: SubCategory;
  onBack?: () => void;
  onOpenHome?: () => void;
  onOpenFavorites?: () => void;
  onOpenSettings?: () => void;
}

interface FavoriteWord {
  id: string;
  name: string;
  Italy_word?: string;
  English_word?: string;
  Sinhala_word?: string;
  Category?: string;
  Image?: Array<{ url: string }>;
}

const FAVORITES_STORAGE_KEY = '@italian_word_teacher_favorites';

const SubcategoryWordsScreen: React.FC<SubcategoryWordsScreenProps> = ({
  subcategory,
  onBack,
  onOpenHome,
  onOpenFavorites,
  onOpenSettings,
}) => {
  const dispatch = useAppDispatch();
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [filteredWords, setFilteredWords] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Load favorites and fetch words on mount
   */
  useEffect(() => {
    loadFavorites();
    fetchAndFilterWords();
  }, [subcategory]);

  /**
   * Fetch words from backend and filter by subcategory
   */
  const fetchAndFilterWords = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all words from backend
      const result = await dispatch(getAllWords() as any).unwrap();
      
      // Extract words array from response
      const allWords = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
      
      console.log('All words fetched:', allWords.length);
      
      // Filter words that belong to this subcategory
      const wordsForSubcategory = allWords.filter((word: any) => {
        // Check if word has subcategory reference matching the selected subcategory
        if (word.sub_category_id) {
          return word.sub_category_id === subcategory.id;
        }
        
        // Check if word.sub_category is an object with id
        if (typeof word.sub_category === 'object' && word.sub_category?.id) {
          return word.sub_category.id === subcategory.id;
        }
        
        return false;
      });
      
      console.log(`Filtered words for subcategory ${subcategory.name}:`, wordsForSubcategory.length);
      setFilteredWords(wordsForSubcategory);
    } catch (error) {
      console.error('Error fetching words:', error);
      setFilteredWords([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, subcategory]);

  /**
   * Load favorites from AsyncStorage
   */
  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save favorites to AsyncStorage
   */
  const saveFavorites = useCallback(async (newFavorites: FavoriteWord[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  /**
   * Check if word is favorited
   */
  const isFavorited = useCallback((wordId: string): boolean => {
    return favorites.some(fav => fav.id === wordId);
  }, [favorites]);

  /**
   * Get word text (Italian word)
   */
  const getWordText = (word: any): string => {
    return word.Italy_word || word.italian || word.word || word.name || 'Unknown';
  };

  /**
   * Get word ID
   */
  const getWordId = (word: any): string => {
    return String(word.documentId || word.id || word.Italy_word || '');
  };

  /**
   * Get image URL
   */
  const getImageUrl = (word: any): string | undefined => {
    if (word.Image && Array.isArray(word.Image) && word.Image.length > 0) {
      return word.Image[0].url;
    }
    return word.imageUrl;
  };

  /**
   * Get translations
   */
  const getTranslations = (word: any): Record<string, string> => {
    const translations: Record<string, string> = {};
    if (word.English_word) {
      translations['English'] = word.English_word;
    }
    if (word.Sinhala_word) {
      translations['Sinhala'] = word.Sinhala_word;
    }
    return translations;
  };

  /**
   * Toggle favorite
   */
  const toggleFavorite = useCallback((word: any) => {
    const wordId = getWordId(word);
    const wordText = getWordText(word);

    setFavorites(prev => {
      let newFavorites: FavoriteWord[];

      if (isFavorited(wordId)) {
        // Remove from favorites
        newFavorites = prev.filter(fav => fav.id !== wordId);
      } else {
        // Add to favorites
        const favoriteWord: FavoriteWord = {
          id: wordId,
          name: wordText,
          Italy_word: wordText,
          English_word: word.English_word,
          Sinhala_word: word.Sinhala_word,
          Category: word.Category,
          Image: word.Image,
        };
        newFavorites = [...prev, favoriteWord];
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Added to Favorites',
          textBody: `"${wordText}" has been added to your favorites`,
        });
      }

      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [isFavorited, saveFavorites]);

  /**
   * Handle word press
   */
  const handleWordPress = (word: any) => {
    setSelectedWord(word);
  };

  /**
   * Close detail modal
   */
  const closeDetail = () => {
    setSelectedWord(null);
  };

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

  /**
   * Render word item
   */
  const renderWordItem = ({ item }: { item: any }) => {

    const wordId = getWordId(item);
    const isFav = isFavorited(wordId);
    const imageUrl = getImageUrl(item);
    const wordText = getWordText(item);

    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleWordPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.wordContent}>
          {imageUrl ? (
            <Image
              source={{ uri: 'https://italygoadmin.com' + imageUrl }}
              style={styles.wordImage}
            />
          ) : (
            <View style={styles.wordImageFallback}>
              <Text style={styles.wordImageFallbackText}>
                {wordText.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.wordInfo}>
            <Text style={styles.wordText} numberOfLines={1}>{wordText}</Text>
            {item.English_word && (
              <Text style={styles.wordTranslation} numberOfLines={1}>{item.English_word}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item)}
        >
          <Text style={[styles.heart, isFav && styles.heartActive]}>
            {isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.chev}>›</Text>
      </TouchableOpacity>
    );
  };

  const visibleWords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return filteredWords;
    }
    return filteredWords.filter(word => getWordText(word).toLowerCase().includes(query));
  }, [filteredWords, searchQuery]);

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
          <Text style={styles.title} numberOfLines={1}>{subcategory.name}</Text>
          <Text style={styles.headerSubtitle}>
            {filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a word..."
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {!!searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          {renderHeader()}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading words...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  /**
   * Render empty state
   */
  if (filteredWords.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safe}>
          {renderHeader()}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyText}>No words found in this category</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {renderHeader()}

        {/* Words List */}
        <FlatList
          data={visibleWords}
          keyExtractor={(item, index) => `${getWordId(item)}-${index}`}
          renderItem={renderWordItem}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyText}>No words match "{searchQuery}"</Text>
            </View>
          }
        />
      </SafeAreaView>

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          visible={!!selectedWord}
          word={getWordText(selectedWord)}
          details={{
            id: getWordId(selectedWord),
            name: getWordText(selectedWord),
            translations: getTranslations(selectedWord),
            imageUrl: getImageUrl(selectedWord),
            category: selectedWord.Category,
            createdAt: selectedWord.createdAt || new Date().toISOString(),
            updatedAt: selectedWord.updatedAt || new Date().toISOString(),
          } as any}
          isFavorite={isFavorited(getWordId(selectedWord))}
          onClose={closeDetail}
          onToggleFavorite={() => toggleFavorite(selectedWord)}
          position="center"
        />
      )}

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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 42,
  },
  searchIcon: {
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.sm,
  },
  searchClear: {
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.sm,
    paddingLeft: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textDark,
    fontSize: FONT_SIZES.md,
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
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  wordItem: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  wordContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  wordImage: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    resizeMode: 'cover',
  },
  wordImageFallback: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundLightAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordImageFallbackText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  wordTranslation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  heartButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  heart: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
  heartActive: {
    color: '#E53935',
  },
  chev: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default SubcategoryWordsScreen;
