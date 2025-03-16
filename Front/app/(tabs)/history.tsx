import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    <View style={styles.container}>
      <Text style={styles.title}>Historique des vols</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {flightHistory.map((flight) => (
          <View key={flight.id} style={styles.card}>
            <Image source={flight.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>📍 {flight.location}</Text>
              <Text style={styles.text}>⏰ {flight.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3b',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  scrollContent: {
    paddingBottom: height * 0.05, // Prevents cutoff on small screens
  },
  title: {
    fontSize: Math.max(width * 0.06, 22),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  card: {
    backgroundColor: '#29294d',
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
  text: {
    color: '#fff',
    fontSize: Math.max(width * 0.045, 14),
    marginBottom: height * 0.005,
  },
});

export default HistoryScreen;
