import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

const App: React.FC = () => {
  const { refreshUserData } = useAuthStore();

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Refresh user data if authenticated
        await refreshUserData();
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };

    initializeApp();
  }, [refreshUserData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background.primary}
      />
      <RootNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});

export default App;
