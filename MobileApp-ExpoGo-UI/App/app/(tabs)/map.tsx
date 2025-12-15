import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Map from '../../components/Map/Map';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const { width, height } = Dimensions.get('window');

// Use satellite image as background for map screen - matches with theme
const backgroundImage = require('@/assets/images/satellite_view.jpg');

export default function MapScreen() {
  return (
    <AnimatedBackground 
      backgroundImage={backgroundImage}
      overlayColors={['rgba(10, 10, 30, 0.6)', 'rgba(15, 15, 45, 0.5)', 'rgba(20, 20, 60, 0.4)']}
      enableRotation={true}
      enableVerticalMovement={true}
      showCirclePatterns={true}
    >
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map />
        </View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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

