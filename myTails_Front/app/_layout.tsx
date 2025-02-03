import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pages principales */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Nouvelle page Login */}
        <Stack.Screen name="loginPage" options={{ title: 'Login' }} />

        {/* Carte */}
        <Stack.Screen name="(tabs)/map" options={{ title: 'Map' }} />

        {/* Historique */}
        <Stack.Screen name="(tabs)/history" options={{ title: 'History' }} />

        {/* Paramètres */}
        <Stack.Screen name="(tabs)/settings" options={{ title: 'Settings' }} />

        {/* Page de sécurité */}
        <Stack.Screen name="security" options={{ title: 'Security' }} />

        {/* Écran pour les erreurs */}
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack>

      {/* Configuration de la barre d'état */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
