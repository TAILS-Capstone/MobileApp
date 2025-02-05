import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Map from '../../components/Map';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Carte</Text>
        <Map />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a3b', // Couleur principale de fond,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#f5f5f5',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#f5f5f5',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});