/**
 * App Navigator
 * Handles navigation between all screens
 */

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import HouseCategoryScreen from '../screens/HouseCategoryScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import SubcategoryWordsScreen from '../screens/SubcategoryWordsScreen';
import AtoZScreen from '../screens/AtoZScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import SupportScreen from '../screens/SupportScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import AppVersionScreen from '../screens/AppVersionScreen';

export type ScreenName =
    'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'atoz'
  | 'house'
  | 'categoryDetail'
  | 'subcategoryWords'
  | 'favorites'
  | 'settings'
  | 'appVersion'
  | 'terms'
  | 'support'
  | 'profile'
  | 'searchResults'
  | 'privacyPolicy';

interface AppNavigatorProps {}

interface NavigationParams {
  searchQuery?: string;
  category?: any;
  subcategory?: any;
  subcategoryName?: string;
  words?: any[];
}

const USER_STORAGE_KEY = 'rememberMe_email';

const AppNavigator: React.FC<AppNavigatorProps> = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [navParams, setNavParams] = useState<NavigationParams>({});

  /**
   * Check if user details exist in AsyncStorage
   */
  const checkUserExists = async (): Promise<boolean> => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      console.log(userData);
      return userData !== null;
    } catch (error) {
      console.error('Error checking user data:', error);
      return false;
    }
  };

  /**
   * Show splash screen and check for existing user
   */
  useEffect(() => {
    const initializeApp = async () => {
      // First show splash screen for minimum time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user exists in storage
      const userExists = await checkUserExists();
      
      // Navigate based on user existence
      if (userExists) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('welcome');
      }
      
      setIsCheckingUser(false);
    };

    initializeApp();
  }, []);

  // Show splash screen while checking user
  if (isCheckingUser) {
    return <SplashScreen onFinish={() => {}} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => {
          // This shouldn't normally be called since we handle splash internally
          // but kept for compatibility
          const checkAndNavigate = async () => {
            const userExists = await checkUserExists();
            setCurrentScreen(userExists ? 'home' : 'welcome');
          };
          checkAndNavigate();
        }} />;
      case 'welcome':
        return <WelcomeScreen onGetStart={() => setCurrentScreen('login')} />;
      case 'login':
        return (
          <LoginScreen
            onCreateAccount={() => setCurrentScreen('register')}
            onSignIn={() => setCurrentScreen('home')}
          />
        );
      case 'register':
        return <RegisterScreen onBackToLogin={() => setCurrentScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            onOpenAZ={() => setCurrentScreen('atoz')}
            onOpenHouse={() => setCurrentScreen('house')}
            onOpenCategoryDetail={(category) => {
              setNavParams({ 
                ...navParams,
                category,
              });
              setCurrentScreen('categoryDetail');
            }}
            onOpenFavorites={() => setCurrentScreen('favorites')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenProfile={() => setCurrentScreen('profile')}
            onOpenSearchResults={(query) => {
              setNavParams({ searchQuery: query });
              setCurrentScreen('searchResults');
            }}
          />
        );
      case 'house':
        return <HouseCategoryScreen onBack={() => setCurrentScreen('home')} />;
      case 'categoryDetail':
        return (
          <CategoryDetailScreen
            category={navParams.category || {}}
            onBack={() => setCurrentScreen('home')}
            onOpenSubcategoryWords={(subcategory) => {
              setNavParams({ 
                ...navParams,
                subcategory,
              });
              setCurrentScreen('subcategoryWords');
            }}
            onOpenHome={() => setCurrentScreen('home')}
            onOpenFavorites={() => setCurrentScreen('favorites')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'subcategoryWords':
        return (
          <SubcategoryWordsScreen
            subcategory={navParams.subcategory || {}}
            onBack={() => setCurrentScreen('categoryDetail')}
            onOpenHome={() => setCurrentScreen('home')}
            onOpenFavorites={() => setCurrentScreen('favorites')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen
            onOpenHome={() => setCurrentScreen('home')}
            onOpenSettings={() => setCurrentScreen('settings')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('home')}
            onOpenHome={() => setCurrentScreen('home')}
            onOpenFavorites={() => setCurrentScreen('favorites')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenProfile={() => setCurrentScreen('profile')}
            onOpenPrivacy={() => setCurrentScreen('privacyPolicy')}
            onOpenSupport={() => setCurrentScreen('support')}
            onOpenTerms={() => setCurrentScreen('terms')}
            onOpenAppVersion={() => setCurrentScreen('appVersion')}
            onLogout={() => setCurrentScreen('splash')}
          />
        );
      case 'appVersion':
        return <AppVersionScreen onBack={() => setCurrentScreen('settings')} />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen  onBack={() => setCurrentScreen('settings')} />;
      case 'terms':
        return <TermsAndConditionsScreen onBack={() => setCurrentScreen('settings')} />;
      case 'support':
        return <SupportScreen onBack={() => setCurrentScreen('settings')} />;
      case 'profile':
        return <UserProfileScreen onBack={() => setCurrentScreen('home')} onLogout={() => {
          // Clear user data and navigate to welcome
          AsyncStorage.removeItem('rememberMe_email');
          setCurrentScreen('welcome');
        }} />;
      case 'atoz':
        return <AtoZScreen onBack={() => setCurrentScreen('home')} />;
      case 'searchResults':
        return (
          <SearchResultsScreen
            searchQuery={navParams.searchQuery || ''}
            onBack={() => {
              setNavParams({});
              setCurrentScreen('home');
            }}
          />
        );
      default:
        return <WelcomeScreen onGetStart={() => setCurrentScreen('login')} />;
    }
  };

  return renderScreen();
};

export default AppNavigator;