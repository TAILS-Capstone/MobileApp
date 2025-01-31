import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

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
      <ScrollView>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#29294d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row', // Add horizontal layout
    alignItems: 'center', // Center items vertically
  },
  image: {
    width: 100, // Reduced width
    height: 75, // Reduced height
    borderRadius: 10,
    marginRight: 15, // Add spacing between image and text
  },
  textContainer: {
    flex: 1, // Take remaining space
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5, // Add spacing between text lines
  },
});