/**
 * LoginScreen Component
 * User login screen with email/password authentication
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../features/user/userSlice';
import { useLoginForm } from '../hooks/useLoginForm';
import { validateEmail, validatePassword } from '../utils/validation';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const googleIcon = require('../assets/images/google.png');

interface LoginScreenProps {
  onCreateAccount?: () => void;
  onSignIn?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onCreateAccount, onSignIn }) => {
  const dispatch = useAppDispatch();
  const form = useLoginForm();

  // Load saved credentials on component mount if available
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberMe_email');
        const savedPassword = await AsyncStorage.getItem('rememberMe_password');
        
        if (savedEmail && savedPassword) {
          form.setEmail(savedEmail);
          form.setPassword(savedPassword);
          form.setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error);
      }
    };
    
    loadSavedCredentials();
  }, []);

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

  const handleLogin = async () => {
    // Validate before submitting
    const emailError = validateEmail(form.state.email);
    const passwordError = validatePassword(form.state.password);

    if (emailError || passwordError) {
      form.setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    form.setIsLoading(true);
    try {
      const result = await dispatch(
        loginUser({
          identifier: form.state.email,
          password: form.state.password,
        })
      );

      if (result.type === loginUser.fulfilled.type) {
        // Save credentials to AsyncStorage only if Remember Me is enabled
        if (form.state.rememberMe) {
          try {
            await AsyncStorage.setItem('rememberMe_email', form.state.email);
            await AsyncStorage.setItem('rememberMe_password', form.state.password);
          } catch (storageError) {
            console.error('Error saving credentials to AsyncStorage:', storageError);
          }
        } else {
          // Clear saved credentials if Remember Me is disabled
          try {
            await AsyncStorage.removeItem('rememberMe_email');
            await AsyncStorage.removeItem('rememberMe_password');
          } catch (storageError) {
            console.error('Error clearing saved credentials:', storageError);
          }
        }
        
        form.resetForm();
        onSignIn?.();
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Login failed. Please try again.',
        button: 'OK',
      });
    } finally {
      form.setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    console.log('Google sign-in not implemented yet');
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log('Forgot password not implemented yet');
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
            <Text style={styles.header}>Sign in</Text>
            <Text style={styles.subHeader}>Please log in into your account</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
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
              placeholder="Password"
              secureTextEntry
              value={form.state.password}
              onChangeText={handlePasswordChange}
              error={form.state.errors.password}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberRow}>
                <Switch
                  value={form.state.rememberMe}
                  onValueChange={form.setRememberMe}
                  thumbColor={form.state.rememberMe ? COLORS.primary : COLORS.textMuted}
                />
                <Text style={styles.rememberText}>Remember Me</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <PrimaryButton
              title="Sign in"
              onPress={handleLogin}
              loading={form.state.isLoading}
              disabled={!form.isFormValid() || form.state.isLoading}
            />
          </View>

          {/* Divider */}
          <Text style={styles.divider}>Or</Text>

          {/* Google Sign In Button */}
          {/* <SecondaryButton
            title="Sign with google"
            onPress={handleGoogleSignIn}
            icon={googleIcon}
            style={styles.googleButton}
          /> */}

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>New customer?</Text>
            <TouchableOpacity onPress={onCreateAccount}>
              <Text style={styles.signUpLink}>Create new account</Text>
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: SPACING.sm,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  forgot: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
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
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  signUpText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  signUpLink: {
    color: COLORS.textDark,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen;
