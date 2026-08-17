/**
 * SettingsScreen Component
 * Displays application settings and user options
 */

import React, { useCallback, useEffect, useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
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
  badgeColor: string;
}

const FavoritePng = require('../assets/images/favorite.png');
const AccountPng = require('../assets/images/account.png');
const NotificationPng = require('../assets/images/notification.png');
const DictionaryPng = require('../assets/images/dictionary.png');
const BookPng = require('../assets/images/book.png');

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
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user?.username || user?.name || 'Guest User');
          setUserEmail(user?.email || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const userInitial = userName.trim().charAt(0)?.toUpperCase() || 'U';

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
   * Settings menu grouped into sections
   */
  const accountItems: SettingItem[] = [
    {
      id: 'notifications',
      label: 'Notification',
      icon: NotificationPng,
      badgeColor: '#FFF3E0',
      onPress: handleOpenNotifications,
    },
  ];

  const aboutItems: SettingItem[] = [
    {
      id: 'app-version',
      label: 'App Version',
      icon: DictionaryPng,
      badgeColor: '#E8F5E9',
      onPress: () => onOpenAppVersion?.(),
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: BookPng,
      badgeColor: '#F3E5F5',
      onPress: () => onOpenPrivacy?.(),
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      icon: BookPng,
      badgeColor: '#FCE4EC',
      onPress: () => onOpenTerms?.(),
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: FavoritePng,
      badgeColor: '#E0F7FA',
      onPress: () => onOpenSupport?.(),
    },
  ];

  /**
   * Render a settings menu item
   */
  const renderSettingItem = (item: SettingItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <View style={[styles.iconBadge, {backgroundColor: item.badgeColor}]}>
        <Image source={item.icon} style={styles.settingIcon} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingText}>{item.label}</Text>
        {item.version && <Text style={styles.versionText}>{item.version}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: SettingItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => renderSettingItem(item, index === items.length - 1))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}
      >
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

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
            {!!userEmail && (
              <Text style={styles.profileEmail} numberOfLines={1}>{userEmail}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            activeOpacity={0.7}
            onPress={handleOpenProfile}
          >
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('Account', accountItems)}
        {renderSection('About & Support', aboutItems)}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconBadge}>
            <Text style={styles.logoutIcon}>⎋</Text>
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
          <Text style={styles.logoutChevron}>›</Text>
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
  headerGradient: {
    paddingBottom: SPACING.XXL,
    borderBottomLeftRadius: BORDER_RADIUS.LARGE,
    borderBottomRightRadius: BORDER_RADIUS.LARGE,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.LARGE,
    paddingBottom: SPACING.XXXL,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
  },
  backButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(255,255,255,0.16)',
  },
  backText: {
    fontSize: 45,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginTop: -8,
  },
  headerTitle: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginTop: 15,
  },
  headerSpacer: {
    width: 36,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.LARGE,
    marginTop: SPACING.SMALL,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: BORDER_RADIUS.LARGE,
    padding: SPACING.MEDIUM,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.EXTRA_BOLD,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.MEDIUM,
  },
  profileName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  profileEmail: {
    fontSize: FONT_SIZES.SMALL,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  editProfileButton: {
    paddingVertical: SPACING.SMALL / 2,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  editProfileText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
  section: {
    marginBottom: SPACING.XXL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.SMALL,
    marginLeft: SPACING.EXTRA_SMALL,
  },
  sectionCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.LARGE,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingRow: {
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIcon: {
    width: 20,
    height: 20,
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
    marginTop: SPACING.SMALL,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244,67,54,0.08)',
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.LARGE,
    borderWidth: 1.5,
    borderColor: 'rgba(244,67,54,0.25)',
  },
  logoutIconBadge: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  logoutText: {
    flex: 1,
    marginLeft: SPACING.MEDIUM,
    color: COLORS.error,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: FONT_SIZES.MEDIUM,
  },
  logoutChevron: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.error,
  },
});

export default SettingsScreen;
