/**
 * SplashScreen Component
 * Displays branding and loading state during app initialization
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  useWindowDimensions,
  AccessibilityInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// ============================================================================
// CONSTANTS
// ============================================================================

const LOGO_IMAGE = require('../assets/images/logo.png');

const GRADIENT_COLORS = ['#FFF6E5', '#E3F2FD'] as const;
const BRAND_NAME = 'Italian';
const BRAND_TAGLINE = 'WITH UMA';

const screenWidth = Dimensions.get('window').width;
const isSmallDevice = screenWidth < 375;
const isTablet = screenWidth >= 768;

/**
 * Responsive scaling function based on screen width
 */
const responsiveScale = (baseValue: number): number => {
  const scale = screenWidth / 375;
  return Math.round(baseValue * scale);
};

// ============================================================================
// TYPES
// ============================================================================

interface SplashScreenProps {
  onFinish?: () => void;
}

// ============================================================================
// RESPONSIVE STYLES CONFIGURATION
// ============================================================================

const getResponsiveStyles = () => {
  const logoSize = isTablet ? 250 : isSmallDevice ? 140 : 180;
  const titleSize = isTablet ? 48 : isSmallDevice ? 28 : 38;
  const subtitleSize = isTablet ? 20 : isSmallDevice ? 13 : 16;
  const marginBottom = responsiveScale(20);
  const marginTop = isTablet ? 80 : isSmallDevice ? 60 : 120;

  return {
    logoSize,
    titleSize,
    subtitleSize,
    marginBottom,
    marginTop,
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * SplashScreen Component
 * Displays app branding with animated fade-in effect
 * Calls onFinish callback when animation completes
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { width: deviceWidth } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const responsiveStyles = getResponsiveStyles();

  /**
   * Initialize animations on component mount
   */
  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Call callback after splash duration
    const splashTimer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <LinearGradient
      colors={['#FFF6E5', '#E3F2FD']}
      style={styles.container}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`${BRAND_NAME} ${BRAND_TAGLINE} - Loading`}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            marginTop: responsiveStyles.marginTop,
          },
        ]}
        accessible={true}
        accessibilityLabel="App Logo">
        <Image
          source={LOGO_IMAGE}
          style={[
            styles.logo,
            {
              width: responsiveStyles.logoSize,
              height: responsiveStyles.logoSize,
              marginBottom: responsiveStyles.marginBottom,
            },
          ]}
          resizeMode="contain"
          accessibilityLabel="Italian Dictionary App Logo"
        />
      </Animated.View>
    </LinearGradient>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
  title: {
    color: '#2986F5',
    fontWeight: '400',
    fontFamily: 'serif',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: '#F5B942',
    fontWeight: '700',
    marginTop: responsiveScale(2),
    textAlign: 'center',
  },
});

export default SplashScreen;
