/**
 * SettingsScreen Component
 * Displays application settings and user options
 */

import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { HOME_TAB_ITEMS } from '../constants/homeConstants';
import TabBar from '../components/TabBar';
import NotificationModal from './NotificationModal';

/**
 * Props for SettingsScreen component
 */
interface SettingsScreenProps {
  /** Callback when back button is pressed */
  onBack?: () => void;
  /** Callback to open user profile */
  onOpenProfile?: () => void;
  /** Callback to open home screen */
  onOpenHome?: () => void;
  /** Callback to open favorites screen */
  onOpenFavorites?: () => void;
  /** Callback to open settings screen */
  onOpenSettings?: () => void;
  /** Callback to open privacy policy screen */
  onOpenPrivacy?: () => void;
  /** Callback to open support screen */
  onOpenSupport?: () => void;
  /** Callback to open terms & conditions screen */
  onOpenTerms?: () => void;
  /** Callback to open app version screen */
  onOpenAppVersion?: () => void;
  /** Callback when logout is pressed */
  onLogout?: () => void;
}

/**
 * Settings menu item interface
 */
interface SettingItem {
  id: string;
  label: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  version?: string;
}

const HomePng = require('../assets/images/home.png');
const FavoritePng = require('../assets/images/favorite.png');
const SettingsPng = require('../assets/images/setting.png');

/**
 * SettingsScreen Component
 * Main settings interface for application configuration
 *
 * @component
 * @example
 * return (
 *   <SettingsScreen
 *     onBack={() => navigation.goBack()}
 *     onOpenProfile={() => navigation.navigate('Profile')}
 *   />
 * )
 */
const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenProfile,
  onOpenHome,
  onOpenFavorites,
  onOpenSettings,
  onOpenPrivacy,
  onOpenSupport,
  onOpenTerms,
  onOpenAppVersion,
  onLogout,
}) => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  /**
   * Open notifications modal
   */
  const handleOpenNotifications = useCallback(() => {
    setNotificationVisible(true);
  }, []);

  /**
   * Close notifications modal
   */
  const handleCloseNotifications = useCallback(() => {
    setNotificationVisible(false);
  }, []);

  /**
   * Handle tab navigation
   */
  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'home':
        onOpenHome?.();
        break;
      case 'favorites':
        onOpenFavorites?.();
        break;
      case 'settings':
        // Already on settings
        break;
    }
  }, [onOpenHome, onOpenFavorites]);

  /**
   * Handle user profile navigation
   */
  const handleOpenProfile = useCallback(() => {
    onOpenProfile?.();
  }, [onOpenProfile]);

  /**
   * Handle back button press
   */
  const handleBackPress = useCallback(() => {
    onBack?.();
  }, [onBack]);

  /**
   * Handle logout action
   */
  const handleLogout = useCallback(async () => {
    try {
      // Remove rememberMe_email from AsyncStorage
      await AsyncStorage.removeItem('rememberMe_email');
      
      // Remove auth token if present
      await AsyncStorage.removeItem('authToken');
      
      console.log('User logged out successfully');
      
      // Navigate to splash screen
      onLogout?.();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate even if error occurs
      onLogout?.();
    }
  }, [onLogout]);

  /**
   * Settings menu items
   */
  const settingsItems: SettingItem[] = [
    {
      id: 'profile',
      label: 'User Profile',
      icon: FavoritePng,
      onPress: handleOpenProfile,
    },
    {
      id: 'notifications',
      label: 'Notification',
      icon: SettingsPng,
      onPress: handleOpenNotifications,
    },
    {
      id: 'app-version',
      label: 'App Version',
      icon: SettingsPng,
      onPress: () => {
        onOpenAppVersion?.();
      },
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: SettingsPng,
      onPress: () => {
        onOpenPrivacy?.();
      },
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: SettingsPng,
      onPress: () => {
        onOpenTerms?.();
      },
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: SettingsPng,
      onPress: () => {
        onOpenSupport?.();
      },
    },
  ];

  /**
   * Render a settings menu item
   */
  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingRow}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <Image source={item.icon} style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingText}>{item.label}</Text>
        {item.version && <Text style={styles.versionText}>{item.version}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Settings Items */}
        {settingsItems.map(item => renderSettingItem(item))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notification Modal */}
      {notificationVisible && (
        <NotificationModal
          visible={notificationVisible}
          onClose={handleCloseNotifications}
        />
      )}

      {/* Bottom Tab Bar */}
      <TabBar
        items={HOME_TAB_ITEMS}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

/**
 * Styles for SettingsScreen
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.MEDIUM,
    paddingBottom: SPACING.XXXL,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    marginBottom: SPACING.LARGE,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: FONT_SIZES.XXL,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  headerSpacer: {
    width: 36,
  },
  settingRow: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  settingContent: {
    flex: 1,
    marginLeft: SPACING.MEDIUM,
  },
  settingText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
  versionText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.textTertiary,
    marginTop: SPACING.SMALL / 2,
  },
  chevron: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.textTertiary,
  },
  logoutButton: {
    marginTop: SPACING.XXXL,
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: FONT_SIZES.MEDIUM,
  },
});

export default SettingsScreen;
