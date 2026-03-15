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

  const searchResults = Array.isArray(wordState.words?.data)
    ? wordState.words.data
    : [];

  const renderWordItem = ({item}: {item: any}) => {
    const imageUrl = getImageUrl(item);
    const favorited = isFavorite(item);

    return (
      <TouchableOpacity
        style={styles.wordItem}
        onPress={() => handleWordPress(item)}
        activeOpacity={0.7}>
        {imageUrl && (
          <Image
            source={{uri: `https://italygoadmin.com/${imageUrl}`}}
            style={styles.wordImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.wordContent}>
          <Text style={styles.wordName}>{getWordText(item)}</Text>
          <Text style={styles.wordTranslation}>
            {getTranslation(item, 'English')}
          </Text>
          <Text style={styles.wordCategory}>
            {item.Category || 'Uncategorized'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item)}
          activeOpacity={0.7}>
          <Text style={styles.favoriteIcon}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
      style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
          <Text style={styles.searchQuery}>"{searchQuery}"</Text>
        </View>

        {/* Results Count */}
        <View style={styles.countContainer}>
          <Text style={styles.resultCount}>
            Found {searchResults.length} result
            {searchResults.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Results List */}
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
            details={{
              translations: getTranslations(selected),
              imageUrl: getImageUrl(selected),
            }}
            //isFavorite={isFavorited(getWordId(selected))}
            onClose={closeDetail}
            //onToggleFavorite={() => toggleFavorite(getWordId(selected), getWordText(selected), selected)}
            position="center"
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  searchQuery: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  countContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  resultCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  wordItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    elevation: 2,
  },
  wordImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
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
  wordCategory: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  favoriteButton: {
    padding: SPACING.sm,
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchResultsScreen;
