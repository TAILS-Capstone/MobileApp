import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import "expo-router/entry";
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const { width, height } = Dimensions.get('window');

// Use drone image as background
const backgroundImage = require('@/assets/images/drone.png');

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <AnimatedBackground 
      backgroundImage={backgroundImage}
      overlayColors={['rgba(20, 20, 50, 0.5)', 'rgba(30, 30, 80, 0.4)', 'rgba(40, 40, 100, 0.3)']}
      enableRotation={true}
      enableVerticalMovement={true}
      showCirclePatterns={true}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Title */}
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover TAILS features</Text>

        {/* "View Map" Button */}
        <TouchableOpacity
          onPress={() => router.push('/map')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="location" size={20} color="#fff" /> View Map
          </Text>
        </TouchableOpacity>

        {/* "Flight History" Button */}
        <TouchableOpacity
          onPress={() => router.push('/history')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="stats-chart" size={20} color="#fff" /> Flight History
          </Text>
        </TouchableOpacity>

        {/* "Settings" Button */}
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            <Ionicons name="settings" size={20} color="#fff" /> Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AnimatedBackground>
  );
}

// Styles for the Explore screen
const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.03,
    marginVertical: height * 0.015,
    width: '85%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});