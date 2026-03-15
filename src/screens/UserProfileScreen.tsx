import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUserPassword } from '../features/user/userSlice';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const avatar = require('../assets/images/logo.png');

type Props = {
  onBack?: () => void;
  onLogout?: () => void;
};

export default function UserProfileScreen({onBack, onLogout}: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleLoadUserData();
  }, []);

  const handleLoadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log(userData);
      if (userData) {
        const user = JSON.parse(userData);
        setName(user.username);
        setEmail(user.email);
      }
    } catch (error) {
      console.error('Error during user profile update:', error);
    }
  };

  const validatePasswordForm = (): boolean => {
    if (!currentPassword.trim()) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter your current password',
        button: 'OK',
      });
      return false;
    }
    if (!password.trim()) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter your new password',
        button: 'OK',
      });
      return false;
    }
    if (!passwordConfirmation.trim()) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please confirm your new password',
        button: 'OK',
      });
      return false;
    }
    if (password.length < 6) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Password must be at least 6 characters long',
        button: 'OK',
      });
      return false;
    }
    if (password !== passwordConfirmation) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Passwords do not match',
        button: 'OK',
      });
      return false;
    }
    if (currentPassword === password) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'New password must be different from current password',
        button: 'OK',
      });
      return false;
    }
    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(updateUserPassword({
        currentPassword,
        password,
        passwordConfirmation,
      })).unwrap();
      console.log('Password update response:', response);
      
      // Clear user data and logout
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('rememberMe_email');
      
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Password updated successfully. You will be logged out.',
        button: 'OK',
        onPressButton: () => {
          // autoclose dialog
          Dialog.hide();
          // Navigate to welcome screen
          if (onLogout) {
            onLogout();
          }
        },
      });
    } catch (error: any) {
      console.log('Error updating password:', error);
      const errorMessage = error?.message || 'Failed to update password. Please try again.';
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: errorMessage,
        button: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F7FBFF', '#E3F2FD']} style={{flex: 1}}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>User Profile</Text>
            <View style={{width: 36}} />
          </View>

          <View style={{alignItems: 'center', marginTop: 20}}>
            <Image source={avatar} style={styles.avatar} />
          </View>

          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            secureTextEntry
            editable={!loading}
            placeholder="Enter your current password"
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            editable={!loading}
            placeholder="Enter your new password"
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            style={styles.input}
            secureTextEntry
            editable={!loading}
            placeholder="Confirm your new password"
          />

          <TouchableOpacity
            style={[styles.updateBtn, loading && styles.updateBtnDisabled]}
            onPress={handleUpdatePassword}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1},
  container: {paddingHorizontal: 18, paddingBottom: 40},
  headerRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  backBtn: {width: 36, height: 36, justifyContent: 'center'},
  backText: {fontSize: 28, color: '#2D79D6'},
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: '#1565C0',
    fontWeight: '700',
  },
  avatar: {width: 96, height: 96, borderRadius: 48, marginBottom: 18},
  label: {color: '#444', marginTop: 12, marginBottom: 6},
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 2,
  },
  updateBtn: {
    marginTop: 24,
    backgroundColor: '#2D79D6',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  updateBtnDisabled: {
    backgroundColor: '#a0a0a0',
  },
  updateText: {color: '#fff', fontWeight: '700'},
});
