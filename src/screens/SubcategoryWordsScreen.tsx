/**
 * SubcategoryWordsScreen Component
 * Displays words for a selected subcategory
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
        activeOpacity={0.7}
      >
        <View style={styles.wordContent}>
          {imageUrl && (
            <Image
              source={{ uri: 'https://italygoadmin.com' + imageUrl }}
              style={styles.wordImage}
            />
          )}
          <View style={styles.wordInfo}>
            <Text style={styles.wordText}>{wordText}</Text>
            {item.English_word && (
              <Text style={styles.wordTranslation}>{item.English_word}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Text style={[styles.heart, isFav && { color: '#E53935' }]}>
            {isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  /**
   * Render loading state
   */
  if (loading) {
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
            <Text style={styles.title}>{subcategory.name}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading words...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  /**
   * Render empty state
   */
  if (filteredWords.length === 0) {
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
            <Text style={styles.title}>{subcategory.name}</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No words found</Text>
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
          <Text style={styles.title}>{subcategory.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Words List */}
        <FlatList
          data={filteredWords}
          keyExtractor={(item, index) => `${getWordId(item)}-${index}`}
          renderItem={renderWordItem}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
  },
  listContent: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  heart: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginLeft: SPACING.md,
  },
});

export default SubcategoryWordsScreen;
