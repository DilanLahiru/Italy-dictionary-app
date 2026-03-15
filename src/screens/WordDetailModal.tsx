/**
 * WordDetailModal Component
 * Displays detailed information about a word with translations and TTS support
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { TTS_LANGUAGES } from '../constants/tts';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { WordDetailModalProps, ModalPosition, WordDetail } from '../types/word';
import { initializeTTS, speakText } from '../services/ttsService';

/**
 * Component for displaying detailed word information in a modal
 */
const WordDetailModal: React.FC<WordDetailModalProps> = ({
  visible,
  word,
  details,
  isFavorite = false,
  onClose,
  onToggleFavorite,
  position = 'center',
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const modalPosition: ModalPosition = useMemo(() => position || 'center', [position]);

  // Initialize TTS on mount
  useEffect(() => {
    const initTTS = async () => {
      try {
        await initializeTTS();
      } catch (error) {
        console.error('TTS initialization failed:', error);
      }
    };
    initTTS();
  }, []);

  /**
   * Handle word pronunciation
   * @param text - Text to pronounce
   * @param language - Language code
   */
  const handleSpeak = useCallback(
    async (text: string, language: string) => {
      if (!text || text === '—') {
        return;
      }

      setIsLoading(true);
      try {
        await speakText(text, language as any);
      } catch (error) {
        console.error('Speech error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Handle favorite toggle
   */
  const handleFavoritePress = useCallback(() => {
    if (word && onToggleFavorite) {
      onToggleFavorite(word);
    }
  }, [word, onToggleFavorite]);

  if (!word) {
    return null;
  }

  const getImageUri = (): string | undefined => {
    if (!details) return undefined;
    const basePath = 'https://italygoadmin.com';
    return details.image ? `${basePath}${details.image}` : `${basePath}${details.imageUrl}`;
  };

  const renderSpeakButton = (
    text: string,
    language: string,
    style?: any,
  ) => (
    <TouchableOpacity
      onPress={() => handleSpeak(text, language)}
      disabled={isLoading || !text || text === '—'}
      activeOpacity={0.7}
      style={style}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Text style={styles.iconSmall}>🔊</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType={modalPosition === 'bottom' ? 'slide' : 'fade'}
      transparent
      onRequestClose={onClose}
    >
      <View
        style={
          modalPosition === 'bottom'
            ? styles.bottomOverlay
            : styles.modalOverlay
        }
      >
        <View
          style={
            modalPosition === 'bottom'
              ? styles.bottomCard
              : styles.modalCardCenter
          }
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View
              style={[
                styles.langTab,
                modalPosition === 'bottom' && styles.langTabBottom,
              ]}
            >
              <Text style={styles.langTabText}>Italy</Text>
            </View>
            <Pressable onPress={onClose}>
              <Text
                style={[
                  styles.closeText,
                  modalPosition === 'center' && styles.closeTextCenter,
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>

          {/* Modal Body */}
          <View style={styles.modalBody}>
            {/* Italian Word Section */}
            <View style={styles.modalTopRow}>
              <View style={styles.wordContent}>
                <Text style={styles.wordTitle}>
                  {details?.translations?.Italian ||
                    details?.Italy_word ||
                    word}
                </Text>
                <View style={styles.actionRow}>
                  {renderSpeakButton(
                    details?.translations?.Italian ||
                      details?.Italy_word ||
                      word,
                    TTS_LANGUAGES.ITALIAN,
                  )}
                  <TouchableOpacity
                    onPress={handleFavoritePress}
                    style={styles.favoriteButton}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.iconSmall,
                        {
                          color: isFavorite ? COLORS.primary : COLORS.textTertiary,
                        },
                      ]}
                    >
                      {isFavorite ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Word Image */}
              {getImageUri() && (
                <Image
                  source={{ uri: getImageUri() }}
                  style={styles.modalImage}
                />
              )}
            </View>

            {/* Sinhala Translation */}
            <TranslationBlock
              language="Sinhala"
              text={
                details?.translations?.Sinhala ||
                details?.Sinhala_word ||
                '—'
              }
              onSpeak={() =>
                handleSpeak(
                  details?.translations?.Sinhala ||
                    details?.Sinhala_word ||
                    '—',
                  TTS_LANGUAGES.SINHALA,
                )
              }
              isLoading={isLoading}
            />

            {/* English Translation */}
            <TranslationBlock
              language="English"
              text={
                details?.translations?.English ||
                details?.English_word ||
                '—'
              }
              onSpeak={() =>
                handleSpeak(
                  details?.translations?.English ||
                    details?.English_word ||
                    '—',
                  TTS_LANGUAGES.ENGLISH,
                )
              }
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 * TranslationBlock Component
 * Displays a single language translation with speak and copy buttons
 */
interface TranslationBlockProps {
  language: string;
  text: string;
  onSpeak: () => void;
  isLoading: boolean;
}

const TranslationBlock: React.FC<TranslationBlockProps> = ({
  language,
  text,
  onSpeak,
  isLoading,
}) => (
  <View style={styles.translationBlock}>
    <Text style={styles.translationLabel}>{language}</Text>
    <View style={styles.translationInner}>
      <Text style={styles.translationText}>{text}</Text>
      <View style={styles.transIcons}>
        <TouchableOpacity
          onPress={onSpeak}
          disabled={isLoading || !text || text === '—'}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text style={styles.iconSmall}>🔊</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={styles.copyButton}
          activeOpacity={0.7}
        >
          <Text style={styles.iconSmall}>📋</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/**
 * Styles for WordDetailModal and TranslationBlock
 */
const styles = StyleSheet.create({
  // Overlay Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LARGE,
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  // Modal Card Styles
  bottomCard: {
    width: '100%',
    backgroundColor: COLORS.backgroundWhite,
    borderTopLeftRadius: BORDER_RADIUS.LARGE,
    borderTopRightRadius: BORDER_RADIUS.LARGE,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalCardCenter: {
    width: '90%',
    maxWidth: 520,
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
    paddingBottom: SPACING.MEDIUM,
  },

  // Header Styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  langTab: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.EXTRA_SMALL,
    paddingHorizontal: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.SMALL,
  },
  langTabBottom: {
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.LARGE,
  },
  langTabText: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: FONT_SIZES.MEDIUM,
  },
  closeText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: FONT_SIZES.MEDIUM,
  },
  closeTextCenter: {
    color: COLORS.error,
  },

  // Body Styles
  modalBody: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
  },

  // Word Section Styles
  modalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.LARGE,
  },
  wordContent: {
    flex: 1,
  },
  wordTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    fontWeight: FONT_WEIGHTS.EXTRA_BOLD,
    color: COLORS.textDark,
    marginBottom: SPACING.SMALL,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.SMALL,
  },
  favoriteButton: {
    marginLeft: SPACING.MEDIUM,
    padding: SPACING.SMALL,
  },
  modalImage: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.MEDIUM,
    marginLeft: SPACING.MEDIUM,
    backgroundColor: COLORS.backgroundLight,
  },

  // Translation Block Styles
  translationBlock: {
    marginBottom: SPACING.MEDIUM,
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.SMALL,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  translationLabel: {
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.SMALL,
  },
  translationInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  translationText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: FONT_SIZES.MEDIUM,
    flex: 1,
  },
  transIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    marginLeft: SPACING.MEDIUM,
    padding: SPACING.SMALL,
  },
  iconSmall: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.textDark,
  },
});

export default WordDetailModal;
