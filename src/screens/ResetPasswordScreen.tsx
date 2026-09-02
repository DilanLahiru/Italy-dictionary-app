/**
 * ResetPasswordScreen Component
 * Lets a user enter the reset code from their email and set a new password
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
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import { validatePassword, validatePasswordMatch, validateResetCode } from '../utils/validation';
import { authAPI } from '../services/apiService';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const logoImage = require('../assets/images/logo.png');

interface ResetPasswordScreenProps {
  email?: string;
  onBackToLogin?: () => void;
  onPasswordUpdated?: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ email, onBackToLogin, onPasswordUpdated }) => {
  const form = useResetPasswordForm();

  const handleCodeChange = (code: string) => {
    form.setCode(code);
    const error = validateResetCode(code);
    if (error) {
      form.setErrors({ code: error });
    }
  };

  const handlePasswordChange = (password: string) => {
    form.setPassword(password);
    const error = validatePassword(password);
    if (error) {
      form.setErrors({ password: error });
    }
    if (form.state.confirmPassword) {
      const matchError = validatePasswordMatch(password, form.state.confirmPassword);
      form.setErrors({ confirmPassword: matchError });
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    form.setConfirmPassword(confirmPassword);
    const matchError = validatePasswordMatch(form.state.password, confirmPassword);
    if (matchError) {
      form.setErrors({ confirmPassword: matchError });
    }
  };

  const handleResetPassword = async () => {
    const codeError = validateResetCode(form.state.code);
    const passwordError = validatePassword(form.state.password);
    const confirmPasswordError = validatePasswordMatch(form.state.password, form.state.confirmPassword);

    if (codeError || passwordError || confirmPasswordError) {
      form.setErrors({
        code: codeError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    form.setIsLoading(true);
    try {
      await authAPI.resetPassword(form.state.code, form.state.password, form.state.confirmPassword);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Password Updated',
        textBody: 'Your password has been updated. Please sign in.',
      });
      form.resetForm();
      onPasswordUpdated?.();
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Reset Failed',
        textBody: 'Could not update your password. Please check the code and try again.',
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
            <Text style={styles.heroTitle}>Reset Password 🔒</Text>
            <Text style={styles.heroSubtitle}>
              {email ? `Enter the code sent to ${email}` : 'Enter the code from your email and set a new password'}
            </Text>
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
              label="Reset Code"
              placeholder="Enter the code from your email"
              autoCapitalize="none"
              value={form.state.code}
              onChangeText={handleCodeChange}
              error={form.state.errors.code}
              icon={
                <View style={[styles.inputIconBadge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.inputIconText}>🔢</Text>
                </View>
              }
            />

            <FormInput
              label="New Password"
              placeholder="Enter a new password"
              secureTextEntry
              value={form.state.password}
              onChangeText={handlePasswordChange}
              error={form.state.errors.password}
              containerStyle={{ marginTop: SPACING.lg }}
              icon={
                <View style={[styles.inputIconBadge, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={styles.inputIconText}>🔒</Text>
                </View>
              }
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm your new password"
              secureTextEntry
              value={form.state.confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={form.state.errors.confirmPassword}
              containerStyle={{ marginTop: SPACING.lg }}
              icon={
                <View style={[styles.inputIconBadge, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={styles.inputIconText}>🔒</Text>
                </View>
              }
            />

            <PrimaryButton
              title="Update Password"
              onPress={handleResetPassword}
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

export default ResetPasswordScreen;
