import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import PrivateRoute from '@/components/PrivateRoute';
import { View } from 'react-native';

// Keep the splash screen visible until we're ready to render
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Prepare the app (you could do more async work here like loading fonts)
    async function prepare() {
      try {
        // Artificially delay to allow the layout to initialize properly
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Don't render until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {/* Wrap all routes with the PrivateRoute component that checks for authentication */}
        <PrivateRoute>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="loginPage" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="SignUp" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="ForgotPassword" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="PhoneAuth" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="GoogleAuth" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="AnonymousAuth" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
        </PrivateRoute>
      </SafeAreaProvider>
    </AuthProvider>
  );
} 