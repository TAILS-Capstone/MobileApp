import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Map from '../../components/Map';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a3b',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
    paddingTop: height * 0.04,
  },
  title: {
    fontSize: Math.max(width * 0.065, 22), // Dynamic text scaling
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#f5f5f5',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;