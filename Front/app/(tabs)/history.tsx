import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const { width, height } = Dimensions.get('window');

// Use drone image as background
const backgroundImage = require('@/assets/images/drone.png');

const flightHistory = [
  {
    id: '1',
    location: 'Ottawa, Canada',
    time: '2024-01-30 14:00',
    image: require('../../assets/images/drone.png'), // Ensure this image exists in assets
  },
  {
    id: '2',
    location: 'Toronto, Canada',
    time: '2024-01-29 11:30',
    image: require('../../assets/images/drone.png'),
  },
  {
    id: '3',
    location: 'Montreal, Canada',
    time: '2024-01-28 16:45',
    image: require('../../assets/images/drone.png'),
  },
];

export default function HistoryScreen() {
  return (
    <AnimatedBackground 
      backgroundImage={backgroundImage}
      overlayColors={['rgba(18, 18, 40, 0.5)', 'rgba(22, 22, 55, 0.4)', 'rgba(28, 28, 70, 0.3)']}
      enableRotation={true}
      enableVerticalMovement={true}
      showCirclePatterns={true}
    >
      <Text style={styles.title}>Historique des vols</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {flightHistory.map((flight) => (
          <View key={flight.id} style={styles.card}>
            <Image source={flight.image} style={styles.image} />
            <View style={styles.textContainer}>
              <View style={styles.textRow}>
                <Ionicons name="location" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.text}>{flight.location}</Text>
              </View>
              <View style={styles.textRow}>
                <Ionicons name="time" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.text}>{flight.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.05, // Prevents cutoff on small screens
  },
  title: {
    fontSize: Math.max(width * 0.06, 22),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  card: {
    backgroundColor: 'rgba(41, 41, 77, 0.7)',
    padding: height * 0.025,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: width * 0.25, // Dynamic image width
    height: width * 0.18, // Dynamic image height
    borderRadius: width * 0.03,
    marginRight: width * 0.05,
  },
  textContainer: {
    flex: 1,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  icon: {
    marginRight: width * 0.02,
  },
  text: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 14),
  },
});
