import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WordDetailModal from './WordDetailModal';
import { useAppDispatch } from '../store/hooks';
import { getAllWords } from '../features/words/wordSlice';
import { Word } from '../types/word';

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
  const text = word.Italy_word || word.italian || word.word || word.name || JSON.stringify(word);
  console.log('AtoZScreen getWordText:', { input: word, result: text });
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

export default function AtoZScreen({ onBack }: Props) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<string | null>('A');
  const [selected, setSelected] = useState<Word | null>(null);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [groupedWords, setGroupedWords] = useState<Record<string, Word[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log('Saved favorites:', newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Check if a word is in favorites
  const isFavorited = useCallback((wordId: string): boolean => {
    return favorites.some(fav => fav.id === wordId);
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = useCallback((wordId: string, wordName: string, fullWord: any) => {
    console.log('toggleFavorite called:', { wordId, wordName, fullWord });
    
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
          name: wordText,  // Use the properly extracted text
          Italy_word: wordText,  // Also save as Italy_word for fallback
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
  }, [isFavorited, saveFavorites]);

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
        const possibleArrays = Object.values(result).find(val => Array.isArray(val));
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#1565C0" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading words...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#E53935', marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity onPress={fetchWords} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ItalyGo Dictionary</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {sortedLetters.map(letter => {
          const items = groupedWords[letter];
          const isOpen = expanded === letter;
          
          return (
            <View key={letter} style={styles.section}>
              <TouchableOpacity
                style={[styles.sectionHeader, isOpen && styles.sectionHeaderOpen]}
                onPress={() => setExpanded(isOpen ? null : letter)}
              >
                <Text style={styles.letter}>{letter}</Text>
                <Text style={styles.caret}>{isOpen ? '˄' : '˅'}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.items}>
                  {items.map((word, idx) => {
                    const wordText = getWordText(word);
                    const wordId = getWordId(word);
                    
                    return (
                      <TouchableOpacity 
                        key={wordId + idx} 
                        style={styles.itemRow} 
                        onPress={() => openDetail(word)} 
                        activeOpacity={0.8}
                      >
                        <Text style={styles.itemText}>{wordText}</Text>
                        <View style={styles.itemRight}>
                          <TouchableOpacity 
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleFavorite(wordId, wordText, word);
                            }}
                          >
                            <Text style={[styles.heart, isFavorited(wordId) && { color: '#E53935' }]}>
                              {isFavorited(wordId) ? '♥' : '♡'}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.chev}>›</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
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
          onToggleFavorite={() => toggleFavorite(getWordId(selected), getWordText(selected), selected)}
          position="center"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7FBFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backText: { fontSize: 28, color: '#2D79D6' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, color: '#1565C0', fontWeight: '700' },
  container: { paddingHorizontal: 16, paddingBottom: 40 },
  section: { marginBottom: 12 },
  sectionHeader: {
    backgroundColor: '#DCEEFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderOpen: { backgroundColor: '#BEE1FF' },
  letter: { fontWeight: '700', color: '#1565C0', fontSize: 16 },
  caret: { color: '#1565C0', fontSize: 16 },
  items: { marginTop: 8 },
  itemRow: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: { color: '#333', fontSize: 15 },
  itemRight: { flexDirection: 'row', alignItems: 'center' },
  heart: { color: '#CCC', marginRight: 12, fontSize: 18 },
  chev: { color: '#999', fontSize: 18 },
  retryBtn: {
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});