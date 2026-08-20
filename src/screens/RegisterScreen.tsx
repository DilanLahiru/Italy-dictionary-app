/**
 * RegisterScreen Component
 * User registration screen with validation
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch } from '../store/hooks';
import { RegisterUser } from '../features/user/userSlice';
import { useRegisterForm } from '../hooks/useRegisterForm';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePasswordMatch,
} from '../utils/validation';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import TermsCheckbox from '../components/TermsCheckbox';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

const logoImage = require('../assets/images/logo.png');

interface RegisterScreenProps {
  onBackToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBackToLogin, onRegisterSuccess }) => {
  const dispatch = useAppDispatch();
  const form = useRegisterForm();

  const handleNameChange = (name: string) => {
    form.setName(name);
    const error = validateName(name);
    if (error) {
      form.setErrors({ name: error });
    }
  };

  const handleEmailChange = (email: string) => {
    form.setEmail(email);
    const error = validateEmail(email);
    if (error) {
      form.setErrors({ email: error });
    }
  };

  const handlePasswordChange = (password: string) => {
    form.setPassword(password);
    const error = validatePassword(password);
    if (error) {
      form.setErrors({ password: error });
    }
    // Re-check confirm password match whenever the password itself changes
    if (form.state.confirmPassword) {
      const matchError = validatePasswordMatch(password, form.state.confirmPassword);
      form.setErrors({ confirmPassword: matchError });
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    form.setConfirmPassword(confirmPassword);
    const passwordMatchError = validatePasswordMatch(form.state.password, confirmPassword);
    if (passwordMatchError) {
      form.setErrors({ confirmPassword: passwordMatchError });
    }
  };

  const handleRegister = async () => {
    // Validate all fields
    const nameError = validateName(form.state.name);
    const emailError = validateEmail(form.state.email);
    const passwordError = validatePassword(form.state.password);
    const confirmPasswordError = validatePasswordMatch(
      form.state.password,
      form.state.confirmPassword
    );
    const termsError = !form.state.agreedToTerms ? 'You must agree to the terms' : undefined;

    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      termsError
    ) {
      form.setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        terms: termsError,
      });
      return;
    }

    form.setIsLoading(true);
    try {
      const result = await dispatch(
        RegisterUser({
          username: form.state.name,
          email: form.state.email,
          password: form.state.password,
        })
      );

      if (result.type === RegisterUser.fulfilled.type) {
        form.resetForm();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Registration Successful',
          textBody: 'You are now registered.',
        });
        onRegisterSuccess?.();
      } else {
        const message =
          typeof result.payload === 'string'
            ? result.payload
            : 'Could not create your account. Please check your details and try again.';
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Registration Failed',
          textBody: message,
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Registration Failed',
        textBody: 'Something went wrong while creating your account. Please try again.',
      });
    } finally {
      form.setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google Sign-Up
    console.log('Google sign-up not implemented yet');
  };

  const handleTermsPress = () => {
    // TODO: Navigate to terms of use screen
    console.log('Terms of use not implemented yet');
  };

  const handlePrivacyPress = () => {
    // TODO: Navigate to privacy policy screen
    console.log('Privacy policy not implemented yet');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1565C0', '#1D5FE5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.heroGradient}
      >
        <View style={styles.heroPatternCircleLarge} />
        <View style={styles.heroPatternCircleSmall} />
        <SafeAreaView>
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.heroTitle}>Create Account ✨</Text>
            <Text style={styles.heroSubtitle}>Start your Italian learning journey</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          {/* Form Section */}
          <View style={styles.formSection}>
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              value={form.state.name}
              onChangeText={handleNameChange}
              error={form.state.errors.name}
              autoCapitalize="words"
              icon={
                <View style={[styles.inputIconBadge, {backgroundColor: '#E8F5E9'}]}>
                  <Text style={styles.inputIconText}>👤</Text>
                </View>
              }
            />

            <FormInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.state.email}
              onChangeText={handleEmailChange}
              error={form.state.errors.email}
              containerStyle={{ marginTop: SPACING.lg }}
              icon={
                <View style={[styles.inputIconBadge, {backgroundColor: '#E3F2FD'}]}>
                  <Text style={styles.inputIconText}>📧</Text>
                </View>
              }
            />

            <FormInput
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={form.state.password}
              onChangeText={handlePasswordChange}
              error={form.state.errors.password}
              containerStyle={{ marginTop: SPACING.lg }}
              icon={
                <View style={[styles.inputIconBadge, {backgroundColor: '#FFF3E0'}]}>
                  <Text style={styles.inputIconText}>🔒</Text>
                </View>
              }
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={form.state.confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={form.state.errors.confirmPassword}
              containerStyle={{ marginTop: SPACING.lg }}
              icon={
                <View style={[styles.inputIconBadge, {backgroundColor: '#F3E5F5'}]}>
                  <Text style={styles.inputIconText}>🔑</Text>
                </View>
              }
            />

            {/* Terms Agreement */}
            <TermsCheckbox
              checked={form.state.agreedToTerms}
              onToggle={form.setAgreedToTerms}
              onTermsPress={handleTermsPress}
              onPrivacyPress={handlePrivacyPress}
              error={form.state.errors.terms}
            />

            {/* Sign Up Button */}
            <PrimaryButton
              title="Sign up"
              onPress={handleRegister}
              loading={form.state.isLoading}
              disabled={!form.isFormValid() || form.state.isLoading}
              style={styles.signButton}
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Do you have an account?</Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
  },
  keyboardAvoiding: {
    flex: 1,
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
  signButton: {
    marginTop: SPACING.xl,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  signInText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  signInLink: {
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.xs,
  },
});

export default RegisterScreen;
