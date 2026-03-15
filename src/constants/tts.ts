/**
 * Text-to-Speech Constants
 * Configuration and language codes for TTS functionality
 */

export const TTS_CONFIG = {
  DEFAULT_LANGUAGE: 'it-IT',
  DEFAULT_RATE: 0.5,
  IGNORE_SILENT_SWITCH: 'ignore' as const,
} as const;

export const TTS_LANGUAGES = {
  ITALIAN: 'it-IT',
  SINHALA: 'si-LK',
  ENGLISH: 'en-US',
} as const;

export type TTSLanguage = typeof TTS_LANGUAGES[keyof typeof TTS_LANGUAGES];
