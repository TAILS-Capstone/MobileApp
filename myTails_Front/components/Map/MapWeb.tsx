import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, Platform, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';

interface MapWebProps {
  apiKey: string;
}

const MapWeb: React.FC<MapWebProps> = () => {
  const [latitude, setLatitude] = useState('45.4215');
  const [longitude, setLongitude] = useState('-75.6972');
  const [latitudeDelta, setLatitudeDelta] = useState('0.03');
  const [longitudeDelta, setLongitudeDelta] = useState('0.04');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);

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

  const getPolygonCoordinates = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const latDelta = parseFloat(latitudeDelta);
    const lngDelta = parseFloat(longitudeDelta);

    return [
      { lat: lat + latDelta / 2, lng: lng - lngDelta / 2 },
      { lat: lat + latDelta / 2, lng: lng + lngDelta / 2 },
      { lat: lat - latDelta / 2, lng: lng + lngDelta / 2 },
      { lat: lat - latDelta / 2, lng: lng - lngDelta / 2 },
    ];
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3mGlwQr09aHqh3_3__fQL1pR4X88-qz8&libraries=places`;
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
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

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
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.inputsRow}>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Latitude (Center):</Text>
            <TextInput
              style={styles.input}
              value={latitude}
              onChangeText={(text) => handleCoordinateChange('latitude', text)}
              placeholder="45.4215"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.label}>Longitude (Center):</Text>
            <TextInput
              style={styles.input}
              value={longitude}
              onChangeText={(text) => handleCoordinateChange('longitude', text)}
              placeholder="-75.6972"
              placeholderTextColor="#999"
            />
          </View>
        </View>
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
        
        <div 
          ref={mapRef}
          style={{
            width: '100%',
            height: '70vh',
            borderRadius: '8px',
            marginTop: '10px'
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1b2e',
    width: '100%',
    minHeight: '100vh',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    padding: 20,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 20,
  },
  inputColumn: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    color: '#000',
    width: '100%',
  },
});

export default MapWeb;