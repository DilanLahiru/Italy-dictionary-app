/**
 * SearchResultsScreen Component
 * Displays search results for words
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordDetailModal from './WordDetailModal';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {Word} from '../types/word';
import {COLORS} from '../constants/colors';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
} from '../constants/dimensions';

const FAVORITES_STORAGE_KEY = '@italian_word_teacher_favorites';

interface SearchResultsScreenProps {
  searchQuery: string;
  onBack?: () => void;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  searchQuery,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const wordState = useAppSelector(state => state.word);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [selected, setSelected] = useState<Word | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleWordPress = (word: any) => {
    setSelectedWord(word);
    setSelected(word);
    setModalVisible(true);
  };

  // Helper function to build translations object
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

  const closeDetail = () => setModalVisible(false);

  const handleToggleFavorite = async (word: any) => {
    try {
      const isFavorite = favorites.some(
        fav => fav.id === word.id || fav.documentId === word.documentId,
      );

      let updated: any[];
      if (isFavorite) {
        updated = favorites.filter(
          fav => fav.id !== word.id && fav.documentId !== word.documentId,
        );
      } else {
        updated = [...favorites, word];
      }

      setFavorites(updated);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (word: any) => {
    return favorites.some(
      fav => fav.id === word.id || fav.documentId === word.documentId,
    );
  };

  const getWordText = (word: any): string => {
    console.log('====================================');
    console.log(word);
    console.log('====================================');
    return word.Italy_word || word.italian || word.word || 'Unknown';
  };

  const getTranslation = (word: any, language: string = 'English'): string => {
    if (language === 'English') {
      return word.English_word || word.english || '';
    }
    if (language === 'Sinhala') {
      return word.Sinhala_word || word.sinhala || '';
    }
    return '';
  };

  const getImageUrl = (word: any): string | undefined => {
    if (word.Image && Array.isArray(word.Image) && word.Image.length > 0) {
      return word.Image[0].url;
    }
    return word.imageUrl;
  };

  const searchResults = Array.isArray(wordState.words)
    ? wordState.words
    : Array.isArray((wordState.words as any)?.data)
    ? (wordState.words as any).data
    : [];

  const renderWordItem = ({item}: {item: any}) => {
    const imageUrl = getImageUrl(item);
    const favorited = isFavorite(item);
    const wordText = getWordText(item);

    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleWordPress(item)}
        activeOpacity={0.8}>
        {imageUrl ? (
          <Image
            source={{uri: `https://italygoadmin.com/${imageUrl}`}}
            style={styles.wordImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.wordImageFallback}>
            <Text style={styles.wordImageFallbackText}>
              {wordText.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.wordContent}>
          <Text style={styles.wordName} numberOfLines={1}>{wordText}</Text>
          <Text style={styles.wordTranslation} numberOfLines={1}>
            {getTranslation(item, 'English')}
          </Text>
          {item.Category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.Category}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => handleToggleFavorite(item)}
          activeOpacity={0.8}>
          <Text style={[styles.heartIcon, favorited && styles.heartIconActive]}>
            {favorited ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.heroGradient}
      >
        <View style={styles.heroPatternCircleLarge} />
        <View style={styles.heroPatternCircleSmall} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            {/* <View style={styles.searchIconBadge}>
              <Text style={styles.searchIcon}>🔍</Text>
            </View> */}
            <Text style={styles.heroTitle}>Search Results</Text>
            <Text style={styles.heroSubtitle}>"{searchQuery}"</Text>
            <Text style={styles.resultCountBadge}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderWordItem}
          keyExtractor={item =>
            item.id || item.documentId || Math.random().toString()
          }
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={styles.emptyText}>
            No words found for "{searchQuery}"
          </Text>
          <Text style={styles.emptySubtext}>
            Try searching with different keywords
          </Text>
        </View>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordDetailModal
          visible={!!modalVisible}
          word={getWordText(selectedWord)}
          details={selectedWord as any}
          onClose={closeDetail}
          position="center"
        />
      )}
    </View>
  );
};

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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -40,
  },
  heroPatternCircleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -20,
    left: -20,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
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
  searchIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  searchIcon: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.md,
  },
  resultCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    color: COLORS.backgroundWhite,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  wordItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  wordImage: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  wordImageFallback: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundLightAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  wordImageFallbackText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  wordContent: {
    flex: 1,
  },
  wordName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  wordTranslation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  heartButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  heartIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
  heartIconActive: {
    color: '#E53935',
  },
  chevron: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;
