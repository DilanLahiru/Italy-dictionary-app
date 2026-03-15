/**
 * AppVersionScreen Component
 * Displays detailed app version information
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

interface AppVersionScreenProps {
  /** Callback when back button is pressed */
  onBack?: () => void;
}

const APP_VERSION = '1.0.1';
const RELEASE_DATE = 'January 29, 2026';

/**
 * AppVersionScreen Component
 * Displays application version details, build information, and release notes
 *
 * @component
 * @example
 * return (
 *   <AppVersionScreen
 *     onBack={() => navigation.goBack()}
 *   />
 * )
 */
const AppVersionScreen: React.FC<AppVersionScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Version</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Version Info Card */}
        <View style={styles.versionCard}>
          <Text style={styles.versionLabel}>Current Version</Text>
          <Text style={styles.versionNumber}>{APP_VERSION}</Text>
        </View>

        {/* Release Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Release Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Release Date</Text>
            <Text style={styles.infoValue}>{RELEASE_DATE}</Text>
          </View>
        </View>

        {/* What's New */}
        {/* <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>What's New in v{APP_VERSION}</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>New app version system with detailed information display</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Improved Settings screen with version information</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Enhanced user interface and navigation</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Bug fixes and performance improvements</Text>
          </View>
        </View> */}

        {/* About App */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About ItalyGo Dictionary</Text>
          <Text style={styles.aboutText}>
            Italy English Sinhala Dictionary is a comprehensive mobile application designed to help users learn and explore Italian vocabulary with ease. The app features a rich collection of words, phrases, and their translations along with pronunciation guidance.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

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
  versionCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.LARGE,
    paddingVertical: SPACING.XXXL,
    paddingHorizontal: SPACING.LARGE,
    alignItems: 'center',
    marginBottom: SPACING.XXXL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  versionLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    marginBottom: SPACING.SMALL,
  },
  versionNumber: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginBottom: SPACING.SMALL,
  },
  versionSubtext: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.backgroundWhite,
    opacity: 0.9,
  },
  infoSection: {
    marginBottom: SPACING.XXXL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginBottom: SPACING.MEDIUM,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
  infoValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginBottom: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.BOLD,
    marginRight: SPACING.MEDIUM,
    marginTop: -2,
  },
  featureText: {
    flex: 1,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  aboutText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    lineHeight: 24,
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'justify',
  },
  footerInfo: {
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: SPACING.LARGE,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.LARGE,
  },
  footerLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    textTransform: 'uppercase',
    marginBottom: SPACING.SMALL / 2,
  },
  footerValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
});

export default AppVersionScreen;
