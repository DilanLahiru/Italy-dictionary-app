import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import WordDetailModal from './WordDetailModal';
import { useAppDispatch } from '../store/hooks';
import { getWordsByCategory, getAllWords } from '../features/words/wordSlice';

/**
 * Type definitions for house category screen
 */
interface Category {
  id: string;
  name: string;
}

interface Word {
  id: string;
  name: string;
  category: string;
  translations?: Record<string, string>;
  image?: string;
}

interface HouseCategoryScreenProps {
  onBack?: () => void;
}

/**
 * HouseCategoryScreen Component
 * Displays house-related vocabulary categories and words with API integration
 */
export default function HouseCategoryScreen({ onBack }: HouseCategoryScreenProps) {
  // Redux hooks
  const dispatch = useAppDispatch();

  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [words, setWords] = useState<Record<string, Word[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch house words on component mount
   */
  useEffect(() => {
    fetchHouseWords();
  }, []);

  /**
   * Fetch house words using Redux thunk (getAllWords)
   * Filters for house category and groups by category
   */
  const fetchHouseWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Dispatch getAllWords thunk
      const result = await dispatch(getAllWords() as any).unwrap();
      
      // Extract and process words - API returns { data: [...] }
      const allWords = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);

      if (allWords.length === 0) {
        throw new Error('No vocabulary found');
      }

      // Group words by category
      const groupedWords = groupWordsByCategory(allWords);
      const categoryList = extractCategories(allWords);

      setCategories(categoryList);
      setWords(groupedWords);
    } catch (err) {
      console.error('Error fetching house words:', err);
      setError('Failed to load vocabulary. Using fallback data.');
      setCategories(getFallbackCategories());
      //setWords(getFallbackWords());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Alternative: Fetch only house category words using getWordsByCategory thunk
   * More efficient if you only need specific category
   * 
   * Usage example:
   * const fetchHouseCategoryWords = useCallback(async () => {
   *   const result = await dispatch(getWordsByCategory('house') as any).unwrap();
   *   // Process result...
   * }, [dispatch]);
   */

  /**
   * Group words by category (Bathroom, Room, Kitchen, etc.)
   * API structure: { Category, English_word, Italy_word, Sinhala_word, Image: [{url: "..."}], id, documentId, ... }
   */
  const groupWordsByCategory = (wordList: any[]): Record<string, Word[]> => {
    const grouped: Record<string, Word[]> = {};

    wordList.forEach((item: any) => {
      const categoryName = item.Category || 'Other';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }

      // Extract image URL from Image array if available
      let imageUrl: string | undefined;
      if (Array.isArray(item.Image) && item.Image.length > 0) {
        imageUrl = item.Image[0].url;
      }

      grouped[categoryName].push({
        id: item.documentId || String(item.id),
        name: item.English_word || '',
        category: categoryName,
        translations: {
          Italian: item.Italy_word || '',
          English: item.English_word || '',
          Sinhala: item.Sinhala_word || '',
        },
        image: imageUrl,
      });
    });

    return grouped;
  };

  /**
   * Extract unique categories from words
   */
  const extractCategories = (wordList: any[]): Category[] => {
    const categorySet = new Set<string>();
    const categoryMap: Record<string, Category> = {};

    wordList.forEach((item: any, index: number) => {
      const categoryName = item.Category || 'Other';
      if (!categorySet.has(categoryName)) {
        categorySet.add(categoryName);
        categoryMap[categoryName] = {
          id: categoryName,
          name: categoryName,
        };
      }
    });

    return Object.values(categoryMap);
  };

  /**
   * Fallback categories for offline mode
   */
  const getFallbackCategories = (): Category[] => [
    { id: '1', name: 'Bathroom' },
    { id: '2', name: 'Room' },
    { id: '3', name: 'Kitchen' },
  ];

  /**
   * Fallback words for offline mode
   */
  const getFallbackWords = (): Record<string, Word[]> => ({
    Bathroom: [
      { id: '1', name: 'sinks', category: 'Bathroom', translations: { Italian: 'lavandini', English: 'Sinks', Sinhala: 'sinks' } },
      { id: '2', name: 'toilets', category: 'Bathroom', translations: { Italian: 'toilette', English: 'Toilets', Sinhala: 'toilets' } },
      { id: '3', name: 'showers', category: 'Bathroom', translations: { Italian: 'docce', English: 'Showers', Sinhala: 'showers' } },
      { id: '4', name: 'mirrors', category: 'Bathroom', translations: { Italian: 'specchi', English: 'Mirrors', Sinhala: 'mirrors' } },
    ],
    Room: [
      { id: '5', name: 'bed', category: 'Room', translations: { Italian: 'letto', English: 'Bed', Sinhala: 'bed' } },
      { id: '6', name: 'wardrobe', category: 'Room', translations: { Italian: 'armadio', English: 'Wardrobe', Sinhala: 'wardrobe' } },
      { id: '7', name: 'lamp', category: 'Room', translations: { Italian: 'lampada', English: 'Lamp', Sinhala: 'lamp' } },
      { id: '8', name: 'table', category: 'Room', translations: { Italian: 'tavolo', English: 'Table', Sinhala: 'table' } },
    ],
    Kitchen: [
      { id: '9', name: 'stove', category: 'Kitchen', translations: { Italian: 'fornello', English: 'Stove', Sinhala: 'stove' } },
      { id: '10', name: 'fridge', category: 'Kitchen', translations: { Italian: 'frigorifero', English: 'Fridge', Sinhala: 'fridge' } },
      { id: '11', name: 'cabinets', category: 'Kitchen', translations: { Italian: 'armadi', English: 'Cabinets', Sinhala: 'cabinets' } },
      { id: '12', name: 'oven', category: 'Kitchen', translations: { Italian: 'forno', English: 'Oven', Sinhala: 'oven' } },
    ],
  });

  /**
   * Toggle category expansion
   */
  const openCategory = useCallback((name: string) => {
    setExpanded(expanded === name ? null : name);
  }, [expanded]);

  /**
   * Open word detail modal
   */
  const openRecord = useCallback((word: string) => {
    setSelected(word);
  }, []);

  /**
   * Close word detail modal
   */
  const closeRecord = useCallback(() => {
    setSelected(null);
  }, []);

  /**
   * Toggle word favorite status
   */
  const toggleFavorite = useCallback((w: string) => {
    setFavorites(prev => ({ ...prev, [w]: !prev[w] }));
  }, []);

  /**
   * Get word details for modal
   */
  const getWordDetails = useCallback((wordName: string) => {
    // Find word in grouped words
    for (const categoryWords of Object.values(words)) {
      const word = categoryWords.find(w => w.name === wordName);
      if (word) {
        return {
          image: word.image || null,
          translations: word.translations || {},
        };
      }
    }
    return undefined;
  }, [words]);

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ItalyGo Dictionary</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D79D6" />
          <Text style={styles.loadingText}>Loading vocabulary...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render error state
   */
  if (error && Object.keys(words).length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>ItalyGo Dictionary</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHouseWords}>
            <Text style={styles.retryButtonText}>Retry</Text>
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

      <View style={styles.content}>
        {categories.length > 0 ? (
          <>
            {/* Category Pills */}
            <View style={styles.catRow}>
              {categories.map((cat, i) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catPill,
                    expanded === cat.name && { backgroundColor: '#DCEEFF' },
                    i % 2 === 0 && { marginRight: 12 },
                  ]}
                  onPress={() => openCategory(cat.name)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.catPillText}>{cat.name}</Text>
                  <Text style={styles.chev}>{expanded === cat.name ? '˄' : '›'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Expanded Word List */}
            {expanded && words[expanded] && (
              <View style={{ marginTop: 12 }}>
                {words[expanded].map((word) => (
                  <TouchableOpacity
                    key={word.id}
                    style={styles.recordRow}
                    onPress={() => openRecord(word.name)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.recordText}>{word.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.heart, favorites[word.name] && { color: '#FFD700' }]}>
                        {favorites[word.name] ? '♥' : '♡'}
                      </Text>
                      <Text style={styles.chev}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vocabulary available</Text>
          </View>
        )}
      </View>

      {selected && (
        <WordDetailModal
          visible={!!selected}
          word={selected}
          details={getWordDetails(selected)}
          isFavorite={!!favorites[selected]}
          onClose={closeRecord}
          onToggleFavorite={toggleFavorite}
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
  content: { paddingHorizontal: 16, marginTop: 16, flex: 1 },
  row: { flexDirection: 'row', marginBottom: 12 },
  catButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  catText: { color: '#1565C0', fontWeight: '700' },
  chev: { color: '#2D79D6', fontSize: 20 },
  recordRow: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordText: { color: '#333', fontSize: 16 },
  heart: { color: '#E53935', marginRight: 12, fontSize: 16 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  catPill: {
    width: '48%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  catPillText: { color: '#1565C0', fontWeight: '700', fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#1565C0',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2D79D6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});
