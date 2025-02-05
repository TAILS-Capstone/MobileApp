import React, { useState } from 'react';
import MapView, { Polygon } from 'react-native-maps';
import { StyleSheet, Dimensions, View, TextInput, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function MapNative() {
  const [latitude, setLatitude] = useState('45.4215'); // Default Ottawa
  const [longitude, setLongitude] = useState('-75.6972'); // Default Ottawa
  const [latitudeDelta, setLatitudeDelta] = useState('0.03');
  const [longitudeDelta, setLongitudeDelta] = useState('0.04');

  const handleCoordinateChange = (type, value) => {
    const formattedValue = value.replace(',', '.');
    if (type === 'latitude') setLatitude(formattedValue);
    if (type === 'longitude') setLongitude(formattedValue);
    if (type === 'latitudeDelta') setLatitudeDelta(formattedValue);
    if (type === 'longitudeDelta') setLongitudeDelta(formattedValue);
  };

  // Calculate the polygon corners based on center and deltas
  const getPolygonCoordinates = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const latDelta = parseFloat(latitudeDelta);
    const lngDelta = parseFloat(longitudeDelta);

    return [
      { latitude: lat + latDelta / 2, longitude: lng - lngDelta / 2 }, // Top-left
      { latitude: lat + latDelta / 2, longitude: lng + lngDelta / 2 }, // Top-right
      { latitude: lat - latDelta / 2, longitude: lng + lngDelta / 2 }, // Bottom-right
      { latitude: lat - latDelta / 2, longitude: lng - lngDelta / 2 }, // Bottom-left
    ];
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {/* Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Latitude (Center):</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={(text) => handleCoordinateChange('latitude', text)}
            placeholder="e.g., 45.4215"
            keyboardType="default"
            returnKeyType="done"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Longitude (Center):</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={(text) => handleCoordinateChange('longitude', text)}
            placeholder="e.g., -75.6972"
            keyboardType="default"
            returnKeyType="done"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Latitude Delta (Zoom):</Text>
          <TextInput
            style={styles.input}
            value={latitudeDelta}
            onChangeText={(text) => handleCoordinateChange('latitudeDelta', text)}
            placeholder="e.g., 0.0922"
            keyboardType="default"
            returnKeyType="done"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Longitude Delta (Zoom):</Text>
          <TextInput
            style={styles.input}
            value={longitudeDelta}
            onChangeText={(text) => handleCoordinateChange('longitudeDelta', text)}
            placeholder="e.g., 0.0421"
            keyboardType="default"
            returnKeyType="done"
          />
        </View>

        {/* Map View */}
        <MapView
          style={styles.map}
          region={{
            latitude: parseFloat(latitude) || 45.4215,
            longitude: parseFloat(longitude) || -75.6972,
            latitudeDelta: parseFloat(latitudeDelta) || 0.0922,
            longitudeDelta: parseFloat(longitudeDelta) || 0.0421,
          }}
        >
          {/* Polygon to outline the area */}
          <Polygon
            coordinates={getPolygonCoordinates()}
            fillColor="rgba(0, 150, 255, 0.2)" // Light blue transparent fill
            strokeColor="rgba(0, 150, 255, 1)" // Blue border
            strokeWidth={2}
          />
        </MapView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.42,
    borderRadius: 10,
  },
  inputGroup: {
    width: Dimensions.get('window').width * 0.9,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#f5f5f5',
  },
});
