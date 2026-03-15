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
import SecondaryButton from '../components/SecondaryButton';
import TermsCheckbox from '../components/TermsCheckbox';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';

const googleIcon = require('../assets/images/google.png');

interface RegisterScreenProps {
  onBackToLogin?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBackToLogin }) => {
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
        onBackToLogin?.();
      }
    } catch (error) {
      console.error('Register error:', error);
      form.setErrors({
        email: 'Registration failed. Please try again.',
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
    <LinearGradient
      colors={[COLORS.backgroundLight, COLORS.backgroundLightAlt]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.header}>Sign up</Text>
            <Text style={styles.subHeader}>Please create a new account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              value={form.state.name}
              onChangeText={handleNameChange}
              error={form.state.errors.name}
              autoCapitalize="words"
            />

            <FormInput
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.state.email}
              onChangeText={handleEmailChange}
              error={form.state.errors.email}
            />

            <FormInput
              label="Password"
              placeholder="Create a password"
              secureTextEntry
              value={form.state.password}
              onChangeText={handlePasswordChange}
              error={form.state.errors.password}
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={form.state.confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              error={form.state.errors.confirmPassword}
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

          {/* Divider */}
          <Text style={styles.divider}>Or</Text>

          {/* Google Sign Up Button */}
          {/* <SecondaryButton
            title="Sign with google"
            onPress={handleGoogleSignUp}
            icon={googleIcon}
            style={styles.googleButton}
          /> */}

          {/* Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Do you have an account?</Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerSection: {
    marginBottom: SPACING.xl,
  },
  header: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  subHeader: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  signButton: {
    marginTop: SPACING.xl,
  },
  divider: {
    textAlign: 'center',
    marginVertical: SPACING.lg,
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.md,
  },
  googleButton: {
    marginBottom: SPACING.xl,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
