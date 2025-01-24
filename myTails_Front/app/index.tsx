import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace('/tabs'); // Naviguer vers les onglets après 3 secondes
    }, 3000);
  }, []);

  return (
    <LinearGradient
      colors={['#3a007d', '#230085', '#0047a0']}
      style={styles.container}
    >
      <Text style={styles.title}>T.A.I.L.S</Text>
      <Text style={styles.subtitle}>
        TACTICAL AERIAL INSIGHT AND LOCALIZATION SUITE
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: '#00ffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#00ffff',
    marginTop: 10,
    textAlign: 'center',
  },
});
