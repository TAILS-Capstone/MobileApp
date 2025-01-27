import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import { MapProps } from './types';

export default function MapNative({}: MapProps) {
  return (
    <MapView 
      style={styles.map}
      initialRegion={{
        latitude: 45.4215,  // Ottawa coordinates
        longitude: -75.6972,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 10,
  }
});