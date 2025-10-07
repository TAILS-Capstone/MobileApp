import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Text, Platform, Button, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

import type { MapProps } from './types';

interface MapWebProps extends MapProps {
  apiKey?: string;
}

const MapWeb: React.FC<MapWebProps> = ({ apiKey, latestLocation, connectedDeviceName }) => {
  const [latitude, setLatitude] = useState('45.4215');
  const [longitude, setLongitude] = useState('-75.6972');
  const [latitudeDelta, setLatitudeDelta] = useState('0.03');
  const [longitudeDelta, setLongitudeDelta] = useState('0.04');
  const [polygonCoordinatesInput, setPolygonCoordinatesInput] = useState('');
  const [pinCoordinatesInput, setPinCoordinatesInput] = useState('');
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number }>>([]);
  const [customPolygonCoords, setCustomPolygonCoords] = useState<Array<{ lat: number; lng: number }> | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const markersRef = useRef<Array<google.maps.Marker>>([]);
  const deviceMarkerRef = useRef<google.maps.Marker | null>(null);

  const deviceLocationSummary = useMemo(() => {
    if (!connectedDeviceName) {
      return 'Connect a device to begin streaming coordinates';
    }

    if (!latestLocation) {
      return 'Waiting for coordinates';
    }

    return `${latestLocation.latitude.toFixed(5)}, ${latestLocation.longitude.toFixed(5)}`;
  }, [connectedDeviceName, latestLocation]);

  const handleCoordinateChange = (
    type: 'latitude' | 'longitude' | 'latitudeDelta' | 'longitudeDelta',
    value: string
  ) => {
    const formattedValue = value.replace(',', '.');
    switch (type) {
      case 'latitude':
        setLatitude(formattedValue);
        break;
      case 'longitude':
        setLongitude(formattedValue);
        break;
      case 'latitudeDelta':
        setLatitudeDelta(formattedValue);
        break;
      case 'longitudeDelta':
        setLongitudeDelta(formattedValue);
        break;
    }
  };

  // Get polygon coordinates based on center and deltas or custom coordinates
  const getPolygonCoordinates = () => {
    if (customPolygonCoords) return customPolygonCoords;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const latDelta = parseFloat(latitudeDelta);
    const lngDelta = parseFloat(longitudeDelta);

    return [
      { lat: lat + latDelta / 2, lng: lng - lngDelta / 2 }, // Top-left
      { lat: lat + latDelta / 2, lng: lng + lngDelta / 2 }, // Top-right
      { lat: lat - latDelta / 2, lng: lng + lngDelta / 2 }, // Bottom-right
      { lat: lat - latDelta / 2, lng: lng - lngDelta / 2 }, // Bottom-left
    ];
  };

  // Add a new pin based on the current center coordinates
  const handleAddPin = () => {
    const newMarker = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    };
    setMarkers([...markers, newMarker]);

    // Add marker to the map if it exists
    if (mapInstanceRef.current) {
      const marker = new google.maps.Marker({
        position: newMarker,
        map: mapInstanceRef.current,
      });
      markersRef.current.push(marker);
    }
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
          lat: parseFloat(coords[i]),
          lng: parseFloat(coords[i + 1])
        });
      }
      
      setCustomPolygonCoords(parsedCoords);
      
      // Update center to the middle of the polygon
      const sumLat = parsedCoords.reduce((sum, coord) => sum + coord.lat, 0);
      const sumLng = parsedCoords.reduce((sum, coord) => sum + coord.lng, 0);
      setLatitude((sumLat / parsedCoords.length).toString());
      setLongitude((sumLng / parsedCoords.length).toString());

      // Update the polygon on the map
      if (polygonRef.current && mapInstanceRef.current) {
        polygonRef.current.setPath(parsedCoords);
        mapInstanceRef.current.setCenter({ 
          lat: sumLat / parsedCoords.length, 
          lng: sumLng / parsedCoords.length 
        });
      }
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
          lat: parseFloat(coords[i]),
          lng: parseFloat(coords[i + 1])
        });
      }
      
      setMarkers([...markers, ...newMarkers]);
      setPinCoordinatesInput('');

      // Add markers to the map
      if (mapInstanceRef.current) {
        for (const newMarker of newMarkers) {
          const marker = new google.maps.Marker({
            position: newMarker,
            map: mapInstanceRef.current,
          });
          markersRef.current.push(marker);
        }
      }
    } catch (error) {
      alert('Invalid coordinate format. Please use "lat1,lng1,lat2,lng2,..."');
    }
  };

  // Prepare the polygon coordinates string
  const polygonCoords = getPolygonCoordinates();
  const polygonCoordsString = polygonCoords
    .map(coord => `${coord.lat.toFixed(4)},${coord.lng.toFixed(4)}`)
    .join(',');

  // Prepare the pins coordinates string
  const pinCoordsString = markers
    .map(marker => `${marker.lat.toFixed(4)},${marker.lng.toFixed(4)}`)
    .join(',');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || 'AIzaSyC3mGlwQr09aHqh3_3__fQL1pR4X88-qz8'}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { 
            lat: parseFloat(latitude), 
            lng: parseFloat(longitude) 
          },
          zoom: Math.round(14 - Math.log2(parseFloat(latitudeDelta) * 100)),
          mapTypeId: 'roadmap',
          disableDefaultUI: false,
        });
        mapInstanceRef.current = map;

        const polygon = new google.maps.Polygon({
          paths: getPolygonCoordinates(),
          strokeColor: '#0096FF',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          fillColor: '#0096FF',
          fillOpacity: 0.2,
        });
        polygon.setMap(map);
        polygonRef.current = polygon;

        // Add existing markers to the map
        for (const marker of markers) {
          const newMarker = new google.maps.Marker({
            position: marker,
            map: map,
          });
          markersRef.current.push(newMarker);
        }
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (deviceMarkerRef.current) {
        deviceMarkerRef.current.setMap(null);
        deviceMarkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    if (!latestLocation || typeof window === 'undefined' || !(window as any).google?.maps) {
      if (deviceMarkerRef.current) {
        deviceMarkerRef.current.setMap(null);
        deviceMarkerRef.current = null;
      }
      return;
    }

    const { latitude: lat, longitude: lng } = latestLocation;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    const position = { lat, lng };

    if (!deviceMarkerRef.current) {
      deviceMarkerRef.current = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: connectedDeviceName ?? 'BLE Device',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#22c55e',
          fillOpacity: 0.9,
          strokeColor: '#14532d',
          strokeWeight: 2,
        },
      });
    } else {
      deviceMarkerRef.current.setPosition(position);
      deviceMarkerRef.current.setTitle(connectedDeviceName ?? 'BLE Device');
    }

    mapInstanceRef.current.setCenter(position);
  }, [latestLocation, connectedDeviceName]);

  useEffect(() => {
    if (mapInstanceRef.current && polygonRef.current) {
      const newCoords = getPolygonCoordinates();
      polygonRef.current.setPath(newCoords);
      
      mapInstanceRef.current.setCenter({ 
        lat: parseFloat(latitude), 
        lng: parseFloat(longitude) 
      });
      
      const zoom = Math.round(14 - Math.log2(parseFloat(latitudeDelta) * 100));
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [latitude, longitude, latitudeDelta, longitudeDelta]);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (typeof Keyboard !== 'undefined' && Keyboard.dismiss) {
        Keyboard.dismiss();
      }
    }}>
      <KeyboardAvoidingView style={styles.mainContainer} behavior="padding">
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <View style={styles.container}>
            {/* Map View */}
            <div
              ref={mapRef}
              style={{
                width: '100%',
                height: '60vh',
                borderRadius: '10px',
                marginBottom: '15px'
              }}
            />

            <View style={styles.deviceStatusCard}>
              <Text style={styles.deviceStatusTitle}>Connected Device</Text>
              <Text style={styles.deviceStatusValue}>
                {connectedDeviceName ?? 'No device connected'}
              </Text>
              <Text style={styles.deviceStatusLocation}>{deviceLocationSummary}</Text>
            </View>

            {/* Polygon Coordinates Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Polygon Coordinates (lat1,lng1,lat2,lng2,...):</Text>
              <View style={styles.inputRowContainer}>
                <TextInput
                  style={[styles.input, styles.coordinateInput]}
                  value={polygonCoordinatesInput}
                  onChangeText={setPolygonCoordinatesInput}
                  placeholder="e.g., 45.4315,-75.7072,45.4315,-75.6872,..."
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                />
                <Button title="Add" onPress={handlePinCoordinatesSubmit} />
              </View>
            </View>

            {/* Add single pin at current center */}
            <View style={styles.inputGroup}>
              <Button title="Add Pin at Center" onPress={handleAddPin} />
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

            {/* Only keeping the Delta inputs */}
            <View style={styles.inputsRow}>
              <View style={styles.inputColumn}>
                <Text style={styles.label}>Latitude Delta (Zoom):</Text>
                <TextInput
                  style={styles.input}
                  value={latitudeDelta}
                  onChangeText={(text) => handleCoordinateChange('latitudeDelta', text)}
                  placeholder="0.03"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputColumn}>
                <Text style={styles.label}>Longitude Delta (Zoom):</Text>
                <TextInput
                  style={styles.input}
                  value={longitudeDelta}
                  onChangeText={(text) => handleCoordinateChange('longitudeDelta', text)}
                  placeholder="0.04"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a3b',
    width: '100%',
    minHeight: '100vh',
  },
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 20,
    width: '100%',
  },
  inputColumn: {
    flex: 1,
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
    backgroundColor: '#333',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 10,
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
    width: '100%',
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
  deviceStatusCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  deviceStatusTitle: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  deviceStatusValue: {
    color: '#cbd5f5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceStatusLocation: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default MapWeb;