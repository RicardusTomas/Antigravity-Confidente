import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import { useStore } from './src/store/useStore';

function AppContent() {
  const { isLoggedIn, currentUser } = useStore();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (currentUser?.isNewUser && !currentUser.hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={() => {}} />;
  }

  return <AppNavigator />;
}

export default function App() {
  const darkMode = useStore((s) => s.darkMode);
  const loadPersistedData = useStore((s) => s.loadPersistedData);
  const isLoading = useStore((s) => s.isLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadPersistedData();
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C6F9B" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7C6F9B',
    fontWeight: '500',
  },
});
