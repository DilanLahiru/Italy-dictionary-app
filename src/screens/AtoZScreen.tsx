import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordDetailModal from './WordDetailModal';
import {useAppDispatch} from '../store/hooks';
import {getAllWords} from '../features/words/wordSlice';
import {Word} from '../types/word';
import {COLORS} from '../constants/colors';
import {FONT_SIZES, FONT_WEIGHTS} from '../constants/dimensions';

type Props = {
  onBack?: () => void;
};

const FAVORITES_STORAGE_KEY = '@italian_word_teacher_favorites';

interface FavoriteWord {
  id: string;
  name: string;
  documentId: string;
  Italy_word: string;
  English_word?: string;
  Sinhala_word?: string;
  Category?: string;
  Image?: any[];
  Audio?: any;
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
}

// Helper function to extract word text from Word object
const getWordText = (word: any): string => {
  // Try multiple field names - be very defensive about API structure
  const text =
    word.Italy_word ||
    word.italian ||
    word.word ||
    word.name ||
    JSON.stringify(word);
  console.log('AtoZScreen getWordText:', {input: word, result: text});
  return text;
};

// Helper function to extract image URL from word object
const getImageUrl = (word: any): string | undefined => {
  if (word.Image && Array.isArray(word.Image) && word.Image.length > 0) {
    return word.Image[0].url;
  }
  return word.imageUrl;
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

// Helper function to get unique word ID
const getWordId = (word: any): string => {
  return String(word.documentId || word.id || word.Italy_word || '');
};

// Helper function to group words by first letter
const groupWordsByLetter = (words: Word[]): Record<string, Word[]> => {
  const grouped: Record<string, Word[]> = {};

  words.forEach(word => {
    const wordText = getWordText(word);

    if (!wordText || wordText.length === 0) {
      console.warn('Empty word found:', word);
      return;
    }

    const firstLetter = wordText.charAt(0).toUpperCase();

    // Only include valid letters
    if (!/[A-Z]/.test(firstLetter)) {
      console.warn('Invalid first letter:', firstLetter, 'for word:', wordText);
      return;
    }

    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(word);
  });

  // Sort each group alphabetically
  Object.keys(grouped).forEach(letter => {
    grouped[letter].sort((a, b) => {
      const aText = getWordText(a);
      const bText = getWordText(b);
      return aText.localeCompare(bText);
    });
  });

  return grouped;
};

export default function AtoZScreen({onBack}: Props) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<string | null>('A');
  const [selected, setSelected] = useState<Word | null>(null);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [groupedWords, setGroupedWords] = useState<Record<string, Word[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load favorites from AsyncStorage
  const loadFavorites = useCallback(async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesJson) {
        const loadedFavorites = JSON.parse(favoritesJson);
        setFavorites(Array.isArray(loadedFavorites) ? loadedFavorites : []);
        console.log('Loaded favorites:', loadedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to AsyncStorage
  const saveFavorites = useCallback(async (newFavorites: FavoriteWord[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites),
      );
      console.log('Saved favorites:', newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Check if a word is in favorites
  const isFavorited = useCallback(
    (wordId: string): boolean => {
      return favorites.some(fav => fav.id === wordId);
    },
    [favorites],
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    (wordId: string, wordName: string, fullWord: any) => {
      console.log('toggleFavorite called:', {wordId, wordName, fullWord});

      setFavorites(prev => {
        let newFavorites: FavoriteWord[];

        if (isFavorited(wordId)) {
          // Remove from favorites
          newFavorites = prev.filter(fav => fav.id !== wordId);
        } else {
          // Add to favorites - save the complete word object
          const wordText = getWordText(fullWord);
          console.log('Creating favorite with text:', wordText);

          const favoriteWord: FavoriteWord = {
            id: getWordId(fullWord),
            name: wordText, // Use the properly extracted text
            Italy_word: wordText, // Also save as Italy_word for fallback
            documentId: fullWord.documentId || '',
            English_word: fullWord.English_word,
            Sinhala_word: fullWord.Sinhala_word,
            Category: fullWord.Category,
            Image: fullWord.Image,
            Audio: fullWord.Audio,
            createdAt: fullWord.createdAt,
            publishedAt: fullWord.publishedAt,
            updatedAt: fullWord.updatedAt,
          };
          console.log('Saving favorite:', favoriteWord);
          newFavorites = [...prev, favoriteWord];
        }

        // Save to AsyncStorage
        saveFavorites(newFavorites);
        return newFavorites;
      });
    },
    [isFavorited, saveFavorites],
  );

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await dispatch(getAllWords() as any).unwrap();

      console.log('Raw API result:', result);

      // Extract words from API response - try multiple possible structures
      let allWords: Word[] = [];

      if (Array.isArray(result?.data)) {
        allWords = result.data;
      } else if (Array.isArray(result?.words)) {
        allWords = result.words;
      } else if (Array.isArray(result)) {
        allWords = result;
      } else if (result && typeof result === 'object') {
        // If result is an object, try to find an array property
        const possibleArrays = Object.values(result).find(val =>
          Array.isArray(val),
        );
        if (possibleArrays) {
          allWords = possibleArrays as Word[];
        }
      }

      console.log('Extracted words:', allWords);
      console.log('Total words count:', allWords.length);

      if (allWords.length === 0) {
        setError('No vocabulary found');
        return;
      }

      // Log first word structure to help debug
      if (allWords.length > 0) {
        console.log('Sample word structure:', allWords[0]);
        console.log('Word properties:', Object.keys(allWords[0]));
      }

      // Group words by first letter
      const grouped = groupWordsByLetter(allWords);
      console.log('Grouped words:', grouped);
      console.log('Letters with words:', Object.keys(grouped));

      setGroupedWords(grouped);

      // Auto-expand the first available letter
      const firstLetter = Object.keys(grouped).sort()[0];
      console.log('Auto-expanding letter:', firstLetter);
      setExpanded(firstLetter || null);
    } catch (err) {
      console.error('Error fetching words:', err);
      setError('Failed to load vocabulary: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Load favorites when component mounts
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Fetch words when component mounts
  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const openDetail = (word: Word) => {
    setSelected(word);
  };

  const closeDetail = () => setSelected(null);

  // Get sorted letters
  const sortedLetters = Object.keys(groupedWords).sort();

  const totalWordCount = useMemo(
    () =>
      Object.values(groupedWords).reduce((sum, words) => sum + words.length, 0),
    [groupedWords],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return null;
    }
    return sortedLetters
      .flatMap(letter => groupedWords[letter])
      .filter(word => getWordText(word).toLowerCase().includes(query));
  }, [searchQuery, sortedLetters, groupedWords]);

  const renderWordRow = (word: Word, idx: number) => {
    const wordText = getWordText(word);
    const wordId = getWordId(word);
    const favorited = isFavorited(wordId);

    return (
      <TouchableOpacity
        key={wordId + idx}
        style={styles.itemRow}
        onPress={() => openDetail(word)}
        activeOpacity={0.8}>
        <View style={styles.itemAvatar}>
          <Text style={styles.itemAvatarText}>
            {wordText.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.itemText} numberOfLines={1}>
          {wordText}
        </Text>
        <View style={styles.itemRight}>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={e => {
              e.stopPropagation();
              toggleFavorite(wordId, wordText, word);
            }}>
            <Text style={[styles.heart, favorited && styles.heartActive]}>
              {favorited ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.chev}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#1565C0" />
          <Text style={styles.loadingText}>Loading words...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={fetchWords}
            style={styles.retryBtn}
            activeOpacity={0.85}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            activeOpacity={0.8}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>A-Z Dictionary</Text>
            <Text style={styles.headerSubtitle}>
              {totalWordCount} words to discover
            </Text>
          </View>
          <View style={{width: 36}} />
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

      {sortedLetters.length > 0 && !searchResults && (
        <View style={styles.quickNavWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickNav}>
            {sortedLetters.map(letter => (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.quickNavItem,
                  expanded === letter && styles.quickNavItemActive,
                ]}
                onPress={() =>
                  setExpanded(expanded === letter ? null : letter)
                }>
                <Text
                  style={[
                    styles.quickNavText,
                    expanded === letter && styles.quickNavTextActive,
                  ]}>
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        {searchResults ? (
          searchResults.length > 0 ? (
            <View style={styles.items}>
              {searchResults.map((word, idx) => renderWordRow(word, idx))}
            </View>
          ) : (
            <View style={styles.centerContent}>
              <Text style={styles.errorEmoji}>🔎</Text>
              <Text style={styles.loadingText}>
                No words match "{searchQuery}"
              </Text>
            </View>
          )
        ) : (
          sortedLetters.map(letter => {
            const items = groupedWords[letter];
            const isOpen = expanded === letter;

            return (
              <View key={letter} style={styles.section}>
                <TouchableOpacity
                  style={[
                    styles.sectionHeader,
                    isOpen && styles.sectionHeaderOpen,
                  ]}
                  onPress={() => setExpanded(isOpen ? null : letter)}
                  activeOpacity={0.85}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={styles.letterBadge}>
                      <Text style={styles.letter}>{letter}</Text>
                    </View>
                    <Text style={styles.sectionCount}>
                      {items.length} words
                    </Text>
                  </View>
                  <Text style={styles.caret}>{isOpen ? '˄' : '˅'}</Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.items}>
                    {items.map((word, idx) => renderWordRow(word, idx))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {selected && (
        <WordDetailModal
          visible={!!selected}
          word={getWordText(selected)}
          details={{
            translations: getTranslations(selected),
            imageUrl: getImageUrl(selected),
            category: selected.Category,
          }}
          isFavorite={isFavorited(getWordId(selected))}
          onClose={closeDetail}
          onToggleFavorite={() =>
            toggleFavorite(getWordId(selected), getWordText(selected), selected)
          }
          position="center"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F7FBFF'},
  headerGradient: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: COLORS.backgroundWhite,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: -8,
  },
  headerTextWrap: {flex: 1, alignItems: 'center'},
  title: {fontSize: 18, color: '#fff', fontWeight: '700'},
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {fontSize: 14, marginRight: 8},
  searchInput: {flex: 1, color: '#fff', fontSize: 14},
  searchClear: {color: '#fff', fontSize: 14, paddingLeft: 8},
  quickNavWrap: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F8',
  },
  quickNav: {paddingHorizontal: 12, paddingVertical: 10},
  quickNavItem: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F2F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  quickNavItemActive: {backgroundColor: '#1565C0'},
  quickNavText: {fontSize: 13, fontWeight: '700', color: '#1565C0'},
  quickNavTextActive: {color: '#fff'},
  container: {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40},
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {marginTop: 10, color: '#666', fontSize: 14},
  errorEmoji: {fontSize: 36, marginBottom: 8},
  errorText: {
    color: '#E53935',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  section: {marginBottom: 12},
  sectionHeader: {
    backgroundColor: '#DCEEFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderOpen: {backgroundColor: '#BEE1FF'},
  sectionHeaderLeft: {flexDirection: 'row', alignItems: 'center'},
  letterBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  letter: {fontWeight: '700', color: '#1565C0', fontSize: 16},
  sectionCount: {color: '#3E6A96', fontSize: 12, fontWeight: '600'},
  caret: {color: '#1565C0', fontSize: 16},
  items: {marginTop: 8},
  itemRow: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEF3F8',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  itemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F2F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemAvatarText: {color: '#1565C0', fontWeight: '700', fontSize: 13},
  itemText: {flex: 1, color: '#333', fontSize: 15, fontWeight: '500'},
  itemRight: {flexDirection: 'row', alignItems: 'center'},
  heartButton: {paddingHorizontal: 8, paddingVertical: 4},
  heart: {color: '#CCC', fontSize: 18},
  heartActive: {color: '#E53935'},
  chev: {color: '#999', fontSize: 18},
  retryBtn: {
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {color: '#fff', fontWeight: '600'},
});
