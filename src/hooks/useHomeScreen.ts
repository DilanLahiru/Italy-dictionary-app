/**
 * Custom hook for home screen state management
 */

import { useState, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { searchWords } from '../features/words/wordSlice';

interface UseHomeScreenReturn {
  notificationVisible: boolean;
  openNotification: () => void;
  closeNotification: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  onSearchResults?: (query: string) => void;
}

export const useHomeScreen = (onSearchResults?: (query: string) => void): UseHomeScreenReturn => {
  const dispatch = useAppDispatch();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Italy');
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isSearching, setIsSearching] = useState(false);

  const openNotification = useCallback(() => {
    setNotificationVisible(true);
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationVisible(false);
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmedText = searchText.trim();
    console.log('====================================');
    console.log("searchText", trimmedText);
    console.log('====================================');
    if (trimmedText) {
      setIsSearching(true);
      try {
        console.log('Searching for:', trimmedText, 'in', selectedLanguage);
        await dispatch(searchWords({ query: trimmedText, language: selectedLanguage }));
        // Call callback to navigate to search results screen
        onSearchResults?.(trimmedText);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }
  }, [searchText, selectedLanguage, dispatch, onSearchResults]);

  return {
    notificationVisible,
    openNotification,
    closeNotification,
    selectedLanguage,
    setSelectedLanguage,
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    handleSearch,
    isSearching,
    onSearchResults,
  };
};

