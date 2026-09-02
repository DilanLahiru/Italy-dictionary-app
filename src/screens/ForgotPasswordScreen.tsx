/**
 * ForgotPasswordScreen Component
 * Lets a user request a password reset code sent to their email
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import { validateEmail } from '../utils/validation';
import { authAPI } from '../services/apiService';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const logoImage = require('../assets/images/logo.png');

interface ForgotPasswordScreenProps {
  onBackToLogin?: () => void;
  onCodeSent?: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin, onCodeSent }) => {
  const form = useForgotPasswordForm();

  const handleEmailChange = (email: string) => {
    form.setEmail(email);
    const error = validateEmail(email);
    if (error) {
      form.setErrors({ email: error });
    }
  };

  const handleSendCode = async () => {
    const emailError = validateEmail(form.state.email);
    if (emailError) {
      form.setErrors({ email: emailError });
      return;
    }

    form.setIsLoading(true);
    try {
      await authAPI.forgotPassword(form.state.email);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Check your email',
        textBody: 'We sent you a password reset code.',
      });
      const email = form.state.email;
      form.resetForm();
      onCodeSent?.(email);
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Request Failed',
        textBody: 'Could not send the reset code. Please check the email and try again.',
      });
    } finally {
      form.setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroPatternCircleLarge} />
        <View style={styles.heroPatternCircleSmall} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.heroTitle}>Forgot Password? 🔑</Text>
            <Text style={styles.heroSubtitle}>Enter your email to receive a reset code</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.formSection}>
            <FormInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.state.email}
              onChangeText={handleEmailChange}
              error={form.state.errors.email}
              icon={
                <View style={[styles.inputIconBadge, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={styles.inputIconText}>📧</Text>
                </View>
              }
            />

            <PrimaryButton
              title="Send Reset Code"
              onPress={handleSendCode}
              loading={form.state.isLoading}
              disabled={!form.isFormValid() || form.state.isLoading}
            />
          </View>

          <View style={styles.backRow}>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.backLink}>Back to Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  heroGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroPatternCircleLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -40,
  },
  heroPatternCircleSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -20,
    left: -20,
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.backgroundWhite,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  formCard: {
    backgroundColor: COLORS.backgroundWhite,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.EXTRA_LARGE,
    padding: SPACING.xl,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  inputIconBadge: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIconText: {
    fontSize: FONT_SIZES.sm,
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  backLink: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: FONT_SIZES.md,
  },
});

export default ForgotPasswordScreen;
