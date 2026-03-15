/** Translation object for word in different languages */
export interface Translations {
  Italian?: string;
  English?: string;
  Sinhala?: string;
  [key: string]: string | undefined;
}

/** Base word interface */
export interface Word {
  id: string;
  name: string;
  category: string;
  pronunciation?: string;
  example?: string;
  translations: Translations;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Extended word detail with additional metadata */
export interface WordDetail extends Word {
  Italy_word?: string;
  Sinhala_word?: string;
  English_word?: string;
  image?: string;
  synonyms?: string[];
  antonyms?: string[];
  usageNotes?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/** Props for WordDetailModal component */
export interface WordDetailModalProps {
  visible: boolean;
  word?: string | null;
  details?: WordDetail;
  isFavorite?: boolean;
  onClose?: () => void;
  onToggleFavorite?: (word: string) => void;
  position?: 'center' | 'bottom';
}

/** Position type for modal display */
export type ModalPosition = 'center' | 'bottom';