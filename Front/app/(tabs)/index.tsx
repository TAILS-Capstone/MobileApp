import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import "expo-router/entry";

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/loginPage'); // Redirect to the login page
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup to prevent memory leak
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
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: Math.max(width * 0.12, 32), // Ensures large, readable title
    color: '#00ffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.max(width * 0.045, 14), // Scales properly on small screens
    color: '#00ffff',
    marginTop: height * 0.02,
    textAlign: 'center',
    paddingHorizontal: width * 0.1, // Prevents text cutoff
  },
});

export default SplashScreen;
