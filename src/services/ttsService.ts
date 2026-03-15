/**
 * Text-to-Speech Service
 * Handles all TTS operations with proper error handling and initialization
 */

import Tts from 'react-native-tts';
import { TTS_CONFIG, TTS_LANGUAGES, TTSLanguage } from '../constants/tts';

/** Initialize TTS engine with default settings */
export const initializeTTS = async (): Promise<void> => {
  try {
    await Tts.setDefaultLanguage(TTS_CONFIG.DEFAULT_LANGUAGE);
    await Tts.setDefaultRate(TTS_CONFIG.DEFAULT_RATE);
    await Tts.setIgnoreSilentSwitch(TTS_CONFIG.IGNORE_SILENT_SWITCH);
  } catch (error) {
    console.error('Failed to initialize TTS:', error);
    throw new Error('TTS initialization failed');
  }
};

/**
 * Speak text in specified language
 * @param text - Text to be spoken
 * @param language - Language code (default: Italian)
 * @throws {Error} if text is empty or TTS operation fails
 */
export const speakText = async (
  text: string,
  language: TTSLanguage = TTS_LANGUAGES.ITALIAN,
): Promise<void> => {
  try {
    if (!text || text === '—') {
      console.warn('Cannot speak empty or placeholder text');
      return;
    }

    await Tts.stop();
    await Tts.setDefaultLanguage(language);
    await Tts.speak(text);
  } catch (error) {
    console.error(`Failed to speak text: "${text}"`, error);
    throw new Error('TTS speech operation failed');
  }
};

/** Stop current TTS playback */
export const stopSpeech = async (): Promise<void> => {
  try {
    await Tts.stop();
  } catch (error) {
    console.error('Failed to stop TTS:', error);
  }
};

/**
 * Get the text to be spoken from word details
 * @param details - Word details object
 * @param language - Language key
 * @param fallbackText - Fallback text if translation not found
 * @returns Text to be spoken
 */
export const getTextToSpeak = (
  details: any,
  language: keyof typeof TTS_LANGUAGES,
  fallbackText: string,
): string => {
  const languageKey = Object.entries(TTS_LANGUAGES).find(
    ([key]) => key === language,
  )?.[0];

  if (!languageKey) return fallbackText;

  const translationKey = language === 'ITALIAN' ? 'Italian' : language.charAt(0) + language.slice(1).toLowerCase();

  return (
    details?.translations?.[translationKey] ||
    (language === 'ITALIAN' && details?.Italy_word) ||
    (language === 'SINHALA' && details?.Sinhala_word) ||
    (language === 'ENGLISH' && details?.English_word) ||
    fallbackText
  );
};
