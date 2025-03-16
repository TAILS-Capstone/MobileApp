import React, { useState } from 'react';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { StyleSheet, Dimensions, View, TextInput, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Button, ScrollView } from 'react-native';

export default function MapNative() {
  const [latitude, setLatitude] = useState('45.4215'); // Default Ottawa
  const [longitude, setLongitude] = useState('-75.6972'); // Default Ottawa
  const [latitudeDelta, setLatitudeDelta] = useState('0.03');
  const [longitudeDelta, setLongitudeDelta] = useState('0.04');
  const [polygonCoordinatesInput, setPolygonCoordinatesInput] = useState('');
  const [pinCoordinatesInput, setPinCoordinatesInput] = useState('');
  const [markers, setMarkers] = useState([]); // State to hold added pins
  const [customPolygonCoords, setCustomPolygonCoords] = useState(null);

  // Calculate the polygon corners based on center and deltas
  const getPolygonCoordinates = () => {
    if (customPolygonCoords) return customPolygonCoords;

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

  // Add a new pin based on the current center coordinates
  const handleAddPin = () => {
    const newMarker = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    setMarkers([...markers, newMarker]);
  };

  // Parse the polygon coordinates from the input field
  const handlePolygonCoordinatesSubmit = () => {
    try {
      // Expected format: "lat1,lng1,lat2,lng2,lat3,lng3,lat4,lng4"
      const coords = polygonCoordinatesInput.split(',').map(val => val.trim());
      
      if (coords.length < 8) {
        alert('Please enter at least 4 coordinate pairs (8 values)');
        return;
      }
      
      const parsedCoords = [];
      for (let i = 0; i < coords.length; i += 2) {
        parsedCoords.push({
          latitude: parseFloat(coords[i]),
          longitude: parseFloat(coords[i + 1])
        });
      }
      
      setCustomPolygonCoords(parsedCoords);
      
      // Update center to the middle of the polygon
      const sumLat = parsedCoords.reduce((sum, coord) => sum + coord.latitude, 0);
      const sumLng = parsedCoords.reduce((sum, coord) => sum + coord.longitude, 0);
      setLatitude((sumLat / parsedCoords.length).toString());
      setLongitude((sumLng / parsedCoords.length).toString());
    } catch (error) {
      alert('Invalid coordinate format. Please use "lat1,lng1,lat2,lng2,..."');
    }
  };

  // Parse the pin coordinates from the input field
  const handlePinCoordinatesSubmit = () => {
    try {
      // Expected format: "lat1,lng1,lat2,lng2,..."
      const coords = pinCoordinatesInput.split(',').map(val => val.trim());
      
      if (coords.length < 2 || coords.length % 2 !== 0) {
        alert('Please enter valid coordinate pairs');
        return;
      }
      
      const newMarkers = [];
      for (let i = 0; i < coords.length; i += 2) {
        newMarkers.push({
          latitude: parseFloat(coords[i]),
          longitude: parseFloat(coords[i + 1])
        });
      }
      
      setMarkers([...markers, ...newMarkers]);
      setPinCoordinatesInput('');
    } catch (error) {
      alert('Invalid coordinate format. Please use "lat1,lng1,lat2,lng2,..."');
    }
  };

  // Prepare the polygon coordinates string on one line
  const polygonCoords = getPolygonCoordinates();
  const polygonCoordsString = polygonCoords
    .map(coord => `${coord.latitude.toFixed(4)},${coord.longitude.toFixed(4)}`)
    .join(',');

  // Prepare the pins coordinates string on one line
  const pinCoordsString = markers
    .map(marker => `${marker.latitude.toFixed(4)},${marker.longitude.toFixed(4)}`)
    .join(',');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          {/* Map View - Now larger */}
          <MapView
            style={styles.map}
            region={{
              latitude: parseFloat(latitude) || 45.4215,
              longitude: parseFloat(longitude) || -75.6972,
              latitudeDelta: parseFloat(latitudeDelta) || 0.0922,
              longitudeDelta: parseFloat(longitudeDelta) || 0.0421,
            }}
          >
            {/* Polygon outlining the area */}
            <Polygon
              coordinates={polygonCoords}
              fillColor="rgba(0, 150, 255, 0.2)"
              strokeColor="rgba(0, 150, 255, 1)"
              strokeWidth={2}
            />
            {/* Render added markers */}
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={marker} />
            ))}
          </MapView>

          {/* Polygon Coordinates Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Polygon Coordinates (lat1,lng1,lat2,lng2,...):</Text>
            <View style={styles.inputRowContainer}>
              <TextInput
                style={[styles.input, styles.coordinateInput]}
                value={polygonCoordinatesInput}
                onChangeText={setPolygonCoordinatesInput}
                placeholder="e.g., 45.4315,-75.7072,45.4315,-75.6872,..."
                keyboardType="default"
                returnKeyType="done"
              />
              <Button title="Set" onPress={handlePolygonCoordinatesSubmit} />
            </View>
          </View>

          {/* Pin Coordinates Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Pins (lat1,lng1,lat2,lng2,...):</Text>
            <View style={styles.inputRowContainer}>
              <TextInput
                style={[styles.input, styles.coordinateInput]}
                value={pinCoordinatesInput}
                onChangeText={setPinCoordinatesInput}
                placeholder="e.g., 45.4215,-75.6972,45.4315,-75.7072"
                keyboardType="default"
                returnKeyType="done"
              />
              <Button title="Add" onPress={handlePinCoordinatesSubmit} />
            </View>
          </View>

          {/* Display Coordinates */}
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>Polygon Coordinates:</Text>
            <TextInput
              style={styles.coordinatesReadOnly}
              value={polygonCoordsString}
              editable={false}
              multiline={false}
            />
            
            <Text style={styles.coordinatesText}>Pin Coordinates:</Text>
            <TextInput
              style={styles.coordinatesReadOnly}
              value={pinCoordsString}
              editable={false}
              multiline={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1a1a3b',
  },
  map: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.6, // Increased from 0.42 to 0.6
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  inputGroup: {
    width: Dimensions.get('window').width * 0.95,
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
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinateInput: {
    flex: 1,
    marginRight: 10,
  },
  coordinatesContainer: {
    width: Dimensions.get('window').width * 0.95,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  coordinatesText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  coordinatesReadOnly: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#ccc',
    backgroundColor: '#444',
    marginBottom: 10,
  },
});