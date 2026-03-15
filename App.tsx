/**
 * Italy Dictionary App
 * Main application component with screen navigation
 * @format
 */

import React, {useMemo} from 'react';
import {StatusBar, StyleSheet, useColorScheme} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const statusBarStyle = useMemo(
    () =>
      (isDarkMode ? 'light-content' : 'dark-content') as
        | 'light-content'
        | 'dark-content',
    [isDarkMode],
  );

  return (
    <>
      <AlertNotificationRoot>
        <Provider store={store}>
          <StatusBar barStyle={statusBarStyle} />
          <AppNavigator />
        </Provider>
      </AlertNotificationRoot>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
