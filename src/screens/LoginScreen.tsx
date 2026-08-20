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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../features/user/userSlice';
import { useLoginForm } from '../hooks/useLoginForm';
import { validateEmail, validatePassword } from '../utils/validation';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../constants/dimensions';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

const googleIcon = require('../assets/images/google.png');
const logoImage = require('../assets/images/logo.png');

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
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Login Successful',
          textBody: 'You are now logged in.',
        });
        form.resetForm();
        onSignIn?.();
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login Failed',
        textBody: 'Something went wrong while logging in. Please try again.',
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
            <Text style={styles.heroTitle}>Welcome Back 👋</Text>
            <Text style={styles.heroSubtitle}>Sign in to keep learning Italian</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
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
              icon={
                <View style={[styles.inputIconBadge, {backgroundColor: '#E3F2FD'}]}>
                  <Text style={styles.inputIconText}>📧</Text>
                </View>
              }
            />

            <FormInput
              label="Password"
              placeholder="Password"
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
          {/* <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View> */}

          {/* Google Sign In Button */}
          {/* <TouchableOpacity
            style={styles.socialCircle}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Image source={googleIcon} style={styles.socialIcon} resizeMode="contain" />
          </TouchableOpacity> */}

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>New customer?</Text>
            <TouchableOpacity onPress={onCreateAccount}>
              <Text style={styles.signUpLink}>Create new account</Text>
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    color: COLORS.textTertiary,
    fontSize: FONT_SIZES.sm,
  },
  socialCircle: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  socialIcon: {
    width: 24,
    height: 24,
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
